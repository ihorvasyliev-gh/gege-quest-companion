import { useRef, useState, useEffect } from 'react';
import { useCharacterStore, getTalentById, getClassNameReadable } from '../store/useCharacterStore';
import { AccountDrawer } from './AccountDrawer';
import { supabase } from '../lib/supabaseClient';
import { ConflictResolutionModal, type CharacterDiff } from './ConflictResolutionModal';

export function Navbar() {
  const activeTab = useCharacterStore((state) => state.activeTab);
  const setActiveTab = useCharacterStore((state) => state.setActiveTab);
  const inputs = useCharacterStore((state) => state.inputs);
  const charState = useCharacterStore((state) => state.charState);
  const resetSheet = useCharacterStore((state) => state.resetSheet);
  const importCharacter = useCharacterStore((state) => state.importCharacter);
  const showToast = useCharacterStore((state) => state.showToast);

  // Supabase state
  const user = useCharacterStore((state) => state.user);
  const currentCharId = useCharacterStore((state) => state.currentCharId);
  const savingState = useCharacterStore((state) => state.savingState);
  const createCharacter = useCharacterStore((state) => state.createCharacter);
  const saveCharacterToCloud = useCharacterStore((state) => state.saveCharacterToCloud);
  const selectCharacter = useCharacterStore((state) => state.selectCharacter);

  const [mobileDrawerActive, setMobileDrawerActive] = useState(false);
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Conflict Resolution state
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictDiffs, setConflictDiffs] = useState<CharacterDiff[]>([]);
  const [matchingCloudChar, setMatchingCloudChar] = useState<any>(null);

  // Helper functions for comparing characters
  const getLabelForKey = (key: string): string => {
    const customLabels: Record<string, string> = {
      'hero-name': 'Hero Name',
      'hero-class': 'Hero Class',
      'char-xp': 'XP',
      'char-gold': 'Gold',
      'char-movement': 'Movement',
      'char-body-max': 'Max Body Points',
      'char-body-current': 'Current Body Points',
      'char-mind-max': 'Max Mind Points',
      'char-mind-current': 'Current Mind Points',
      'char-attack': 'Attack Dice',
      'char-defence': 'Defense Dice',
      'char-weapon-hand1': 'Weapon (Hand 1)',
      'char-weapon-hand2': 'Weapon (Hand 2)',
      'char-armour': 'Armor',
      'char-shield': 'Shield',
      'char-helm': 'Helm',
      'char-other-gear': 'Other Gear / Inventory',
      'quest-notes': 'Quest Notes',
      'char-next-level': 'Next Level target',
      'char-rank': 'Rank',
    };

    if (customLabels[key]) return customLabels[key];

    const foeNameMatch = key.match(/^foe-name-(\d+)$/);
    if (foeNameMatch) return `Foe Row ${foeNameMatch[1]} Name`;

    const foeKillsMatch = key.match(/^foe-kills-(\d+)$/);
    if (foeKillsMatch) return `Foe Row ${foeKillsMatch[1]} Kills`;

    return key
      .replace(/^char-|^hero-|^stat-/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getCharacterDifferences = (
    localInputs: Record<string, string>,
    localState: any,
    cloudInputs: Record<string, string>,
    cloudState: any
  ): CharacterDiff[] => {
    const diffs: CharacterDiff[] = [];

    // 1. Check XP
    const localXp = localState.xp || 0;
    const cloudXp = cloudState.xp || 0;
    if (localXp !== cloudXp) {
      diffs.push({
        key: 'xp',
        label: 'Experience (XP)',
        local: String(localXp),
        cloud: String(cloudXp),
      });
    }

    // 2. Check talents
    const allTalentIds = new Set([
      ...Object.keys(localState.purchasedTalents || {}),
      ...Object.keys(cloudState.purchasedTalents || {}),
    ]);

    for (const tid of allTalentIds) {
      const localCount = localState.purchasedTalents?.[tid] || 0;
      const cloudCount = cloudState.purchasedTalents?.[tid] || 0;
      if (localCount !== cloudCount) {
        const talentName = getTalentById(tid)?.name || tid;
        diffs.push({
          key: `talent-${tid}`,
          label: `Talent: ${talentName}`,
          local: localCount > 0 ? `x${localCount}` : 'Not learned',
          cloud: cloudCount > 0 ? `x${cloudCount}` : 'Not learned',
        });
      }
    }

    // 3. Check inputs
    const allInputKeys = new Set([
      ...Object.keys(localInputs || {}),
      ...Object.keys(cloudInputs || {}),
    ]);

    const excludedKeys = ['char-xp', 'hero-class', 'char-next-level', 'char-rank'];

    for (const key of allInputKeys) {
      if (excludedKeys.includes(key)) continue;

      const valLocal = (localInputs[key] || '').trim();
      const valCloud = (cloudInputs[key] || '').trim();

      if (valLocal !== valCloud) {
        diffs.push({
          key,
          label: getLabelForKey(key),
          local: valLocal || '(empty)',
          cloud: valCloud || '(empty)',
        });
      }
    }

    return diffs;
  };

  const handleResolveConflict = async (choice: 'local' | 'cloud' | 'cancel') => {
    setConflictModalOpen(false);
    if (!matchingCloudChar) return;

    if (choice === 'local') {
      const res = await saveCharacterToCloud(matchingCloudChar.id, inputs, charState);
      if (!res.error) {
        await selectCharacter(matchingCloudChar.id);
        showToast("Cloud character updated with your local offline version!", "success");
      } else {
        showToast("Failed to update cloud character: " + res.error.message, "error");
      }
    } else if (choice === 'cloud') {
      await selectCharacter(matchingCloudChar.id);
      showToast("Local sheet overwritten with the cloud version.", "success");
    } else if (choice === 'cancel') {
      showToast("Keeping local offline sheet. Conflict unresolved.", "error");
    }
  };

  // Check for local migration prompt after login
  useEffect(() => {
    const checkMigration = async () => {
      if (user && currentCharId === null) {
        const hasData = charState.xp > 0 || charState.class || (inputs['hero-name'] && inputs['hero-name'].trim() !== '');
        if (hasData) {
          // Fetch latest cloud characters to check if the current offline character has already been imported
          const { data, error } = await supabase
            .from('characters')
            .select('id, name, class, level, char_state, inputs')
            .eq('user_id', user.id);

          if (!error && data) {
            const localName = (inputs['hero-name'] || '').trim().toLowerCase();
            const localClass = charState.class || '';

            // Find if there is a matching cloud character by name and class
            const matchingDbChar = data.find((dbChar) => {
              const dbName = (dbChar.name || '').trim().toLowerCase();
              const dbClass = dbChar.class || '';
              return dbName === localName && dbClass === localClass;
            });

            if (matchingDbChar) {
              const dbState = typeof matchingDbChar.char_state === 'string'
                ? JSON.parse(matchingDbChar.char_state)
                : matchingDbChar.char_state;
              const dbInputs = typeof matchingDbChar.inputs === 'string'
                ? JSON.parse(matchingDbChar.inputs)
                : matchingDbChar.inputs;

              const diffs = getCharacterDifferences(inputs, charState, dbInputs || {}, dbState || {});
              if (diffs.length > 0) {
                // There are differences, show conflict modal
                setMatchingCloudChar(matchingDbChar);
                setConflictDiffs(diffs);
                setConflictModalOpen(true);
              } else {
                // No differences, auto-connect to the cloud character
                await selectCharacter(matchingDbChar.id);
                showToast(`Connected to cloud character: ${matchingDbChar.name}!`, "success");
              }
              return;
            }
          }

          // No matching cloud character found, ask if they want to copy/import
          const confirmMigration = window.confirm(
            "An offline local character sheet was detected. Would you like to import it to your tavern account as a cloud character?"
          );
          if (confirmMigration) {
            const heroName = (inputs['hero-name'] || '').trim() || 'Imported Hero';
            const res = await createCharacter(heroName, charState.class);
            if (res && !res.error) {
              await saveCharacterToCloud(res.id, inputs, charState);
              await selectCharacter(res.id);
              showToast("Offline character successfully imported to the cloud!", "success");
            } else if (res?.error) {
              showToast(res.error.message, "error");
            }
          }
        }
      }
    };
    checkMigration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleExport = () => {
    const data = {
      inputs: inputs,
      state: charState,
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    const heroName = (inputs['hero-name'] || '').trim() || 'unnamed_hero';
    const filename = heroName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_character.json';

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Character sheet exported successfully!", "success");
  };

  const handleImportTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = importCharacter(content);
      if (success) {
        showToast("Hero Character imported successfully!", "success");
      } else {
        showToast("Failed to parse JSON file. Ensure it is a valid GeGe QUEST RPG Companion character save file.", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your character sheet? All statistics, items, defeated foes, and talents will be deleted forever!")) {
      resetSheet();
    }
  };

  const handlePrint = () => {
    try {
      window.focus();
      window.print();
    } catch (e) {
      console.warn("Direct window.print() call failed.", e);
      const printAlert = document.getElementById('print-alert');
      if (printAlert) {
        printAlert.style.display = 'block';
      }
    }
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerActive(!mobileDrawerActive);
  };

  const renderSyncBadge = () => {
    if (currentCharId === null) {
      return <span className="sync-badge offline" title="Offline mode: Storing data locally">● Local</span>;
    }
    if (savingState === 'saving') {
      return <span className="sync-badge saving" title="Syncing changes to tavern cloud...">● Saving...</span>;
    }
    if (savingState === 'error') {
      return <span className="sync-badge error" title="Failed to sync to tavern cloud">● Sync Error</span>;
    }
    return <span className="sync-badge saved" title="All changes synced to tavern cloud">● Saved</span>;
  };

  return (
    <>
      {/* Hidden File Input for JSON Import */}
      <input
        type="file"
        id="import-file-input"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleImport}
      />

      {/* Top Sticky Navbar */}
      <div className="navbar no-print">
        <div className="navbar-left">
          <div className="navbar-brand">
            <span className="desktop-only">GeGe QUEST RPG Companion</span>
            <span className="mobile-only">GEGE QUEST</span>
          </div>
          {renderSyncBadge()}
        </div>
        
        <div className="navbar-tabs">
          <button
            type="button"
            className={`nav-btn ${activeTab === 'sheet-tab' ? 'active' : ''}`}
            onClick={() => setActiveTab('sheet-tab')}
          >
            <span className="desktop-only">🎴 Hero Sheet</span>
            <span className="mobile-only">🎴 Sheet</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeTab === 'rulebook-tab' ? 'active' : ''}`}
            onClick={() => setActiveTab('rulebook-tab')}
          >
            <span className="desktop-only">📖 Tome of Rules</span>
            <span className="mobile-only">📖 Rules</span>
          </button>
        </div>

        <div className="navbar-actions desktop-only">

          <button type="button" className="action-btn account-btn" onClick={() => setAccountDrawerOpen(true)}>
            🛡️ {user ? 'Tavern' : 'Sign In'}
          </button>
          <button type="button" className="action-btn" onClick={handleExport}>💾 Export JSON</button>
          <button type="button" className="action-btn" onClick={handleImportTrigger}>📂 Import JSON</button>
          <button type="button" className="action-btn reset" onClick={handleReset}>🧹 Reset Sheet</button>
          <button type="button" className="action-btn print" onClick={handlePrint}>🖨️ Print (A5)</button>
        </div>

        <div className="navbar-actions mobile-only">

          <button type="button" className="action-btn" onClick={toggleMobileDrawer}>☰ Menu</button>
        </div>
      </div>

      {/* Mobile Drawer for Sheet Actions */}
      <div
        id="mobile-actions-drawer"
        className={`mobile-drawer no-print ${mobileDrawerActive ? 'active' : ''}`}
        onClick={toggleMobileDrawer}
      >
        <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-drawer-header">
            <h3>Hero Actions</h3>
            <button className="close-drawer-btn" onClick={toggleMobileDrawer}>×</button>
          </div>
          <div className="mobile-drawer-buttons">
            <button type="button" className="drawer-btn" onClick={() => { setAccountDrawerOpen(true); toggleMobileDrawer(); }}>
              🛡️ {user ? 'Tavern Hall' : 'Sign In'}
            </button>
            <button type="button" className="drawer-btn" onClick={() => { handleExport(); toggleMobileDrawer(); }}>💾 Export JSON</button>
            <button type="button" className="drawer-btn" onClick={() => { handleImportTrigger(); toggleMobileDrawer(); }}>📂 Import JSON</button>
            <button type="button" className="drawer-btn reset" onClick={() => { handleReset(); toggleMobileDrawer(); }}>🧹 Reset Sheet</button>
            <button type="button" className="drawer-btn" onClick={() => { handlePrint(); toggleMobileDrawer(); }}>🖨️ Print (A5)</button>
          </div>
        </div>
      </div>

      {/* Tavern/Account Panel Drawer */}
      <AccountDrawer isOpen={accountDrawerOpen} onClose={() => setAccountDrawerOpen(false)} />

      {/* Conflict Resolution Modal */}
      <ConflictResolutionModal
        isOpen={conflictModalOpen}
        characterName={(inputs['hero-name'] || '').trim() || 'Unnamed Hero'}
        characterClass={getClassNameReadable(charState.class) || 'No Class'}
        diffs={conflictDiffs}
        onResolve={handleResolveConflict}
      />
    </>
  );
}
