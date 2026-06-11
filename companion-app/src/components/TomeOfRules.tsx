import { useCharacterStore, TALENTS, getClassNameReadable } from '../store/useCharacterStore';
import type { Talent } from '../types';

export function TomeOfRules() {
  // Global Store State & Actions
  const charState = useCharacterStore((state) => state.charState);
  const changeClass = useCharacterStore((state) => state.changeClass);
  const buyTalent = useCharacterStore((state) => state.buyTalent);
  const refundTalent = useCharacterStore((state) => state.refundTalent);

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
  const setTomeMonsterInput = useCharacterStore((state) => state.setTomeMonsterInput);
  const logMonsterKill = useCharacterStore((state) => state.logMonsterKill);
  const adjustTomeMonster = useCharacterStore((state) => state.adjustTomeMonster);
  const inputs = useCharacterStore((state) => state.inputs);

  // Parse active monsters from sheet inputs (rows 1-18)
  const getActiveMonsters = () => {
    const list: Array<{ index: number; name: string; kills: number }> = [];
    for (let i = 1; i <= 18; i++) {
      const name = (inputs[`foe-name-${i}`] || '').trim();
      const kills = parseInt(inputs[`foe-kills-${i}`]) || 0;
      if (name) {
        list.push({ index: i, name, kills });
      }
    }
    return list;
  };

  const activeMonsters = getActiveMonsters();

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
        <div className="tome-divider spine-1"></div>
        <div className="tome-divider spine-2"></div>

        {/* LEFT PAGE: XP CALCULATOR */}
        <div className="tome-page">
          <h2>XP Calculator</h2>
          
          <h3>1. Slaying Log</h3>
          <table className="rulebook-table">
            <thead>
              <tr>
                <th>Monster Tier</th>
                <th className="desktop-table-cell">Examples</th>
                <th className="calc-cell-xp">XP</th>
                <th className="calc-cell-kills">Kills</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="calc-cell-tier">
                  <strong>Tier I</strong>
                  <span className="mobile-monster-list">Goblin, Skeleton, Zombie</span>
                </td>
                <td className="desktop-table-cell calc-cell-monsters">Goblin, Skeleton, Zombie</td>
                <td className="calc-cell-xp"><strong>1</strong></td>
                <td className="calc-cell-kills">
                  <div className="calc-control">
                    <button className="calc-btn" onClick={() => adjustCalculator('tier1', -1)}>-</button>
                    <input type="text" className="calc-input" value={calculator.tier1} readOnly />
                    <button className="calc-btn" onClick={() => adjustCalculator('tier1', 1)}>+</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="calc-cell-tier">
                  <strong>Tier II</strong>
                  <span className="mobile-monster-list">Orc, Fimir, Ghoul, Mummy</span>
                </td>
                <td className="desktop-table-cell calc-cell-monsters">Orc, Fimir, Ghoul, Mummy</td>
                <td className="calc-cell-xp"><strong>2</strong></td>
                <td className="calc-cell-kills">
                  <div className="calc-control">
                    <button className="calc-btn" onClick={() => adjustCalculator('tier2', -1)}>-</button>
                    <input type="text" className="calc-input" value={calculator.tier2} readOnly />
                    <button className="calc-btn" onClick={() => adjustCalculator('tier2', 1)}>+</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="calc-cell-tier">
                  <strong>Tier III</strong>
                  <span className="mobile-monster-list">Chaos Warrior, Wight, Abomination</span>
                </td>
                <td className="desktop-table-cell calc-cell-monsters">Chaos Warrior, Wight, Abomination</td>
                <td className="calc-cell-xp"><strong>4</strong></td>
                <td className="calc-cell-kills">
                  <div className="calc-control">
                    <button className="calc-btn" onClick={() => adjustCalculator('tier3', -1)}>-</button>
                    <input type="text" className="calc-input" value={calculator.tier3} readOnly />
                    <button className="calc-btn" onClick={() => adjustCalculator('tier3', 1)}>+</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="calc-cell-tier">
                  <strong>Tier IV</strong>
                  <span className="mobile-monster-list">Ogre, Gargoyle, Minotaur</span>
                </td>
                <td className="desktop-table-cell calc-cell-monsters">Ogre, Gargoyle, Minotaur</td>
                <td className="calc-cell-xp"><strong>8</strong></td>
                <td className="calc-cell-kills">
                  <div className="calc-control">
                    <button className="calc-btn" onClick={() => adjustCalculator('tier4', -1)}>-</button>
                    <input type="text" className="calc-input" value={calculator.tier4} readOnly />
                    <button className="calc-btn" onClick={() => adjustCalculator('tier4', 1)}>+</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="calc-cell-tier">
                  <strong>Tier V</strong>
                  <span className="mobile-monster-list">Giant, Dragonling, Demon Champ.</span>
                </td>
                <td className="desktop-table-cell calc-cell-monsters">Giant, Dragonling, Demon Champ.</td>
                <td className="calc-cell-xp"><strong>12</strong></td>
                <td className="calc-cell-kills">
                  <div className="calc-control">
                    <button className="calc-btn" onClick={() => adjustCalculator('tier5', -1)}>-</button>
                    <input type="text" className="calc-input" value={calculator.tier5} readOnly />
                    <button className="calc-btn" onClick={() => adjustCalculator('tier5', 1)}>+</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="calc-cell-tier">
                  <strong>Tier VI</strong>
                  <span className="mobile-monster-list">Greater Demon, Ancient Dragon</span>
                </td>
                <td className="desktop-table-cell calc-cell-monsters">Greater Demon, Ancient Dragon</td>
                <td className="calc-cell-xp"><strong>20</strong></td>
                <td className="calc-cell-kills">
                  <div className="calc-control">
                    <button className="calc-btn" onClick={() => adjustCalculator('tier6', -1)}>-</button>
                    <input type="text" className="calc-input" value={calculator.tier6} readOnly />
                    <button className="calc-btn" onClick={() => adjustCalculator('tier6', 1)}>+</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: '5px' }}>3. Bonus XP & Achievements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px', fontFamily: 'Cormorant Garamond, serif', fontSize: '13.5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🎯 <strong>Bounty Target</strong></span>
              <div className="calc-control">
                <span style={{ color: '#855d14', fontWeight: 'bold', marginRight: '5px' }}>+5</span>
                <button className="calc-btn" onClick={() => adjustCalculator('bounty', -1)}>-</button>
                <input type="text" className="calc-input" value={calculator.bounty} readOnly />
                <button className="calc-btn" onClick={() => adjustCalculator('bounty', 1)}>+</button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>👤 <strong>Named Character</strong></span>
              <div className="calc-control">
                <span style={{ color: '#855d14', fontWeight: 'bold', marginRight: '5px' }}>+10</span>
                <button className="calc-btn" onClick={() => adjustCalculator('named', -1)}>-</button>
                <input type="text" className="calc-input" value={calculator.named} readOnly />
                <button className="calc-btn" onClick={() => adjustCalculator('named', 1)}>+</button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🏰 <strong>Dungeon Boss</strong></span>
              <div className="calc-control">
                <span style={{ color: '#855d14', fontWeight: 'bold', marginRight: '5px' }}>+25</span>
                <button className="calc-btn" onClick={() => adjustCalculator('dboss', -1)}>-</button>
                <input type="text" className="calc-input" value={calculator.dboss} readOnly />
                <button className="calc-btn" onClick={() => adjustCalculator('dboss', 1)}>+</button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>👑 <strong>Campaign Boss</strong></span>
              <div className="calc-control">
                <span style={{ color: '#855d14', fontWeight: 'bold', marginRight: '5px' }}>+100</span>
                <button className="calc-btn" onClick={() => adjustCalculator('cboss', -1)}>-</button>
                <input type="text" className="calc-input" value={calculator.cboss} readOnly />
                <button className="calc-btn" onClick={() => adjustCalculator('cboss', 1)}>+</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px', gap: '10px', flexShrink: 0 }}>
            <button className="action-btn reset" style={{ backgroundColor: '#724216', borderColor: '#5c3e21' }} onClick={clearCalculator}>Reset</button>
            <button className="action-btn" style={{ backgroundColor: '#2e5c1e', borderColor: '#1a3c0e', color: '#fff' }} onClick={applyCalculatorXP}>Add to XP</button>
          </div>
        </div>

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
            <option value="barbarian">Barbarian</option>
            <option value="berserker">Berserker</option>
            <option value="lady_berserker">Lady Berserker</option>
            <option value="paladin">Paladin</option>
            <option value="wizard">Wizard</option>
            <option value="lady_elf_archer">Lady Elf Archer</option>
            <option value="mine_dwarf">Mine Dwarf</option>
            <option value="war_dwarf">War Dwarf</option>
            <option value="shamaness">Shamaness</option>
          </select>

          {/* Scrollable Talent Catalog */}
          <div id="codex-talent-list" style={{ overflowY: 'auto', maxHeight: '430px' }}>
            <div className="talent-group-title">Shared Talents</div>
            <div className="talent-grid" style={{ marginBottom: '14px' }}>
              {TALENTS.shared.map((t) => renderTalentCard(t))}
            </div>

            {charState.class && TALENTS.classes[charState.class] ? (
              <>
                <div className="talent-group-title">{getClassNameReadable(charState.class)} Talents</div>
                <div className="talent-grid">
                  {TALENTS.classes[charState.class].map((t) => renderTalentCard(t))}
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
                onKeyDown={(e) => { if (e.key === 'Enter') logMonsterKill(); }}
              />
              <button className="action-btn" style={{ backgroundColor: '#4a2e13', borderColor: '#d4af37', padding: '5px 12px', fontSize: '9px' }} onClick={logMonsterKill}>Log Kill</button>
            </div>
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
