import { useCharacterStore } from './store/useCharacterStore';
import { Navbar } from './components/Navbar';
import { CharacterSheet } from './components/CharacterSheet';
import { TomeOfRules } from './components/TomeOfRules';
import { ToastContainer } from './components/Toast';

export default function App() {
  const activeTab = useCharacterStore((state) => state.activeTab);

  return (
    <>
      {/* Top Sticky Navbar */}
      <Navbar />

      {/* Direct print error banner */}
      <div id="print-alert" className="print-error-box no-print" style={{ maxWidth: '800px', margin: '10px auto', width: '95%' }}>
        <strong>Attention:</strong> Direct print initiation is blocked by your browser's embedded iframe security policy. <br />
        Please use the standard browser shortcut: <br />
        • Windows/Linux: press <strong>Ctrl + P</strong> | • macOS: press <strong>Cmd + P</strong> <br />
        Or right-click anywhere on the page and select <strong>"Print..."</strong>.
      </div>

      {/* Main Tab Views */}
      {activeTab === 'sheet-tab' ? <CharacterSheet /> : <TomeOfRules />}

      {/* Toast Alert Popups */}
      <ToastContainer />
    </>
  );
}

