import { useState } from 'react';
import { useCharacterStore, TALENTS, getClassNameReadable } from '../store/useCharacterStore';
import type { Talent } from '../types';
import { XPIcon } from './XPIcon';

export function TomeOfRules() {
  // Global Store State & Actions
  const charState = useCharacterStore((state) => state.charState);
  const changeClass = useCharacterStore((state) => state.changeClass);
  const buyTalent = useCharacterStore((state) => state.buyTalent);
  const refundTalent = useCharacterStore((state) => state.refundTalent);

  const gameConfig = useCharacterStore((state) => state.gameConfig);
  const allClassKeys = Array.from(new Set([
    ...Object.keys(gameConfig?.classes || TALENTS.classes || {})
  ]));

  // Calculator State & Actions
  const calculator = useCharacterStore((state) => state.calculator);
  const adjustCalculator = useCharacterStore((state) => state.adjustCalculator);
  const clearCalculator = useCharacterStore((state) => state.clearCalculator);
  const applyCalculatorXP = useCharacterStore((state) => state.applyCalculatorXP);

  // Gold State & Actions
  const tomeGoldInput = useCharacterStore((state) => state.tomeGoldInput);
  const setTomeGoldInput = useCharacterStore((state) => state.setTomeGoldInput);
  const modifyGold = useCharacterStore((state) => state.modifyGold);

  // Monster Logger State & Actions
  const tomeMonsterInput = useCharacterStore((state) => state.tomeMonsterInput);
  const tomeMonsterTierInput = useCharacterStore((state) => state.tomeMonsterTierInput);
  const setTomeMonsterInput = useCharacterStore((state) => state.setTomeMonsterInput);
  const setTomeMonsterTierInput = useCharacterStore((state) => state.setTomeMonsterTierInput);
  const logMonsterKill = useCharacterStore((state) => state.logMonsterKill);
  const adjustTomeMonster = useCharacterStore((state) => state.adjustTomeMonster);
  const inputs = useCharacterStore((state) => state.inputs);

  // Parse active monsters from sheet inputs (rows 1-22)
  const getActiveMonsters = () => {
    const list: Array<{ index: number; name: string; kills: number }> = [];
    for (let i = 1; i <= 22; i++) {
      const name = (inputs[`foe-name-${i}`] || '').trim();
      const kills = parseInt(inputs[`foe-kills-${i}`]) || 0;
      if (name) {
        list.push({ index: i, name, kills });
      }
    }
    return list;
  };

  const activeMonsters = getActiveMonsters();

  // Local state for tracking selected modifiers
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);

  const tiers = (gameConfig?.xpSettings || []).filter((s) => s.key.toLowerCase().startsWith('tier'));
  const modifiersList = (gameConfig?.xpSettings || []).filter((s) => !s.key.toLowerCase().startsWith('tier'));

  const toggleModifier = (label: string) => {
    if (selectedModifiers.includes(label)) {
      setSelectedModifiers(selectedModifiers.filter((m) => m !== label));
    } else {
      setSelectedModifiers([...selectedModifiers, label]);
    }
  };

  const handleLogKill = () => {
    logMonsterKill(selectedModifiers);
    setSelectedModifiers([]);
  };

  // Helper to render individual talent card
  const renderTalentCard = (talent: Talent) => {
    const count = charState.purchasedTalents[talent.id] || 0;
    const max = talent.max || 1;
    const isMaxed = count >= max;
    const canBuy = charState.apAvailable >= talent.cost && !isMaxed;

    if (max > 1) {
      const minusDisabled = count === 0;
      const plusDisabled = !canBuy;

      return (
        <div key={talent.id} className="talent-card">
          <div className="talent-info">
            <div className="talent-name-row">
              <span className="talent-name">{talent.name}</span>
              <span className="talent-cost">{talent.cost} AP</span>
            </div>
            <div className="talent-desc">{talent.desc}</div>
          </div>
          <div className="talent-actions">
            <span style={{ fontFamily: 'MedievalSharp, cursive', fontSize: '11px', marginRight: '5px', color: '#4a2e13' }}>
              {count}/{max}
            </span>
            <button
              className="calc-btn"
              onClick={() => refundTalent(talent.id)}
              disabled={minusDisabled}
            >
              -
            </button>
            <button
              className="calc-btn"
              onClick={() => buyTalent(talent.id)}
              disabled={plusDisabled}
            >
              +
            </button>
          </div>
        </div>
      );
    } else {
      const learned = count > 0;
      const btnText = learned ? 'Forget' : 'Learn';
      const btnClass = learned ? 'learned' : '';
      const plusDisabled = !learned && !canBuy;

      return (
        <div key={talent.id} className="talent-card">
          <div className="talent-info">
            <div className="talent-name-row">
              <span className="talent-name">{talent.name}</span>
              <span className="talent-cost">{talent.cost} AP</span>
            </div>
            <div className="talent-desc">{talent.desc}</div>
          </div>
          <div className="talent-actions">
            <button
              className={`talent-buy-btn ${btnClass}`}
              onClick={() => (learned ? refundTalent(talent.id) : buyTalent(talent.id))}
              disabled={plusDisabled}
            >
              {btnText}
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div id="rulebook-tab" className="tab-content active">
      <div className="tome-container">
        {/* LEFT PAGE: XP CALCULATOR */}
        <div className="tome-page">
          <h2>XP Calculator</h2>
          
          <h3>Select Slayings & Achievements</h3>
          <div style={{ maxHeight: '520px', overflowY: 'auto', marginBottom: '10px' }}>
            <table className="rulebook-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th style={{ width: '50px', textAlign: 'center' }}>XP</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {gameConfig.xpSettings.map((setting) => (
                  <tr key={setting.key}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <XPIcon name={setting.icon} size={18} style={{ color: '#4a2e13', opacity: 0.85 }} />
                        <strong>{setting.label}</strong>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ color: '#855d14', fontWeight: 'bold' }}>+{setting.xp}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="calc-control" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <button className="calc-btn" onClick={() => adjustCalculator(setting.key, -1)}>-</button>
                        <input type="text" className="calc-input" value={calculator[setting.key] || 0} readOnly style={{ width: '30px', textAlign: 'center' }} />
                        <button className="calc-btn" onClick={() => adjustCalculator(setting.key, 1)}>+</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
            <button className="action-btn reset" style={{ backgroundColor: '#724216', borderColor: '#5c3e21' }} onClick={clearCalculator}>Reset</button>
            <button className="action-btn" style={{ backgroundColor: '#2e5c1e', borderColor: '#1a3c0e', color: '#fff' }} onClick={applyCalculatorXP}>Add to XP</button>
          </div>
        </div>

        <div className="tome-divider"></div>

        {/* CENTER PAGE: TALENT CODEX */}
        <div className="tome-page">
          <h2>Talent Codex</h2>
          
          {/* AP Dashboard */}
          <div className="ap-dashboard">
            <div className="ap-stat">
              <span>Level</span>
              <span className="ap-val" id="ap-level">{charState.level}</span>
            </div>
            <div className="ap-stat">
              <span>Total AP</span>
              <span className="ap-val" id="ap-total">{charState.apEarned}</span>
            </div>
            <div className="ap-stat">
              <span>AP Spent</span>
              <span className="ap-val" id="ap-spent">{charState.apSpent}</span>
            </div>
            <div className="ap-stat">
              <span>AP Free</span>
              <span className="ap-val" id="ap-available">{charState.apAvailable}</span>
            </div>
          </div>

          {/* Class Dropdown Selector */}
          <label style={{ fontFamily: 'Cinzel, serif', fontSize: '9px', color: '#4a2e13', fontWeight: 'bold', display: 'block', marginBottom: '3px', textTransform: 'uppercase' }}>
            Hero Class Specialization
          </label>
          <select
            id="codex-class-select"
            className="gothic-select"
            value={charState.class}
            onChange={(e) => changeClass(e.target.value)}
          >
              <option value="">-- Choose Specialization --</option>
              {allClassKeys.map((cKey) => (
                <option key={cKey} value={cKey}>
                  {getClassNameReadable(cKey)}
                </option>
              ))}
            </select>

          {/* Scrollable Talent Catalog */}
          <div id="codex-talent-list" style={{ overflowY: 'auto', maxHeight: '430px' }}>
            <div className="talent-group-title">Shared Talents</div>
            <div className="talent-grid" style={{ marginBottom: '14px' }}>
              {(gameConfig.sharedTalents || TALENTS.shared || []).map((t) => renderTalentCard(t))}
            </div>

            {charState.class && (gameConfig.classes[charState.class] || TALENTS.classes[charState.class]) ? (
              <>
                <div className="talent-group-title">{getClassNameReadable(charState.class)} Talents</div>
                <div className="talent-grid">
                  {(gameConfig.classes[charState.class]?.talents || TALENTS.classes[charState.class] || []).map((t) => renderTalentCard(t))}
                </div>
              </>
            ) : (
              <>
                <div className="talent-group-title">Class Talents</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '13.5px', fontStyle: 'italic', color: '#724216', textAlign: 'center', margin: '15px 0' }}>
                  Choose a specialization dropdown above to show class talent paths.
                </div>
              </>
            )}
          </div>
        </div>

        <div className="tome-divider"></div>

        {/* RIGHT PAGE: ADVENTURE LEDGER */}
        <div className="tome-page">
          <h2>Adventure Ledger</h2>
          
          <h3>1. Gold Calculator</h3>
          <div className="parchment-box" style={{ padding: '10px', marginBottom: '12px', backgroundColor: 'rgba(253, 248, 235, 0.5)' }}>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', fontWeight: 'bold', color: '#724216', textAlign: 'center', marginBottom: '8px' }}>
              Current Gold: <span id="tome-gold-display" style={{ fontFamily: 'MedievalSharp, cursive', fontSize: '16px', color: '#855d14' }}>{inputs['char-gold'] || '0'}</span> GP
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
              <input
                type="number"
                id="tome-gold-input"
                style={{ width: '85px', textAlign: 'center', padding: '4px', border: '1px solid #5c3e21', backgroundColor: 'rgba(255,255,255,0.7)', fontFamily: 'MedievalSharp, cursive', fontSize: '13px', borderRadius: '3px' }}
                placeholder="Amount"
                value={tomeGoldInput}
                onChange={(e) => setTomeGoldInput(e.target.value)}
              />
              <button className="action-btn" style={{ backgroundColor: '#2e5c1e', borderColor: '#1a3c0e', color: 'white', padding: '4px 10px', fontSize: '9px' }} onClick={() => modifyGold(true)}>Add (+)</button>
              <button className="action-btn reset" style={{ backgroundColor: '#724216', borderColor: '#5c3e21', padding: '4px 10px', fontSize: '9px' }} onClick={() => modifyGold(false)}>Spend (-)</button>
            </div>
          </div>

          <h3>2. Log Monster Kill</h3>
          <div className="parchment-box" style={{ padding: '10px', marginBottom: '12px', backgroundColor: 'rgba(253, 248, 235, 0.5)' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
              <input
                type="text"
                id="tome-monster-input"
                style={{ flex: 1, minWidth: 0, padding: '5px 8px', border: '1px solid #5c3e21', backgroundColor: 'rgba(255,255,255,0.7)', fontFamily: 'MedievalSharp, cursive', fontSize: '12px', borderRadius: '3px' }}
                placeholder="Monster Name (e.g., Goblin)"
                value={tomeMonsterInput}
                onChange={(e) => setTomeMonsterInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLogKill(); }}
              />
              <select
                id="tome-monster-tier-select"
                style={{
                  padding: '5px 8px',
                  border: '1px solid #5c3e21',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  fontFamily: 'MedievalSharp, cursive',
                  fontSize: '12px',
                  borderRadius: '3px',
                  color: '#4a2e13',
                  cursor: 'pointer'
                }}
                value={tomeMonsterTierInput}
                onChange={(e) => setTomeMonsterTierInput(e.target.value)}
              >
                {tiers.map((setting) => (
                  <option key={setting.key} value={setting.label}>
                    {setting.label}
                  </option>
                ))}
              </select>
              <button className="action-btn" style={{ backgroundColor: '#4a2e13', borderColor: '#d4af37', padding: '5px 12px', fontSize: '9px', flexShrink: 0 }} onClick={handleLogKill}>Log Kill</button>
            </div>

            {/* Toggleable Modifier Badges */}
            {modifiersList.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px', justifyContent: 'center', borderTop: '1px dashed rgba(92, 62, 33, 0.2)', paddingTop: '8px' }}>
                {modifiersList.map((mod) => {
                  const active = selectedModifiers.includes(mod.label);
                  return (
                    <button
                      key={mod.key}
                      onClick={() => toggleModifier(mod.label)}
                      style={{
                        padding: '3px 8px',
                        fontSize: '10px',
                        fontFamily: 'MedievalSharp, cursive',
                        borderRadius: '10px',
                        border: '1px solid #5c3e21',
                        backgroundColor: active ? '#5c3e21' : 'rgba(255, 255, 255, 0.5)',
                        color: active ? '#fdfbfa' : '#5c3e21',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        outline: 'none',
                        boxShadow: active ? '0 1px 3px rgba(0,0,0,0.2)' : 'none'
                      }}
                      title={`Add ${mod.label} reward (+${mod.xp} XP)`}
                    >
                      {mod.label} (+{mod.xp})
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <h3>3. Active Monster Ledger</h3>
          <div id="tome-active-monsters" style={{ flex: 1, overflowY: 'auto', maxHeight: '280px', paddingRight: '2px' }}>
            {activeMonsters.length > 0 ? (
              activeMonsters.map((monster) => (
                <div key={monster.index} className="talent-card" style={{ marginBottom: '5px', padding: '6px 8px' }}>
                  <div style={{ flex: 1, fontFamily: 'Cinzel, serif', fontSize: '11px', fontWeight: 'bold', color: '#4a2e13', textAlign: 'left' }}>
                    {monster.name}
                  </div>
                  <div className="talent-actions" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontFamily: 'MedievalSharp, cursive', fontSize: '12px', marginRight: '8px', color: '#8c1e13', fontWeight: 'bold' }}>
                      {monster.kills} Kills
                    </span>
                    <button className="calc-btn" onClick={() => adjustTomeMonster(monster.index, -1)}>-</button>
                    <button className="calc-btn" onClick={() => adjustTomeMonster(monster.index, 1)}>+</button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '13px', fontStyle: 'italic', color: '#724216', textAlign: 'center', padding: '15px 0' }}>
                No active monsters in ledger. Log a kill above to begin!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
