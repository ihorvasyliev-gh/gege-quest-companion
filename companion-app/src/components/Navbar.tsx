import { useRef, useState } from 'react';
import { useCharacterStore } from '../store/useCharacterStore';

export function Navbar() {
  const activeTab = useCharacterStore((state) => state.activeTab);
  const setActiveTab = useCharacterStore((state) => state.setActiveTab);
  const inputs = useCharacterStore((state) => state.inputs);
  const charState = useCharacterStore((state) => state.charState);
  const resetSheet = useCharacterStore((state) => state.resetSheet);
  const importCharacter = useCharacterStore((state) => state.importCharacter);
  const showToast = useCharacterStore((state) => state.showToast);

  const [mobileDrawerActive, setMobileDrawerActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        showToast("Failed to parse JSON file. Ensure it is a valid GeGe character save file.", "error");
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
        <div className="navbar-brand">
          <span className="desktop-only">GeGe QUEST RPG Companion</span>
          <span className="mobile-only">GeGe QUEST</span>
        </div>
        
        <div className="navbar-tabs">
          <button
            className={`nav-btn ${activeTab === 'sheet-tab' ? 'active' : ''}`}
            onClick={() => setActiveTab('sheet-tab')}
          >
            <span className="desktop-only">🎴 Hero Sheet</span>
            <span className="mobile-only">🎴 Sheet</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'rulebook-tab' ? 'active' : ''}`}
            onClick={() => setActiveTab('rulebook-tab')}
          >
            <span className="desktop-only">📖 Tome of Rules</span>
            <span className="mobile-only">📖 Rules</span>
          </button>
        </div>

        <div className="navbar-actions desktop-only">
          <button className="action-btn" onClick={handleExport}>💾 Export JSON</button>
          <button className="action-btn" onClick={handleImportTrigger}>📂 Import JSON</button>
          <button className="action-btn reset" onClick={handleReset}>🧹 Reset Sheet</button>
          <button className="action-btn print" onClick={handlePrint}>🖨️ Print (A5)</button>
        </div>

        <div className="navbar-actions mobile-only">
          <button className="action-btn" onClick={toggleMobileDrawer}>☰ Menu</button>
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
            <button className="drawer-btn" onClick={() => { handleExport(); toggleMobileDrawer(); }}>💾 Export JSON</button>
            <button className="drawer-btn" onClick={() => { handleImportTrigger(); toggleMobileDrawer(); }}>📂 Import JSON</button>
            <button className="drawer-btn reset" onClick={() => { handleReset(); toggleMobileDrawer(); }}>🧹 Reset Sheet</button>
            <button className="drawer-btn" onClick={() => { handlePrint(); toggleMobileDrawer(); }}>🖨️ Print (A5)</button>
          </div>
        </div>
      </div>
    </>
  );
}
