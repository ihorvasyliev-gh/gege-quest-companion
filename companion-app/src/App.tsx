import { useEffect } from 'react';
import { useCharacterStore } from './store/useCharacterStore';
import { Navbar } from './components/Navbar';
import { CharacterSheet } from './components/CharacterSheet';
import { TomeOfRules } from './components/TomeOfRules';
import { ToastContainer } from './components/Toast';

export default function App() {
  const activeTab = useCharacterStore((state) => state.activeTab);

  // Responsive page scaling observer
  useEffect(() => {
    const resizePages = () => {
      if (window.innerWidth >= 600) {
        document.querySelectorAll<HTMLElement>('.page').forEach((page) => {
          page.style.transform = '';
          page.style.transformOrigin = '';
          const wrapper = page.parentElement;
          if (wrapper && wrapper.classList.contains('page-wrapper')) {
            wrapper.style.height = '';
          }
        });
        return;
      }

      document.querySelectorAll<HTMLElement>('.page').forEach((page) => {
        const wrapper = page.parentElement;
        if (!wrapper || !wrapper.classList.contains('page-wrapper')) return;

        const wrapperWidth = wrapper.clientWidth || window.innerWidth - 20;
        const pageOriginalWidth = 560; // 148mm scale width representation
        let scale = wrapperWidth / pageOriginalWidth;
        if (scale > 1) scale = 1;

        page.style.transform = `scale(${scale})`;
        page.style.transformOrigin = 'top center';

        const pageOriginalHeight = 794; // 210mm A5 height representation
        wrapper.style.height = (pageOriginalHeight * scale) + 'px';
      });
    };

    // Run resizing on events
    window.addEventListener('resize', resizePages);
    
    // Initial run with short timeout to ensure components are fully rendered in the DOM
    const timerId = setTimeout(resizePages, 50);

    return () => {
      window.removeEventListener('resize', resizePages);
      clearTimeout(timerId);
    };
  }, [activeTab]);

  return (
    <>
      {/* Top Sticky Navbar */}
      <Navbar />

      {/* A5 Print Instructions Banner */}
      <div className="print-banner no-print" style={{ marginTop: '10px' }}>
        <h4>Physical Campaign Printing Guide</h4>
        <p>
          GeGe QUEST Companion sheets are engineered for standard <strong>A5 Paper dimensions (148mm x 210mm)</strong>. <br />
          For physical binders: Set printing layout to <strong>Portrait</strong>, Scale to <strong>100% (or Default)</strong>, and select <strong>A5 Paper size</strong>.
        </p>
      </div>

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
