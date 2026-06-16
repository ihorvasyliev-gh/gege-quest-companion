import { useState, useEffect } from 'react';
import { useCharacterStore, getDefaultGameConfig, getTalentById } from '../store/useCharacterStore';
import type { GameConfig, Talent, XPSetting } from '../types';
import { XPIcon } from './XPIcon';

const AVAILABLE_ICONS = [
  { key: 'goblin', label: '👺 Goblin' },
  { key: 'orc', label: '👹 Orc' },
  { key: 'skeleton', label: '💀 Skeleton' },
  { key: 'gargoyle', label: '🦇 Gargoyle' },
  { key: 'demon', label: '😈 Demon' },
  { key: 'dragon', label: '🐉 Dragon' },
  { key: 'scroll', label: '📜 Scroll' },
  { key: 'shield', label: '🛡️ Shield' },
  { key: 'skull', label: '☠️ Skull' },
  { key: 'crown', label: '👑 Crown' },
  { key: 'sword', label: '⚔️ Sword' },
  { key: 'chest', label: '📦 Chest' },
  { key: 'potion', label: '🧪 Potion' },
  { key: 'book', label: '📖 Book' },
];

export function DMPanel() {
  const gameConfig = useCharacterStore((state) => state.gameConfig);
  const saveGameConfig = useCharacterStore((state) => state.saveGameConfig);
  const showToast = useCharacterStore((state) => state.showToast);

  const fetchAllPlayersCharacters = useCharacterStore((state) => state.fetchAllPlayersCharacters);
  const activePartyIds = useCharacterStore((state) => state.activePartyIds);
  const togglePartyMember = useCharacterStore((state) => state.togglePartyMember);

  // Local draft state for editing before saving
  const [draftConfig, setDraftConfig] = useState<GameConfig>(() => JSON.parse(JSON.stringify(gameConfig)));
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'classes' | 'xp'>('dashboard');
  
  // Party Tracker state
  const [allPlayersCharacters, setAllPlayersCharacters] = useState<any[]>([]);
  const [loadingParty, setLoadingParty] = useState(false);
  const [showManageParty, setShowManageParty] = useState(false);
  const [partySearchQuery, setPartySearchQuery] = useState('');
  const [expandedCardIds, setExpandedCardIds] = useState<string[]>([]);

  const toggleCardExpanded = (id: string) => {
    setExpandedCardIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const refreshParty = async () => {
    setLoadingParty(true);
    try {
      const chars = await fetchAllPlayersCharacters();
      setAllPlayersCharacters(chars);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingParty(false);
    }
  };

  useEffect(() => {
    refreshParty();
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchAllPlayersCharacters().then((chars) => {
          setAllPlayersCharacters(chars);
        });
      }
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Selected class for Class & Talents editor
  const [selectedClassKey, setSelectedClassKey] = useState<string>('__shared__');
  const [talentSearchQuery, setTalentSearchQuery] = useState('');
  
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

  // Editing state for an existing talent
  const [editingTalent, setEditingTalent] = useState<Talent | null>(null);
  const [editingTalentScope, setEditingTalentScope] = useState<string>(''); // classKey where the talent resides
  const [editTalentName, setEditTalentName] = useState('');
  const [editTalentCost, setEditTalentCost] = useState(1);
  const [editTalentDesc, setEditTalentDesc] = useState('');
  const [editTalentMax, setEditTalentMax] = useState<number | undefined>(undefined);

  const handleStartEditTalent = (talent: Talent, scope: string) => {
    setEditingTalent(talent);
    setEditingTalentScope(scope);
    setEditTalentName(talent.name);
    setEditTalentCost(talent.cost);
    setEditTalentDesc(talent.desc);
    setEditTalentMax(talent.max);
  };

  const handleSaveEditedTalent = () => {
    if (!editingTalent) return;
    const name = editTalentName.trim();
    const desc = editTalentDesc.trim();
    if (!name || !desc) {
      showToast('Talent must have a Name and Description.', 'error');
      return;
    }

    const updated = { ...draftConfig };
    const list = editingTalentScope === '__shared__'
      ? updated.sharedTalents
      : (updated.classes[editingTalentScope]?.talents || []);

    if (!list) return;

    // Check duplicate name excluding the currently edited talent
    const isDuplicate = list.some(
      (t) => t.id !== editingTalent.id && t.name.toLowerCase() === name.toLowerCase()
    );

    if (isDuplicate) {
      showToast(`A talent with the name "${name}" already exists in this scope.`, 'error');
      return;
    }

    // Find and update the talent
    const index = list.findIndex((t) => t.id === editingTalent.id);
    if (index !== -1) {
      list[index] = {
        ...editingTalent,
        name,
        cost: Number(editTalentCost),
        desc,
        max: editTalentMax ? Number(editTalentMax) : undefined,
      };

      if (editingTalentScope === '__shared__') {
        updated.sharedTalents = list;
      } else if (updated.classes[editingTalentScope]) {
        updated.classes[editingTalentScope].talents = list;
      }

      setDraftConfig(updated);
      setEditingTalent(null);
      showToast(`Talent "${name}" updated.`, 'success');
    }
  };

  const handleDeleteTalentFromEdit = () => {
    if (!editingTalent) return;
    if (window.confirm(`Are you sure you want to delete the talent "${editingTalent.name}"?`)) {
      handleDeleteTalent(editingTalentScope, editingTalent.id);
      setEditingTalent(null);
    }
  };

  // Sync draft state with store config when it loads
  useEffect(() => {
    setDraftConfig(JSON.parse(JSON.stringify(gameConfig)));
  }, [gameConfig]);

  // Initialize selected class key if empty
  useEffect(() => {
    if (!selectedClassKey) {
      setSelectedClassKey('__shared__');
    }
  }, [selectedClassKey]);

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
      setSelectedClassKey('__shared__');
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
      setSelectedClassKey('__shared__');
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

    const updated = { ...draftConfig };
    if (!updated.sharedTalents) {
      updated.sharedTalents = [];
    }

    // Validation check for duplicates
    const talentList = selectedClassKey === '__shared__'
      ? updated.sharedTalents
      : (updated.classes[selectedClassKey]?.talents || []);

    const isDuplicate = talentList.some(
      (t) => t.name.toLowerCase() === name.toLowerCase()
    );

    if (isDuplicate) {
      showToast(`A talent with the name "${name}" already exists in this scope.`, 'error');
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

    if (selectedClassKey === '__shared__') {
      updated.sharedTalents.push(added);
      setDraftConfig(updated);
      setNewTalent({ name: '', cost: 1, desc: '', max: 1 });
      showToast(`Talent "${name}" added to Shared Talents.`, 'success');
    } else {
      if (updated.classes[selectedClassKey]) {
        updated.classes[selectedClassKey].talents.push(added);
        setDraftConfig(updated);
        setNewTalent({ name: '', cost: 1, desc: '', max: 1 });
        showToast(`Talent "${name}" added to ${getClassName(selectedClassKey)}.`, 'success');
      }
    }
  };

  const handleDeleteTalent = (classKey: string, talentId: string) => {
    const updated = { ...draftConfig };
    if (classKey === '__shared__') {
      updated.sharedTalents = (updated.sharedTalents || []).filter((t) => t.id !== talentId);
      showToast('Shared talent deleted from draft.', 'success');
    } else {
      if (updated.classes[classKey]) {
        updated.classes[classKey].talents = updated.classes[classKey].talents.filter((t) => t.id !== talentId);
        showToast('Talent deleted from class.', 'success');
      }
    }
    setDraftConfig(updated);
  };

  const getClassName = (key: string) => {
    if (key === '__shared__') return 'Shared Talents';
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
      icon: 'skull'
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
      } else if (field === 'icon') {
        setting.icon = String(value);
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

  const handleMoveXPCategoryUp = (index: number) => {
    if (index === 0) return;
    const updated = { ...draftConfig };
    const temp = updated.xpSettings[index];
    updated.xpSettings[index] = updated.xpSettings[index - 1];
    updated.xpSettings[index - 1] = temp;
    setDraftConfig(updated);
  };

  const handleMoveXPCategoryDown = (index: number) => {
    if (index === draftConfig.xpSettings.length - 1) return;
    const updated = { ...draftConfig };
    const temp = updated.xpSettings[index];
    updated.xpSettings[index] = updated.xpSettings[index + 1];
    updated.xpSettings[index + 1] = temp;
    setDraftConfig(updated);
  };



  return (
    <div id="dm-tab" className="tab-content active" style={{ paddingBottom: '110px' }}>
      <div className="page-wrapper">
        <div className="page" id="dm-panel-page" style={{ height: 'auto', minHeight: '600px' }}>
          
          <div className="header-container" style={{ marginBottom: '15px' }}>
            <h1 className="main-title">🛡️ DUNGEON MASTER PANEL</h1>
            <div className="subtitle">Configure Game Classes, Monsters, and Layout overrides</div>
          </div>

          {/* Sub Navigation */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #4a2e13', paddingBottom: '10px', flexWrap: 'nowrap', width: '100%' }}>
            <button
              type="button"
              className={`dm-tab-btn ${activeSubTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('dashboard')}
              style={{ flex: 1, padding: '8px 4px', fontSize: '10px', textAlign: 'center', whiteSpace: 'nowrap' }}
            >
              👥 Party Tracker
            </button>
            <button
              type="button"
              className={`dm-tab-btn ${activeSubTab === 'classes' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('classes')}
              style={{ flex: 1, padding: '8px 4px', fontSize: '10px', textAlign: 'center', whiteSpace: 'nowrap' }}
            >
              Classes & Talents
            </button>
            <button
              type="button"
              className={`dm-tab-btn ${activeSubTab === 'xp' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('xp')}
              style={{ flex: 1, padding: '8px 4px', fontSize: '10px', textAlign: 'center', whiteSpace: 'nowrap' }}
            >
              XP Calculator
            </button>
          </div>

          {/* TAB 0: PARTY TRACKER DASHBOARD */}
          {activeSubTab === 'dashboard' && (
            <div style={{ marginBottom: '40px' }}>
              {/* Top Row: Info & Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', borderBottom: '1px dashed rgba(74, 46, 19, 0.25)', paddingBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#5c3e21', fontFamily: 'Cinzel, serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span className="dm-save-bar-status-dot saved" style={{ backgroundColor: loadingParty ? '#d4af37' : '#2e5c1e', width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }} />
                  {loadingParty ? 'Syncing characters...' : 'Auto-syncing every 5 seconds...'}
                </div>
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button
                    type="button"
                    className="action-btn"
                    onClick={refreshParty}
                    disabled={loadingParty}
                    style={{ flex: 1, height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', padding: '0 6px' }}
                  >
                    🔄 Refresh Now
                  </button>
                  <button
                    type="button"
                    className="action-btn"
                    style={{ backgroundColor: '#724216', borderColor: '#5c3e21', flex: 1, height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', padding: '0 6px' }}
                    onClick={() => setShowManageParty(!showManageParty)}
                  >
                    ⚙️ {showManageParty ? 'Hide Config' : 'Manage Party'}
                  </button>
                </div>
              </div>

              {/* Manage Party Members Section */}
              {showManageParty && (
                <div className="parchment-box" style={{ padding: '15px', marginBottom: '20px', zIndex: 2 }}>
                  <h3>Manage Party Members</h3>
                  <p style={{ fontSize: '11px', opacity: 0.8, margin: '5px 0 12px 0' }}>
                    Select which characters from the database should be shown on your DM dashboard.
                  </p>

                  {allPlayersCharacters.length === 0 ? (
                    <div style={{ fontStyle: 'italic', fontSize: '12.5px', color: '#724216', textAlign: 'center', padding: '15px 0' }}>
                      No characters found in the database. Ensure players have created and saved characters online.
                    </div>
                  ) : (
                    <div>
                      {/* Search filter for character management */}
                      <input
                        type="text"
                        placeholder="🔍 Filter characters by name or class..."
                        value={partySearchQuery}
                        onChange={(e) => setPartySearchQuery(e.target.value)}
                        className="dm-input"
                        style={{ marginBottom: '12px', width: '100%', maxWidth: '400px' }}
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', maxHeight: '200px', overflowY: 'auto', padding: '5px' }}>
                        {allPlayersCharacters
                          .filter(char => {
                            const name = (char.name || '').toLowerCase();
                            const cls = (char.class || '').toLowerCase();
                            const q = partySearchQuery.toLowerCase();
                            return name.includes(q) || cls.includes(q);
                          })
                          .map(char => {
                            const isChecked = activePartyIds.includes(char.id);
                            return (
                              <label
                                key={char.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '6px 10px',
                                  backgroundColor: isChecked ? 'rgba(212, 175, 55, 0.12)' : 'rgba(0,0,0,0.05)',
                                  border: isChecked ? '1px solid #d4af37' : '1px solid #5c3e21',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12.5px'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePartyMember(char.id)}
                                  style={{ cursor: 'pointer' }}
                                />
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  <strong style={{ display: 'block', fontSize: '12px' }}>{char.name || 'Unnamed'}</strong>
                                  <span style={{ fontSize: '10px', display: 'block', opacity: 0.75 }}>
                                    Level {char.level} {getClassName(char.class)}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tracked Party Cards */}
              {activePartyIds.length === 0 ? (
                <div className="parchment-box" style={{ padding: '30px', textAlign: 'center', zIndex: 2 }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
                  <h3>No Tracked Heroes</h3>
                  <p style={{ fontSize: '13px', opacity: 0.85, maxWidth: '450px', margin: '5px auto 15px auto' }}>
                    Click "Manage Party Members" above to select characters from the tavern database to track their health and stats in real-time.
                  </p>
                  <button
                    type="button"
                    className="action-btn"
                    onClick={() => setShowManageParty(true)}
                  >
                    Add Party Members
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                  {allPlayersCharacters
                    .filter(char => activePartyIds.includes(char.id))
                    .map(char => {
                      const charState = typeof char.char_state === 'string' ? JSON.parse(char.char_state) : (char.char_state || {});
                      const charInputs = typeof char.inputs === 'string' ? JSON.parse(char.inputs) : (char.inputs || {});
                      const isExpanded = expandedCardIds.includes(char.id);

                      // Extract weapons
                      const weapons: string[] = [];
                      for (let i = 1; i <= 7; i++) {
                        const w = (charInputs[`weapon-line-${i}`] || '').trim();
                        if (w) weapons.push(w);
                      }

                      // Extract armor
                      const armors: string[] = [];
                      for (let i = 1; i <= 7; i++) {
                        const a = (charInputs[`armor-line-${i}`] || '').trim();
                        if (a) armors.push(a);
                      }

                      // Extract spells
                      const spells: string[] = [];
                      for (let i = 1; i <= 10; i++) {
                        const s = (charInputs[`spell-line-${i}`] || '').trim();
                        if (s) spells.push(s);
                      }

                      // Extract notes
                      const notes: string[] = [];
                      for (let i = 1; i <= 8; i++) {
                        const n = (charInputs[`ref-notes-line-${i}`] || '').trim();
                        if (n) notes.push(n);
                      }

                      // Extract foes
                      const foes: string[] = [];
                      for (let i = 1; i <= 22; i++) {
                        const name = (charInputs[`foe-name-${i}`] || '').trim();
                        const kills = parseInt(charInputs[`foe-kills-${i}`]) || 0;
                        if (name && kills > 0) {
                          foes.push(`${name} (x${kills})`);
                        }
                      }

                      // Extract talents
                      const purchasedTalentsList = Object.entries(charState.purchasedTalents || {})
                        .map(([tId, count]) => {
                          const tObj = getTalentById(tId);
                          return {
                            name: tObj ? tObj.name : tId,
                            cost: tObj ? tObj.cost : 1,
                            count: count as number
                          };
                        })
                        .filter(t => t.count > 0);
                      
                      return (
                        <div key={char.id} className="parchment-box" style={{ padding: '15px', position: 'relative', display: 'flex', flexDirection: 'column', zIndex: 2, justifyContent: 'flex-start' }}>
                          
                          {/* Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1.5px dashed #4a2e13', paddingBottom: '8px', marginBottom: '10px' }}>
                            <div>
                              <h2 style={{ margin: 0, fontSize: '18px', fontFamily: 'Cinzel, serif', color: '#4a2e13' }}>
                                {charInputs['hero-name'] || char.name || 'Unnamed Hero'}
                              </h2>
                              <span className="character-class-badge" style={{
                                display: 'inline-block',
                                backgroundColor: '#4a2e13',
                                color: '#f3e5c8',
                                fontSize: '9px',
                                padding: '2px 6px',
                                borderRadius: '3px',
                                marginTop: '3px',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                fontFamily: 'Cinzel, serif',
                                letterSpacing: '0.5px'
                              }}>
                                {getClassName(char.class)}
                              </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', fontWeight: 'bold', color: '#724216' }}>
                                Level {charState.level || char.level}
                              </div>
                              <div style={{ fontSize: '10.5px', color: '#855d14', fontWeight: 'bold' }}>
                                {charState.xp || 0} XP
                              </div>
                            </div>
                          </div>

                          {/* Main Stats Summary */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '12px' }}>
                            <div style={{ backgroundColor: 'rgba(0,0,0,0.03)', padding: '4px 2px', borderRadius: '4px', border: '1px solid rgba(74, 46, 19, 0.15)' }}>
                              <div style={{ fontSize: '7px', textTransform: 'uppercase', opacity: 0.85, fontFamily: 'Cinzel, serif' }}>Attack</div>
                              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#8b1e13' }}>⚔️ {charInputs['stat-attack'] || '-'}</div>
                            </div>
                            <div style={{ backgroundColor: 'rgba(0,0,0,0.03)', padding: '4px 2px', borderRadius: '4px', border: '1px solid rgba(74, 46, 19, 0.15)' }}>
                              <div style={{ fontSize: '7px', textTransform: 'uppercase', opacity: 0.85, fontFamily: 'Cinzel, serif' }}>Defend</div>
                              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2b528b' }}>🛡️ {charInputs['stat-defense'] || '-'}</div>
                            </div>
                            <div style={{ backgroundColor: 'rgba(0,0,0,0.03)', padding: '4px 2px', borderRadius: '4px', border: '1px solid rgba(74, 46, 19, 0.15)' }}>
                              <div style={{ fontSize: '7px', textTransform: 'uppercase', opacity: 0.85, fontFamily: 'Cinzel, serif' }}>Body</div>
                              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#8c1e13' }}>❤️ {charInputs['stat-body'] || '-'}</div>
                            </div>
                            <div style={{ backgroundColor: 'rgba(0,0,0,0.03)', padding: '4px 2px', borderRadius: '4px', border: '1px solid rgba(74, 46, 19, 0.15)' }}>
                              <div style={{ fontSize: '7px', textTransform: 'uppercase', opacity: 0.85, fontFamily: 'Cinzel, serif' }}>Mind</div>
                              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#4a2e13' }}>🧠 {charInputs['stat-mind'] || '-'}</div>
                            </div>
                            <div style={{ backgroundColor: 'rgba(0,0,0,0.03)', padding: '4px 2px', borderRadius: '4px', border: '1px solid rgba(74, 46, 19, 0.15)' }}>
                              <div style={{ fontSize: '7px', textTransform: 'uppercase', opacity: 0.85, fontFamily: 'Cinzel, serif' }}>Gold</div>
                              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#b08d24' }}>🪙 {charInputs['char-gold'] || '0'}</div>
                            </div>
                          </div>

                          {/* Health Tracker Mini Grid */}
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '10.5px', fontWeight: 'bold', textTransform: 'uppercase', color: '#724216', fontFamily: 'Cinzel, serif' }}>
                                Body Points Tracker
                              </span>
                            </div>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(10, 1fr)',
                              gap: '2px',
                              padding: '4px',
                              backgroundColor: 'rgba(74, 46, 19, 0.08)',
                              border: '1px solid #5c3e21',
                              borderRadius: '4px'
                            }}>
                              {Array.from({ length: 30 }, (_, index) => {
                                const cellNum = index + 1;
                                const val = (charInputs[`health-${cellNum}`] || '').trim();
                                const hasVal = val !== '';
                                return (
                                  <div
                                    key={cellNum}
                                    style={{
                                      aspectRatio: '1',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '9px',
                                      fontWeight: 'bold',
                                      backgroundColor: hasVal ? 'rgba(176, 42, 42, 0.15)' : 'rgba(255, 255, 255, 0.4)',
                                      border: hasVal ? '1px solid #b02a2a' : '1px solid rgba(74, 46, 19, 0.3)',
                                      color: '#b02a2a',
                                      borderRadius: '2px',
                                      minHeight: '18px'
                                    }}
                                    title={`Cell ${cellNum}: ${val || 'Empty'}`}
                                  >
                                    {val}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Collapsible Action */}
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => toggleCardExpanded(char.id)}
                            style={{
                              width: '100%',
                              height: '28px',
                              padding: '0',
                              fontSize: '9px',
                              backgroundColor: isExpanded ? '#5c3e21' : '#4a2e13',
                              borderColor: '#d4af37'
                            }}
                          >
                            {isExpanded ? '▲ Hide Details' : '▼ Show Full Codex & Equipment'}
                          </button>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #4a2e13', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                              {/* Weapons & Gear */}
                              {weapons.length > 0 && (
                                <div>
                                  <strong style={{ color: '#724216', fontFamily: 'Cinzel, serif' }}>⚔️ Weapons & Gear:</strong>
                                  <ul style={{ margin: '2px 0 0 0', paddingLeft: '15px' }}>
                                    {weapons.map((w, idx) => <li key={idx}>{w}</li>)}
                                  </ul>
                                </div>
                              )}

                              {/* Armor & Protection */}
                              {armors.length > 0 && (
                                <div>
                                  <strong style={{ color: '#724216', fontFamily: 'Cinzel, serif' }}>🛡️ Armor & Protection:</strong>
                                  <ul style={{ margin: '2px 0 0 0', paddingLeft: '15px' }}>
                                    {armors.map((a, idx) => <li key={idx}>{a}</li>)}
                                  </ul>
                                </div>
                              )}

                              {/* Spells & Scrolls */}
                              {spells.length > 0 && (
                                <div>
                                  <strong style={{ color: '#724216', fontFamily: 'Cinzel, serif' }}>📜 Spellbook & Scrolls:</strong>
                                  <ul style={{ margin: '2px 0 0 0', paddingLeft: '15px' }}>
                                    {spells.map((s, idx) => <li key={idx}>{s}</li>)}
                                  </ul>
                                </div>
                              )}

                              {/* Defeated Foes */}
                              {foes.length > 0 && (
                                <div>
                                  <strong style={{ color: '#724216', fontFamily: 'Cinzel, serif' }}>💀 Defeated Foes:</strong>
                                  <div style={{ margin: '2px 0 0 0', fontStyle: 'italic', paddingLeft: '5px' }}>
                                    {foes.join(', ')}
                                  </div>
                                </div>
                              )}

                              {/* Talents */}
                              <div>
                                <strong style={{ color: '#724216', fontFamily: 'Cinzel, serif' }}>⭐ Learned Talents:</strong>
                                {purchasedTalentsList.length === 0 ? (
                                  <div style={{ fontStyle: 'italic', paddingLeft: '5px', opacity: 0.8 }}>None learned yet.</div>
                                ) : (
                                  <ul style={{ margin: '2px 0 0 0', paddingLeft: '15px' }}>
                                    {purchasedTalentsList.map((t, idx) => (
                                      <li key={idx}>
                                        <strong>{t.name}</strong> {t.count > 1 ? `(Rank ${t.count})` : ''}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>

                              {/* Notes */}
                              {notes.length > 0 && (
                                <div>
                                  <strong style={{ color: '#724216', fontFamily: 'Cinzel, serif' }}>✍️ Special Rules & Notes:</strong>
                                  <ul style={{ margin: '2px 0 0 0', paddingLeft: '15px' }}>
                                    {notes.map((n, idx) => <li key={idx}>{n}</li>)}
                                  </ul>
                                </div>
                              )}

                              {/* Last Updated */}
                              <div style={{ fontSize: '9px', opacity: 0.6, textAlign: 'right', marginTop: '5px' }}>
                                Last Synced: {new Date(char.updated_at).toLocaleTimeString()}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* TAB 1: CLASSES & TALENTS */}
          {activeSubTab === 'classes' && (
            <div>
              <div className="row" style={{ alignItems: 'flex-start' }}>
                
                {/* Left Side: Class Selection & Addition */}
                <div className="parchment-box flex-1" style={{ padding: '15px', zIndex: 2 }}>
                  <h3>Game Classes</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    <label className="dm-label">Select Class to Edit:</label>
                    <select
                      value={selectedClassKey}
                      onChange={(e) => setSelectedClassKey(e.target.value)}
                      className="dm-select"
                    >
                      <option value="__shared__">⭐ Shared Talents (All Classes)</option>
                      {Object.keys(draftConfig.classes).map((key) => (
                        <option key={key} value={key}>
                          {getClassName(key)} ({key})
                        </option>
                      ))}
                    </select>

                    {selectedClassKey && selectedClassKey !== '__shared__' && (
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
                      <label className="dm-label">Class Unique ID (e.g. warlock):</label>
                      <input
                        type="text"
                        value={newClassKey}
                        onChange={(e) => setNewClassKey(e.target.value)}
                        placeholder="warlock"
                        className="dm-input"
                      />
                    </div>
                    <div>
                      <label className="dm-label">Display Name (e.g. Warlock):</label>
                      <input
                        type="text"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="Warlock"
                        className="dm-input"
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0 }}>Talents for {getClassName(selectedClassKey)}</h3>
                        <input
                          type="text"
                          placeholder="🔍 Search talents..."
                          value={talentSearchQuery}
                          onChange={(e) => setTalentSearchQuery(e.target.value)}
                          className="dm-input"
                          style={{ width: '180px', height: '28px', fontSize: '11px', padding: '2px 8px' }}
                        />
                      </div>
                      
                      <div style={{ marginTop: '10px' }}>
                        {(() => {
                          const talentsList = selectedClassKey === '__shared__'
                            ? (draftConfig.sharedTalents || [])
                            : (draftConfig.classes[selectedClassKey]?.talents || []);
                          
                          const filtered = talentsList.filter(t =>
                            t.name.toLowerCase().includes(talentSearchQuery.toLowerCase()) ||
                            t.desc.toLowerCase().includes(talentSearchQuery.toLowerCase())
                          );

                          if (talentsList.length === 0) {
                            return (
                              <div style={{ fontSize: '12px', fontStyle: 'italic', padding: '10px 0' }}>
                                No talents added yet for this scope. Add one below!
                              </div>
                            );
                          }

                          if (filtered.length === 0) {
                            return (
                              <div style={{ fontSize: '12px', fontStyle: 'italic', padding: '10px 0', color: '#b02a2a' }}>
                                No talents match your search query.
                              </div>
                            );
                          }

                          return (
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
                                {filtered.map((talent) => (
                                  <tr key={talent.id}>
                                    <td><strong>{talent.name}</strong></td>
                                    <td style={{ textAlign: 'center' }}>{talent.cost}</td>
                                    <td style={{ fontSize: '11px' }}>
                                      {talent.desc} {talent.max ? `(Max ${talent.max} buys)` : ''}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleStartEditTalent(talent, selectedClassKey)}
                                        className="talent-action-btn"
                                        title="Edit Talent"
                                      >
                                        ✏️
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          );
                        })()}
                      </div>

                      <div className="divider" style={{ margin: '15px 0' }} />

                      <h3>Add Talent to {getClassName(selectedClassKey)}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                        <div>
                          <label className="dm-label">Talent Name:</label>
                          <input
                            type="text"
                            value={newTalent.name}
                            onChange={(e) => setNewTalent({ ...newTalent, name: e.target.value })}
                            placeholder="Eldritch Blast"
                            className="dm-input"
                          />
                        </div>
                        <div>
                          <label className="dm-label">AP Cost:</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={newTalent.cost}
                            onChange={(e) => setNewTalent({ ...newTalent, cost: Number(e.target.value) || 1 })}
                            className="dm-input"
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label className="dm-label">Description / Effect:</label>
                          <input
                            type="text"
                            value={newTalent.desc}
                            onChange={(e) => setNewTalent({ ...newTalent, desc: e.target.value })}
                            placeholder="Deal +1 damage at range once per quest."
                            className="dm-input"
                          />
                        </div>
                        <div>
                          <label className="dm-label">Max Purchases (blank for 1):</label>
                          <input
                            type="number"
                            min="1"
                            value={newTalent.max || ''}
                            onChange={(e) => setNewTalent({ ...newTalent, max: e.target.value ? Number(e.target.value) : undefined })}
                            placeholder="1"
                            className="dm-input"
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

              <div>
                <table className="dm-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '8%', textAlign: 'center' }}>Move</th>
                      <th className="desktop-table-cell" style={{ width: '22%' }}>Category Key (ID)</th>
                      <th style={{ width: '32%' }}>Display Name</th>
                      <th style={{ width: '22%' }}>Icon</th>
                      <th style={{ width: '8%', textAlign: 'center' }}>XP</th>
                      <th style={{ width: '8%', textAlign: 'center' }}>Del</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draftConfig.xpSettings.map((setting, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleMoveXPCategoryUp(index)}
                              disabled={index === 0}
                              className="action-btn"
                              style={{ padding: '0', fontSize: '8px', width: '20px', height: '16px', lineHeight: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Move Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveXPCategoryDown(index)}
                              disabled={index === draftConfig.xpSettings.length - 1}
                              className="action-btn"
                              style={{ padding: '0', fontSize: '8px', width: '20px', height: '16px', lineHeight: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Move Down"
                            >
                              ▼
                            </button>
                          </div>
                        </td>
                        <td className="desktop-table-cell" style={{ textAlign: 'center' }}>
                          <code style={{ fontSize: '11px', color: '#5c3e21', wordBreak: 'break-all' }}>{setting.key}</code>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={setting.label}
                            onChange={(e) => handleUpdateXPSetting(index, 'label', e.target.value)}
                            className="dm-input"
                            style={{ padding: '4px 6px', fontSize: '11px', height: '28px', width: '100%', boxSizing: 'border-box' }}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '28px',
                              height: '28px',
                              borderRadius: '4px',
                              border: '1.5px solid #4a2e13',
                              backgroundColor: '#fffdf9',
                              flexShrink: 0,
                              boxSizing: 'border-box'
                            }}>
                              <XPIcon name={setting.icon} size={18} style={{ color: '#4a2e13', opacity: 0.85 }} />
                            </div>
                            <select
                              value={setting.icon || 'skull'}
                              onChange={(e) => handleUpdateXPSetting(index, 'icon', e.target.value)}
                              className="dm-select"
                              style={{ padding: '2px 4px', fontSize: '11px', height: '28px', flexGrow: 1, minWidth: '75px', boxSizing: 'border-box' }}
                            >
                              {AVAILABLE_ICONS.map((iconOpt) => (
                                <option key={iconOpt.key} value={iconOpt.key}>
                                  {iconOpt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <input
                            type="number"
                            min="0"
                            value={setting.xp}
                            onChange={(e) => handleUpdateXPSetting(index, 'xp', e.target.value)}
                            className="dm-input"
                            style={{ width: '45px', padding: '4px 2px', textAlign: 'center', fontSize: '11px', height: '28px', margin: '0 auto', boxSizing: 'border-box' }}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteXPCategory(index)}
                            style={{ border: 'none', background: 'none', color: '#b02a2a', cursor: 'pointer', fontSize: '14px' }}
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



        </div>
      </div>

      {/* Elegant Floating Save Bar */}
      {(() => {
        const hasChanges = gameConfig && draftConfig && JSON.stringify(draftConfig) !== JSON.stringify(gameConfig);
        return (
          <div className="dm-save-bar no-print">
            <div className="dm-save-bar-info">
              <span className={`dm-save-bar-status-dot ${hasChanges ? 'unsaved' : 'saved'}`} />
              <span className="dm-save-bar-text">
                {hasChanges ? (
                  <>
                    ⚠️ <strong>Unsaved Draft:</strong> Save changes to publish them to all players.
                  </>
                ) : (
                  <>
                    🛡️ <strong>Synced to Cloud:</strong> All rules and layouts are updated for everyone.
                  </>
                )}
              </span>
            </div>
            <div className="dm-save-bar-actions">
              <button
                type="button"
                className="action-btn reset"
                onClick={handleResetToDefaults}
              >
                🧹 Reset to Defaults
              </button>
              <button
                type="button"
                className="action-btn"
                onClick={handleSave}
                disabled={!hasChanges}
                style={{
                  opacity: hasChanges ? 1 : 0.6,
                  cursor: hasChanges ? 'pointer' : 'not-allowed',
                  boxShadow: hasChanges ? '0 0 10px rgba(212, 175, 55, 0.4)' : 'none',
                }}
              >
                💾 Save Changes
              </button>
            </div>
          </div>
        );
      })()}

      {/* Edit Talent Modal */}
      {editingTalent && (
        <div className="parchment-modal-overlay" onClick={() => setEditingTalent(null)}>
          <div className="parchment-modal-panel" onClick={(e) => e.stopPropagation()} style={{ width: '450px' }}>
            <div className="parchment-modal-header">
              <h2>✍️ Edit Talent</h2>
              <button
                type="button"
                className="close-btn"
                style={{ background: 'transparent', border: 'none', color: '#4a2e13', fontSize: '28px', cursor: 'pointer' }}
                onClick={() => setEditingTalent(null)}
              >
                &times;
              </button>
            </div>

            <div className="parchment-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="dm-label">Talent Name:</label>
                <input
                  type="text"
                  value={editTalentName}
                  onChange={(e) => setEditTalentName(e.target.value)}
                  className="dm-input"
                />
              </div>

              <div>
                <label className="dm-label">AP Cost:</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editTalentCost}
                  onChange={(e) => setEditTalentCost(Number(e.target.value) || 1)}
                  className="dm-input"
                />
              </div>

              <div>
                <label className="dm-label">Description / Effect:</label>
                <textarea
                  value={editTalentDesc}
                  onChange={(e) => setEditTalentDesc(e.target.value)}
                  className="dm-input"
                  rows={3}
                  style={{
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    fontSize: '12px',
                    padding: '8px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label className="dm-label">Max Purchases (blank for 1):</label>
                <input
                  type="number"
                  min="1"
                  value={editTalentMax || ''}
                  onChange={(e) => setEditTalentMax(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="1"
                  className="dm-input"
                />
              </div>
            </div>

            <div className="parchment-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="action-btn reset"
                onClick={handleDeleteTalentFromEdit}
                style={{
                  fontSize: '11px',
                  padding: '8px 12px',
                }}
              >
                🗑️ Delete Talent
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="conflict-btn conflict-btn-cancel"
                  style={{
                    fontSize: '11px',
                    padding: '8px 12px',
                  }}
                  onClick={() => setEditingTalent(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="conflict-btn conflict-btn-local"
                  style={{
                    fontSize: '11px',
                    padding: '8px 12px',
                  }}
                  onClick={handleSaveEditedTalent}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
