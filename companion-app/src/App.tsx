import { useEffect } from 'react';
import { useCharacterStore } from './store/useCharacterStore';
import { Navbar } from './components/Navbar';
import { CharacterSheet } from './components/CharacterSheet';
import { TomeOfRules } from './components/TomeOfRules';
import { ToastContainer } from './components/Toast';

export default function App() {
  const activeTab = useCharacterStore((state) => state.activeTab);
  const user = useCharacterStore((state) => state.user);
  const currentCharId = useCharacterStore((state) => state.currentCharId);
  const inputs = useCharacterStore((state) => state.inputs);
  const charState = useCharacterStore((state) => state.charState);
  
  const recoverSession = useCharacterStore((state) => state.recoverSession);
  const saveCharacterToCloud = useCharacterStore((state) => state.saveCharacterToCloud);
  const setSavingState = useCharacterStore((state) => state.setSavingState);
  const theme = useCharacterStore((state) => state.theme);

  // Initialize session and theme
  useEffect(() => {
    recoverSession();
    // Set initial theme attribute
    document.documentElement.setAttribute('data-theme', theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced auto-save effect
  useEffect(() => {
    if (!user || !currentCharId) return;

    // Set status to saving on any modification
    setSavingState('saving');

    const timer = setTimeout(async () => {
      const { error } = await saveCharacterToCloud(currentCharId, inputs, charState);
      if (error) {
        setSavingState('error');
      } else {
        setSavingState('saved');
      }
    }, 1500); // 1.5 seconds debounce

    return () => clearTimeout(timer);
  }, [inputs, charState, user, currentCharId, saveCharacterToCloud, setSavingState]);

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

