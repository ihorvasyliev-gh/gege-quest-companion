import { useState, useEffect } from 'react';
import { useCharacterStore, getDefaultGameConfig } from '../store/useCharacterStore';
import type { GameConfig, Talent, XPSetting } from '../types';

export function DMPanel() {
  const gameConfig = useCharacterStore((state) => state.gameConfig);
  const saveGameConfig = useCharacterStore((state) => state.saveGameConfig);
  const showToast = useCharacterStore((state) => state.showToast);

  // Local draft state for editing before saving
  const [draftConfig, setDraftConfig] = useState<GameConfig>(() => JSON.parse(JSON.stringify(gameConfig)));
  const [activeSubTab, setActiveSubTab] = useState<'classes' | 'xp' | 'layout'>('classes');
  
  // Selected class for Class & Talents editor
  const [selectedClassKey, setSelectedClassKey] = useState<string>('');
  
  // Temp state for new class
  const [newClassKey, setNewClassKey] = useState('');
  const [newClassName, setNewClassName] = useState('');

  // Temp state for adding a new talent
  const [newTalent, setNewTalent] = useState<Omit<Talent, 'id'>>({
    name: '',
    cost: 1,
    desc: '',
    max: 1,
  });

  // Sync draft state with store config when it loads
  useEffect(() => {
    setDraftConfig(JSON.parse(JSON.stringify(gameConfig)));
  }, [gameConfig]);

  // Initialize selected class key if empty
  useEffect(() => {
    const keys = Object.keys(draftConfig.classes);
    if (keys.length > 0 && !selectedClassKey) {
      setSelectedClassKey(keys[0]);
    }
  }, [draftConfig, selectedClassKey]);

  // Handle Save
  const handleSave = async () => {
    // Validate classes
    for (const key in draftConfig.classes) {
      if (!draftConfig.classes[key].name.trim()) {
        showToast(`Class "${key}" cannot have an empty name.`, 'error');
        return;
      }
    }
    // Validate XP settings
    for (const setting of draftConfig.xpSettings) {
      if (!setting.key.trim() || !setting.label.trim()) {
        showToast('XP Calculator categories cannot have empty keys or labels.', 'error');
        return;
      }
    }

    const { error } = await saveGameConfig(draftConfig);
    if (!error) {
      showToast('Game configuration saved successfully!', 'success');
    }
  };

  // Reset to Defaults
  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all game rules, classes, and layouts to default? All custom settings will be lost!')) {
      const defaultConfig = getDefaultGameConfig();
      setDraftConfig(defaultConfig);
      setSelectedClassKey(Object.keys(defaultConfig.classes)[0] || '');
      showToast('Reset to default values in draft. Click "Save Changes" to publish.', 'success');
    }
  };

  // --- Classes Editor Actions ---
  const handleAddClass = () => {
    const key = newClassKey.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const name = newClassName.trim();
    if (!key || !name) {
      showToast('Please enter both a Class Key and Class Name.', 'error');
      return;
    }
    if (draftConfig.classes[key]) {
      showToast('A class with this key already exists.', 'error');
      return;
    }

    const updated = { ...draftConfig };
    updated.classes[key] = {
      name,
      talents: [],
    };
    setDraftConfig(updated);
    setSelectedClassKey(key);
    setNewClassKey('');
    setNewClassName('');
    showToast(`Class "${name}" added.`, 'success');
  };

  const handleDeleteClass = (key: string) => {
    if (window.confirm(`Are you sure you want to delete the class "${getClassName(key)}"? All players configured to this class will lose access to its talents.`)) {
      const updated = { ...draftConfig };
      delete updated.classes[key];
      setDraftConfig(updated);
      setSelectedClassKey(Object.keys(updated.classes)[0] || '');
      showToast('Class deleted from draft.', 'success');
    }
  };

  const handleAddTalent = () => {
    if (!selectedClassKey) return;
    const name = newTalent.name.trim();
    const desc = newTalent.desc.trim();
    if (!name || !desc) {
      showToast('Talent must have a Name and Description.', 'error');
      return;
    }

    const talentId = name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Math.random().toString(36).substring(2, 5);
    const added: Talent = {
      id: talentId,
      name,
      cost: Number(newTalent.cost),
      desc,
      max: newTalent.max ? Number(newTalent.max) : undefined,
    };

    const updated = { ...draftConfig };
    updated.classes[selectedClassKey].talents.push(added);
    setDraftConfig(updated);
    setNewTalent({ name: '', cost: 1, desc: '', max: 1 });
    showToast(`Talent "${name}" added to ${getClassName(selectedClassKey)}.`, 'success');
  };

  const handleDeleteTalent = (classKey: string, talentId: string) => {
    const updated = { ...draftConfig };
    updated.classes[classKey].talents = updated.classes[classKey].talents.filter((t) => t.id !== talentId);
    setDraftConfig(updated);
    showToast('Talent deleted from class.', 'success');
  };

  const getClassName = (key: string) => {
    return draftConfig.classes[key]?.name || key;
  };

  // --- XP Calculator Actions ---
  const handleAddXPCategory = () => {
    const key = `custom_${Math.random().toString(36).substring(2, 7)}`;
    const updated = { ...draftConfig };
    updated.xpSettings.push({
      key,
      label: 'New Category',
      xp: 5,
    });
    setDraftConfig(updated);
  };

  const handleUpdateXPSetting = (index: number, field: keyof XPSetting, value: string | number) => {
    const updated = { ...draftConfig };
    const setting = updated.xpSettings[index];
    if (setting) {
      if (field === 'xp') {
        setting.xp = Number(value) || 0;
      } else if (field === 'label') {
        setting.label = String(value);
      } else if (field === 'key') {
        setting.key = String(value).trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
      }
      setDraftConfig(updated);
    }
  };

  const handleDeleteXPCategory = (index: number) => {
    const updated = { ...draftConfig };
    updated.xpSettings.splice(index, 1);
    setDraftConfig(updated);
    showToast('XP category removed.', 'success');
  };

  // --- Layout Actions ---
  const handleUpdateLayoutSetting = (fieldId: string, visible: boolean, label: string) => {
    const updated = { ...draftConfig };
    if (!updated.sheetLayout[fieldId]) {
      updated.sheetLayout[fieldId] = { visible: true, label: fieldId };
    }
    updated.sheetLayout[fieldId].visible = visible;
    updated.sheetLayout[fieldId].label = label;
    setDraftConfig(updated);
  };

  const layoutKeys = [
    { key: 'hero-name', label: 'Identity: Hero Name' },
    { key: 'hero-class', label: 'Identity: Class Selection' },
    { key: 'stat-attack', label: 'Stat: Attack Dice' },
    { key: 'stat-defense', label: 'Stat: Defend Dice' },
    { key: 'stat-body', label: 'Stat: Body Points Max' },
    { key: 'stat-mind', label: 'Stat: Mind Points Max' },
    { key: 'health-tracker', label: 'Tracker: Body Points Health Grid' },
    { key: 'char-gold', label: 'Loot: Gold Coins Counter' },
    { key: 'weapons-gear', label: 'Section: Weapons & Gear (Page 2)' },
    { key: 'armor-protection', label: 'Section: Armor & Protection (Page 2)' },
    { key: 'defeated-foes', label: 'Section: Defeated Foes Ledger (Page 2)' },
    { key: 'spells-scrolls', label: 'Section: Spellbook & Magic Scrolls (Page 3)' },
    { key: 'notes-rules', label: 'Section: Notes & Special Rules (Page 4)' },
  ];

  return (
    <div id="dm-tab" className="tab-content active" style={{ paddingBottom: '80px' }}>
      <div className="page-wrapper">
        <div className="page" id="dm-panel-page" style={{ height: 'auto', minHeight: '600px' }}>
          
          <div className="header-container" style={{ marginBottom: '15px' }}>
            <h1 className="main-title">🛡️ DUNGEON MASTER PANEL</h1>
            <div className="subtitle">Configure Game Classes, Monsters, and Layout overrides</div>
          </div>

          {/* Sub Navigation */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #4a2e13', paddingBottom: '10px' }}>
            <button
              type="button"
              className={`nav-btn ${activeSubTab === 'classes' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('classes')}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Classes & Talents
            </button>
            <button
              type="button"
              className={`nav-btn ${activeSubTab === 'xp' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('xp')}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              XP Calculator
            </button>
            <button
              type="button"
              className={`nav-btn ${activeSubTab === 'layout' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('layout')}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Hero Sheet Layout
            </button>
          </div>

          {/* TAB 1: CLASSES & TALENTS */}
          {activeSubTab === 'classes' && (
            <div>
              <div className="row" style={{ alignItems: 'flex-start' }}>
                
                {/* Left Side: Class Selection & Addition */}
                <div className="parchment-box flex-1" style={{ padding: '15px', zIndex: 2 }}>
                  <h3>Game Classes</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Select Class to Edit:</label>
                    <select
                      value={selectedClassKey}
                      onChange={(e) => setSelectedClassKey(e.target.value)}
                      style={{
                        padding: '6px',
                        background: '#fdf8eb',
                        border: '1px solid #4a2e13',
                        color: '#4a2e13',
                        fontFamily: 'inherit',
                        borderRadius: '4px',
                        width: '100%',
                      }}
                    >
                      {Object.keys(draftConfig.classes).map((key) => (
                        <option key={key} value={key}>
                          {getClassName(key)} ({key})
                        </option>
                      ))}
                    </select>

                    {selectedClassKey && (
                      <button
                        type="button"
                        className="action-btn reset"
                        onClick={() => handleDeleteClass(selectedClassKey)}
                        style={{ marginTop: '5px', width: '100%' }}
                      >
                        ❌ Delete Selected Class
                      </button>
                    )}
                  </div>

                  <div className="divider" style={{ margin: '15px 0' }} />

                  <h3>Add Custom Class</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    <div>
                      <label style={{ fontSize: '10px', display: 'block' }}>Class Unique ID (e.g. warlock):</label>
                      <input
                        type="text"
                        value={newClassKey}
                        onChange={(e) => setNewClassKey(e.target.value)}
                        placeholder="warlock"
                        style={{ width: '100%', padding: '6px', border: '1px solid #8f6e4a', background: '#fff9f0' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', display: 'block' }}>Display Name (e.g. Warlock):</label>
                      <input
                        type="text"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="Warlock"
                        style={{ width: '100%', padding: '6px', border: '1px solid #8f6e4a', background: '#fff9f0' }}
                      />
                    </div>
                    <button
                      type="button"
                      className="action-btn"
                      onClick={handleAddClass}
                      style={{ marginTop: '5px' }}
                    >
                      ➕ Create Class
                    </button>
                  </div>
                </div>

                {/* Right Side: Talents list of the Selected Class */}
                <div className="parchment-box flex-2" style={{ padding: '15px', zIndex: 2 }}>
                  {selectedClassKey ? (
                    <div>
                      <h3>Talents for {getClassName(selectedClassKey)}</h3>
                      
                      <div style={{ maxHeight: '250px', overflowY: 'auto', marginTop: '10px', paddingRight: '5px' }}>
                        {draftConfig.classes[selectedClassKey]?.talents.length === 0 ? (
                          <div style={{ fontSize: '12px', fontStyle: 'italic', padding: '10px 0' }}>
                            No talents added yet for this class. Add one below!
                          </div>
                        ) : (
                          <table className="ref-table" style={{ width: '100%' }}>
                            <thead>
                              <tr>
                                <th style={{ width: '30%' }}>Talent Name</th>
                                <th style={{ width: '15%', textAlign: 'center' }}>Cost (AP)</th>
                                <th style={{ width: '45%' }}>Description</th>
                                <th style={{ width: '10%' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {draftConfig.classes[selectedClassKey]?.talents.map((talent) => (
                                <tr key={talent.id}>
                                  <td><strong>{talent.name}</strong></td>
                                  <td style={{ textAlign: 'center' }}>{talent.cost}</td>
                                  <td style={{ fontSize: '11px' }}>
                                    {talent.desc} {talent.max ? `(Max ${talent.max} buys)` : ''}
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTalent(selectedClassKey, talent.id)}
                                      style={{
                                        border: 'none',
                                        background: 'none',
                                        color: '#b02a2a',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                      }}
                                    >
                                      🗑️
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>

                      <div className="divider" style={{ margin: '15px 0' }} />

                      <h3>Add Talent to {getClassName(selectedClassKey)}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                        <div>
                          <label style={{ fontSize: '10px', display: 'block' }}>Talent Name:</label>
                          <input
                            type="text"
                            value={newTalent.name}
                            onChange={(e) => setNewTalent({ ...newTalent, name: e.target.value })}
                            placeholder="Eldritch Blast"
                            style={{ width: '100%', padding: '6px', border: '1px solid #8f6e4a', background: '#fff9f0' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '10px', display: 'block' }}>AP Cost:</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={newTalent.cost}
                            onChange={(e) => setNewTalent({ ...newTalent, cost: Number(e.target.value) || 1 })}
                            style={{ width: '100%', padding: '6px', border: '1px solid #8f6e4a', background: '#fff9f0' }}
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ fontSize: '10px', display: 'block' }}>Description / Effect:</label>
                          <input
                            type="text"
                            value={newTalent.desc}
                            onChange={(e) => setNewTalent({ ...newTalent, desc: e.target.value })}
                            placeholder="Deal +1 damage at range once per quest."
                            style={{ width: '100%', padding: '6px', border: '1px solid #8f6e4a', background: '#fff9f0' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '10px', display: 'block' }}>Max Purchases (blank for 1):</label>
                          <input
                            type="number"
                            min="1"
                            value={newTalent.max || ''}
                            onChange={(e) => setNewTalent({ ...newTalent, max: e.target.value ? Number(e.target.value) : undefined })}
                            placeholder="1"
                            style={{ width: '100%', padding: '6px', border: '1px solid #8f6e4a', background: '#fff9f0' }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                          <button
                            type="button"
                            className="action-btn"
                            onClick={handleAddTalent}
                            style={{ width: '100%', height: '32px' }}
                          >
                            ➕ Add Talent
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', fontStyle: 'italic' }}>
                      Add a class first on the left to add talents.
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: XP CALCULATOR */}
          {activeSubTab === 'xp' && (
            <div className="parchment-box" style={{ padding: '15px', zIndex: 2 }}>
              <h3>XP Calculator Categories</h3>
              <p style={{ fontSize: '11px', margin: '5px 0 15px 0', opacity: 0.8 }}>
                Modify the challenge categories for the player's XP Calculator. Slaying counts of these categories will automatically sum up to compute their XP.
              </p>

              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table className="ref-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '25%' }}>Category Key (ID)</th>
                      <th style={{ width: '45%' }}>Display Name</th>
                      <th style={{ width: '20%', textAlign: 'center' }}>XP Reward</th>
                      <th style={{ width: '10%', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draftConfig.xpSettings.map((setting, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            value={setting.key}
                            onChange={(e) => handleUpdateXPSetting(index, 'key', e.target.value)}
                            style={{ width: '90%', padding: '4px', border: '1px solid #c8ab80', background: '#fffdf9' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={setting.label}
                            onChange={(e) => handleUpdateXPSetting(index, 'label', e.target.value)}
                            style={{ width: '95%', padding: '4px', border: '1px solid #c8ab80', background: '#fffdf9' }}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <input
                            type="number"
                            min="0"
                            value={setting.xp}
                            onChange={(e) => handleUpdateXPSetting(index, 'xp', e.target.value)}
                            style={{ width: '60px', padding: '4px', textAlign: 'center', border: '1px solid #c8ab80', background: '#fffdf9' }}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteXPCategory(index)}
                            style={{ border: 'none', background: 'none', color: '#b02a2a', cursor: 'pointer' }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '15px' }}>
                <button
                  type="button"
                  className="action-btn"
                  onClick={handleAddXPCategory}
                >
                  ➕ Add Custom Category
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: HERO SHEET LAYOUT */}
          {activeSubTab === 'layout' && (
            <div className="parchment-box" style={{ padding: '15px', zIndex: 2 }}>
              <h3>Hero Sheet Fields Overrides</h3>
              <p style={{ fontSize: '11px', margin: '5px 0 15px 0', opacity: 0.8 }}>
                Rename labels or toggle visibility of standard fields on the player sheet. Unchecked fields will be completely hidden from their layout.
              </p>

              <table className="ref-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '15%', textAlign: 'center' }}>Visible</th>
                    <th style={{ width: '40%' }}>Default Field Position</th>
                    <th style={{ width: '45%' }}>Display Label Override</th>
                  </tr>
                </thead>
                <tbody>
                  {layoutKeys.map((item) => {
                    const currentSetting = draftConfig.sheetLayout[item.key] || { visible: true, label: item.key };
                    return (
                      <tr key={item.key}>
                        <td style={{ textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={currentSetting.visible}
                            onChange={(e) => handleUpdateLayoutSetting(item.key, e.target.checked, currentSetting.label)}
                            style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                          />
                        </td>
                        <td>
                          <span style={{ fontSize: '12px' }}>{item.label}</span>
                          <code style={{ fontSize: '10px', display: 'block', color: '#8b5a2b' }}>({item.key})</code>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={currentSetting.label}
                            onChange={(e) => handleUpdateLayoutSetting(item.key, currentSetting.visible, e.target.value)}
                            style={{ width: '95%', padding: '6px', border: '1px solid #c8ab80', background: '#fffdf9' }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      {/* Sticky Save Bar */}
      <div
        className="no-print"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#ebd5b3',
          borderTop: '3px double #4a2e13',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 -4px 10px rgba(0,0,0,0.15)',
          zIndex: 100,
        }}
      >
        <span style={{ fontSize: '11px', color: '#4a2e13', fontStyle: 'italic', fontWeight: 'bold' }}>
          * Changes are draft. Click "Save Changes" to apply them to all players immediately.
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="action-btn reset"
            onClick={handleResetToDefaults}
            style={{ padding: '8px 16px' }}
          >
            🧹 Reset to Defaults
          </button>
          <button
            type="button"
            className="action-btn"
            onClick={handleSave}
            style={{ padding: '8px 20px', fontWeight: 'bold' }}
          >
            💾 Save Changes to Cloud
          </button>
        </div>
      </div>
    </div>
  );
}
