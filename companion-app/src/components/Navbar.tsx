import { useRef, useState, useEffect } from 'react';
import { useCharacterStore } from '../store/useCharacterStore';
import { AccountDrawer } from './AccountDrawer';
import { supabase } from '../lib/supabaseClient';

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

  // Check for local migration prompt after login
  useEffect(() => {
    const checkMigration = async () => {
      if (user && currentCharId === null) {
        const hasData = charState.xp > 0 || charState.class || (inputs['hero-name'] && inputs['hero-name'].trim() !== '');
        if (hasData) {
          // Fetch latest cloud characters to check if the current offline character has already been imported
          const { data, error } = await supabase
            .from('characters')
            .select('id, name, class, level, char_state')
            .eq('user_id', user.id);

          if (!error && data) {
            const localName = (inputs['hero-name'] || '').trim().toLowerCase();
            const localClass = charState.class || '';
            const localXp = charState.xp || 0;

            const isAlreadyInCloud = data.some((dbChar) => {
              const dbName = (dbChar.name || '').trim().toLowerCase();
              const dbClass = dbChar.class || '';
              // Handle potential jsonb string or object parsing
              const dbState = typeof dbChar.char_state === 'string'
                ? JSON.parse(dbChar.char_state)
                : dbChar.char_state;
              const dbXp = dbState?.xp || 0;

              return dbName === localName && dbClass === localClass && dbXp >= localXp;
            });

            if (isAlreadyInCloud) {
              return; // Skip prompting if matching or newer character is already in cloud
            }
          }

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
    </>
  );
}
