import { useCharacterStore, TALENTS, getTalentById, getClassNameReadable } from '../store/useCharacterStore';

// Pages corner Celtic knots
const Corners = () => (
  <>
    <div className="corner corner-tl">
      <svg viewBox="0 0 50 50">
        <path d="M5,2 C5,2 2,2 2,5 L2,20 C2,22 4,22 4,20 L4,8 C4,6 6,4 8,4 L20,4 C22,4 22,2 20,2 Z" fill="#4a2e13"/>
        <path d="M8,6 C8,6 6,6 6,8 L6,18 C6,19 7,19 7,18 L7,10 C7,8 9,7 10,7 L18,7 C19,7 19,6 18,6 Z" fill="#4a2e13" opacity="0.7"/>
        <path d="M2,5 Q2,2 5,2" fill="none" stroke="#4a2e13" strokeWidth="1.5"/>
        <path d="M3,12 C3,9 5,7 7,7 M12,3 C9,3 7,5 7,7" fill="none" stroke="#4a2e13" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="5" cy="5" r="1.8" fill="#4a2e13"/>
        <circle cx="5" cy="5" r="0.8" fill="#f3e5c8"/>
        <path d="M10,2.5 L10,5 M14,2.5 L14,4 M2.5,10 L5,10 M2.5,14 L4,14" stroke="#4a2e13" strokeWidth="0.5" opacity="0.4"/>
        <path d="M9,9 C11,7 13,9 11,11 C9,13 7,11 9,9 Z" fill="#4a2e13" opacity="0.35"/>
      </svg>
    </div>
    <div className="corner corner-tr">
      <svg viewBox="0 0 50 50">
        <path d="M5,2 C5,2 2,2 2,5 L2,20 C2,22 4,22 4,20 L4,8 C4,6 6,4 8,4 L20,4 C22,4 22,2 20,2 Z" fill="#4a2e13"/>
        <path d="M8,6 C8,6 6,6 6,8 L6,18 C6,19 7,19 7,18 L7,10 C7,8 9,7 10,7 L18,7 C19,7 19,6 18,6 Z" fill="#4a2e13" opacity="0.7"/>
        <path d="M2,5 Q2,2 5,2" fill="none" stroke="#4a2e13" strokeWidth="1.5"/>
        <path d="M3,12 C3,9 5,7 7,7 M12,3 C9,3 7,5 7,7" fill="none" stroke="#4a2e13" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="5" cy="5" r="1.8" fill="#4a2e13"/>
        <circle cx="5" cy="5" r="0.8" fill="#f3e5c8"/>
        <path d="M10,2.5 L10,5 M14,2.5 L14,4 M2.5,10 L5,10 M2.5,14 L4,14" stroke="#4a2e13" strokeWidth="0.5" opacity="0.4"/>
        <path d="M9,9 C11,7 13,9 11,11 C9,13 7,11 9,9 Z" fill="#4a2e13" opacity="0.35"/>
      </svg>
    </div>
    <div className="corner corner-bl">
      <svg viewBox="0 0 50 50">
        <path d="M5,2 C5,2 2,2 2,5 L2,20 C2,22 4,22 4,20 L4,8 C4,6 6,4 8,4 L20,4 C22,4 22,2 20,2 Z" fill="#4a2e13"/>
        <path d="M8,6 C8,6 6,6 6,8 L6,18 C6,19 7,19 7,18 L7,10 C7,8 9,7 10,7 L18,7 C19,7 19,6 18,6 Z" fill="#4a2e13" opacity="0.7"/>
        <path d="M2,5 Q2,2 5,2" fill="none" stroke="#4a2e13" strokeWidth="1.5"/>
        <circle cx="5" cy="5" r="1.8" fill="#4a2e13"/>
        <circle cx="5" cy="5" r="0.8" fill="#f3e5c8"/>
        <path d="M9,9 C11,7 13,9 11,11 C9,13 7,11 9,9 Z" fill="#4a2e13" opacity="0.35"/>
      </svg>
    </div>
    <div className="corner corner-br">
      <svg viewBox="0 0 50 50">
        <path d="M5,2 C5,2 2,2 2,5 L2,20 C2,22 4,22 4,20 L4,8 C4,6 6,4 8,4 L20,4 C22,4 22,2 20,2 Z" fill="#4a2e13"/>
        <path d="M8,6 C8,6 6,6 6,8 L6,18 C6,19 7,19 7,18 L7,10 C7,8 9,7 10,7 L18,7 C19,7 19,6 18,6 Z" fill="#4a2e13" opacity="0.7"/>
        <path d="M2,5 Q2,2 5,2" fill="none" stroke="#4a2e13" strokeWidth="1.5"/>
        <circle cx="5" cy="5" r="1.8" fill="#4a2e13"/>
        <circle cx="5" cy="5" r="0.8" fill="#f3e5c8"/>
        <path d="M9,9 C11,7 13,9 11,11 C9,13 7,11 9,9 Z" fill="#4a2e13" opacity="0.35"/>
      </svg>
    </div>
  </>
);

// Pages border vines
const Borders = () => (
  <>
    <div className="page-border border-top">
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 400 10">
        <path d="M0,5 C20,2 30,8 50,5 C70,2 80,8 100,5 C120,2 130,8 150,5 C170,2 180,8 200,5 C220,2 230,8 250,5 C270,2 280,8 300,5 C320,2 330,8 350,5 C370,2 380,8 400,5" stroke="#4a2e13" strokeWidth="1" opacity="0.6"/>
        <path d="M0,5 C10,0 20,10 30,5 C40,0 50,10 60,5 C70,0 80,10 90,5 C100,0 110,10 120,5 C130,0 140,10 150,5 C160,0 170,10 180,5 C190,0 200,10 210,5 C220,0 230,10 240,5 C250,0 260,10 270,5 C280,0 290,10 300,5 C310,0 320,10 330,5 C340,0 350,10 360,5 C370,0 380,10 390,5 C395,2.5 400,5 400,5" stroke="#4a2e13" strokeWidth="0.5" opacity="0.35"/>
      </svg>
    </div>
    <div className="page-border border-bottom">
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 400 10">
        <path d="M0,5 C20,2 30,8 50,5 C70,2 80,8 100,5 C120,2 130,8 150,5 C170,2 180,8 200,5 C220,2 230,8 250,5 C270,2 280,8 300,5 C320,2 330,8 350,5 C370,2 380,8 400,5" stroke="#4a2e13" strokeWidth="1" opacity="0.6"/>
        <path d="M0,5 C10,0 20,10 30,5 C40,0 50,10 60,5 C70,0 80,10 90,5 C100,0 110,10 120,5 C130,0 140,10 150,5 C160,0 170,10 180,5 C190,0 200,10 210,5 C220,0 230,10 240,5 C250,0 260,10 270,5 C280,0 290,10 300,5 C310,0 320,10 330,5 C340,0 350,10 360,5 C370,0 380,10 390,5 C395,2.5 400,5 400,5" stroke="#4a2e13" strokeWidth="0.5" opacity="0.35"/>
      </svg>
    </div>
    <div className="page-border border-left">
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 10 500">
        <path d="M5,0 C2,20 8,30 5,50 C2,70 8,80 5,100 C2,120 8,130 5,150 C2,170 8,180 5,200 C2,220 8,230 5,250 C2,270 8,280 5,300 C2,320 8,330 5,350 C2,370 8,380 5,400 C2,420 8,430 5,450 C2,470 8,480 5,500" stroke="#4a2e13" strokeWidth="1" opacity="0.6"/>
      </svg>
    </div>
    <div className="page-border border-right">
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 10 500">
        <path d="M5,0 C2,20 8,30 5,50 C2,70 8,80 5,100 C2,120 8,130 5,150 C2,170 8,180 5,200 C2,220 8,230 5,250 C2,270 8,280 5,300 C2,320 8,330 5,350 C2,370 8,380 5,400 C2,420 8,430 5,450 C2,470 8,480 5,500" stroke="#4a2e13" strokeWidth="1" opacity="0.6"/>
      </svg>
    </div>
  </>
);

export function CharacterSheet() {
  const inputs = useCharacterStore((state) => state.inputs);
  const updateInput = useCharacterStore((state) => state.updateInput);
  const charState = useCharacterStore((state) => state.charState);

  // Helper for input binding
  const bindInput = (id: string) => ({
    value: inputs[id] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => updateInput(id, e.target.value),
  });

  return (
    <div id="sheet-tab" className="tab-content active">
      
      {/* PAGE 1: FRONT PAGE */}
      <div className="page-wrapper">
        <div className="page" id="front-page">
          <Corners />
          <Borders />

          {/* Watermark: Heraldic Dragon Crest */}
          <svg className="page-watermark" viewBox="0 0 200 200">
            <path d="M100,15 L155,35 L155,100 C155,140 100,180 100,185 C100,180 45,140 45,100 L45,35 Z" fill="#5c3e21" opacity="0.4"/>
            <path d="M100,22 L148,40 L148,98 C148,135 100,172 100,177 C100,172 52,135 52,98 L52,40 Z" fill="#f3e5c8" stroke="#5c3e21" strokeWidth="1"/>
            <path d="M100,45 C90,45 78,55 78,70 C78,78 82,85 88,90 L80,105 C75,112 80,118 85,115 L92,108 C95,110 98,112 100,112 C102,112 105,110 108,108 L115,115 C120,118 125,112 120,105 L112,90 C118,85 122,78 122,70 C122,55 110,45 100,45 Z" fill="#5c3e21" opacity="0.5"/>
            <path d="M94,55 C92,52 88,52 86,55 L84,60 C84,63 86,65 88,64 L90,62 M106,55 C108,52 112,52 114,55 L116,60 C116,63 114,65 112,64 L110,62" fill="none" stroke="#5c3e21" strokeWidth="1.2" opacity="0.5"/>
            <path d="M78,70 C65,58 55,55 50,60 C55,65 62,68 70,72 M122,70 C135,58 145,55 150,60 C145,65 138,68 130,72" fill="none" stroke="#5c3e21" strokeWidth="1.5" opacity="0.4"/>
            <path d="M88,40 L92,32 L96,38 L100,28 L104,38 L108,32 L112,40" fill="none" stroke="#5c3e21" strokeWidth="1.2" opacity="0.4"/>
            <path d="M100,130 L100,155 M90,142 L110,142" stroke="#5c3e21" strokeWidth="1.5" opacity="0.3"/>
            <circle cx="100" cy="142" r="4" fill="none" stroke="#5c3e21" strokeWidth="1" opacity="0.3"/>
          </svg>

          <div>
            <div className="header-container">
              <h1 className="main-title">GeGe QUEST</h1>
              <div className="subtitle">Character Sheet</div>
            </div>

            {/* Identity Panel */}
            <div className="row" style={{ marginBottom: '8px' }}>
              <div className="field flex-2">
                <label>Hero Name:</label>
                <input type="text" id="hero-name" {...bindInput('hero-name')} />
              </div>
              <div className="field flex-1">
                <label>Class:</label>
                <input type="text" id="hero-class" {...bindInput('hero-class')} />
              </div>
            </div>

            {/* Stone Stats Blocks */}
            <div className="stone-stats">
              <div className="stone-block">
                <div className="stone-title">Attack Dice</div>
                <div className="stone-value-box">
                  <input type="text" id="stat-attack" {...bindInput('stat-attack')} />
                </div>
              </div>
              <div className="stone-block">
                <div className="stone-title">Defend Dice</div>
                <div className="stone-value-box">
                  <input type="text" id="stat-defense" {...bindInput('stat-defense')} />
                </div>
              </div>
              <div className="stone-block">
                <div className="stone-title">Body</div>
                <div className="stone-value-box">
                  <input type="text" id="stat-body" {...bindInput('stat-body')} />
                </div>
              </div>
              <div className="stone-block">
                <div className="stone-title">Mind</div>
                <div className="stone-value-box">
                  <input type="text" id="stat-mind" {...bindInput('stat-mind')} />
                </div>
              </div>
            </div>

            {/* Current Body Points tracker */}
            <div className="health-container">
              <div className="health-title">
                <span>Current Body Points</span>
              </div>
              <div className="health-grid">
                {Array.from({ length: 30 }, (_, index) => {
                  const i = index + 1;
                  const id = `health-${i}`;
                  return (
                    <div key={id} className="health-cell">
                      <input type="text" id={id} maxLength={3} {...bindInput(id)} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="divider">
              <div className="divider-line"></div>
              <svg className="divider-flourish" viewBox="0 0 120 24" style={{ width: '55px' }}>
                <path d="M15,20 L50,4 M55,20 L52,4" stroke="#4a2e13" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                <path d="M65,20 L70,4 M105,20 L68,4" stroke="#4a2e13" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                <path d="M60,4 L72,8 L72,16 C72,20 60,24 60,24 C60,24 48,20 48,16 L48,8 Z" fill="#4a2e13" opacity="0.85"/>
                <path d="M60,6 L70,9.5 L70,15.5 C70,19 60,22.5 60,22.5 C60,22.5 50,19 50,15.5 L50,9.5 Z" fill="#f3e5c8"/>
                <path d="M60,9 L60,20 M55,14 L65,14" stroke="#4a2e13" strokeWidth="1.2"/>
                <circle cx="15" cy="21" r="1.5" fill="#4a2e13"/>
                <circle cx="105" cy="21" r="1.5" fill="#4a2e13"/>
              </svg>
              <div className="divider-line"></div>
            </div>

            {/* Gold Ledger & XP block */}
            <div className="row" style={{ marginBottom: '8px' }}>
              <div className="parchment-box flex-1 h-38mm">
                <svg className="box-illustration" viewBox="0 0 100 100">
                  <path d="M25,55 L75,55 L75,85 L25,85 Z" fill="#4a2e13" opacity="0.15"/>
                  <path d="M22,55 L78,55 L78,48 C78,40 65,38 50,38 C35,38 22,40 22,48 Z" fill="#4a2e13" opacity="0.12"/>
                  <path d="M45,38 L45,85 M55,38 L55,85" stroke="#4a2e13" strokeWidth="1.5" opacity="0.1"/>
                  <circle cx="50" cy="65" r="3" fill="#4a2e13" opacity="0.15"/>
                  <path d="M50,68 L50,73" stroke="#4a2e13" strokeWidth="2" opacity="0.12"/>
                  <ellipse cx="35" cy="32" rx="6" ry="3" fill="#4a2e13" opacity="0.1"/>
                  <ellipse cx="58" cy="30" rx="5" ry="2.5" fill="#4a2e13" opacity="0.12"/>
                  <ellipse cx="48" cy="28" rx="5" ry="2.5" fill="#4a2e13" opacity="0.08"/>
                  <ellipse cx="68" cy="34" rx="4" ry="2" fill="#4a2e13" opacity="0.1"/>
                </svg>
                
                <div className="gold-header">
                  <h3>
                    <svg className="deco-icon" viewBox="0 0 24 24" width="13" height="13">
                      <path d="M4,12 L20,12 L20,20 L4,20 Z M4,12 L20,12 C20,8 16,6 12,6 C8,6 4,8 4,12 Z M10,6 L10,20 M14,6 L14,20" fill="none" stroke="#5c3e21" strokeWidth="1.2"/>
                      <circle cx="12" cy="15" r="1.2" fill="#5c3e21"/>
                    </svg>
                    Gold Coins
                  </h3>
                </div>
                <div className="field" style={{ marginBottom: '2px' }}>
                  <label style={{ fontSize: '8px' }}>Current Gold:</label>
                  <input type="text" id="char-gold" style={{ fontWeight: 'bold', color: '#724216', fontSize: '13px' }} {...bindInput('char-gold')} />
                </div>
                <div className="lines" style={{ marginTop: '2px' }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i}><input type="text" id={`gold-line-${i+1}`} {...bindInput(`gold-line-${i+1}`)} /></div>
                  ))}
                </div>
              </div>

              {/* XP Box */}
              <div className="parchment-box flex-1 xp-box h-38mm">
                <svg className="box-illustration" viewBox="0 0 100 100" style={{ opacity: 0.1, fill: 'none', stroke: '#855d14', strokeWidth: 1.5, height: '85%', width: 'auto', position: 'absolute', bottom: '4px', right: '4px', pointerEvents: 'none' }}>
                  <circle cx="50" cy="50" r="35" strokeDasharray="3 3" strokeWidth="1"/>
                  <circle cx="50" cy="50" r="28" strokeWidth="0.6"/>
                  <polygon points="50,18 53,42 50,38 47,42" fill="#855d14" fillOpacity="0.2" stroke="#855d14" strokeWidth="0.8"/>
                  <polygon points="50,82 53,58 50,62 47,58" fill="#855d14" fillOpacity="0.1" stroke="#855d14" strokeWidth="0.8"/>
                  <polygon points="18,50 42,47 38,50 42,53" fill="#855d14" fillOpacity="0.1" stroke="#855d14" strokeWidth="0.8"/>
                  <polygon points="82,50 58,47 62,50 58,53" fill="#855d14" fillOpacity="0.1" stroke="#855d14" strokeWidth="0.8"/>
                  <path d="M30,30 L45,45 M70,30 L55,45 M30,70 L45,55 M70,70 L55,55" strokeWidth="0.6" opacity="0.5"/>
                  <circle cx="50" cy="50" r="4" fill="#f3e5c8" stroke="#855d14" strokeWidth="1"/>
                  <circle cx="50" cy="50" r="1.5" fill="#855d14"/>
                  <path d="M25,75 C35,60 42,65 50,50 C58,35 65,40 75,25" strokeDasharray="2 2" strokeWidth="1" opacity="0.4"/>
                </svg>

                <h3>
                  <svg className="deco-icon" viewBox="0 0 24 24" width="13" height="13" style={{ fill: 'none', stroke: '#855d14', strokeWidth: 1.5, marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }}>
                    <polygon points="12,2 14,8 20,8 15,12 17,19 12,15 7,19 9,12 4,8 10,8" fill="#855d14" fillOpacity="0.15"/>
                    <path d="M12,2 L14,8 L20,8 L15,12 L17,19 L12,15 L7,19 L9,12 L4,8 L10,8 Z"/>
                    <path d="M12,19 L12,22" strokeWidth="1.2"/>
                    <path d="M9,21 L15,21" strokeWidth="0.8" opacity="0.5"/>
                  </svg>
                  XP & Level
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '3px' }}>
                  <div className="field"><label style={{ fontSize: '8.5px' }}>Current XP:</label><input type="text" id="char-xp" {...bindInput('char-xp')} /></div>
                  <div className="field"><label style={{ fontSize: '8.5px' }}>Next Level:</label><input type="text" id="char-next-level" readOnly {...bindInput('char-next-level')} /></div>
                  <div className="field" style={{ marginBottom: 0 }}><label style={{ fontSize: '8.5px' }}>Hero Rank:</label><input type="text" id="char-rank" {...bindInput('char-rank')} /></div>
                </div>
              </div>
            </div>

            {/* Alchemy Container */}
            <div className="parchment-box h-43mm" style={{ marginBottom: '6px' }}>
              <svg className="box-illustration" viewBox="0 0 100 100" style={{ opacity: 0.08, fill: 'none', stroke: '#4a2e13', strokeWidth: 1.8 }}>
                <path d="M30,50 C30,42 40,38 50,38 C60,38 70,42 70,50 L70,70 C70,78 60,82 50,82 C40,82 30,78 30,70 Z" strokeLinecap="round"/>
                <path d="M35,80 L32,90 M65,80 L68,90 M50,82 L50,90" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="42" cy="35" r="2.5" fill="#4a2e13" opacity="0.15"/>
                <circle cx="55" cy="30" r="3" fill="#4a2e13" opacity="0.12"/>
                <circle cx="48" cy="25" r="2" fill="#4a2e13" opacity="0.1"/>
                <circle cx="60" cy="22" r="1.5" fill="#4a2e13" opacity="0.08"/>
                <path d="M45,35 C42,28 48,22 45,15" strokeWidth="1" opacity="0.6"/>
                <path d="M55,33 C58,26 52,20 55,13" strokeWidth="1" opacity="0.5"/>
                <path d="M18,55 L18,45 L22,42 L26,42 L30,45 L30,55 C30,58 26,60 24,60 C22,60 18,58 18,55 Z" strokeWidth="1.2"/>
                <path d="M20,50 L28,50" strokeWidth="0.8" strokeDasharray="1 1"/>
                <path d="M75,55 L75,48 L78,46 L81,48 L81,55 C81,57 78,58 78,58 C78,58 75,57 75,55 Z" strokeWidth="1"/>
              </svg>

              <h3>
                <svg className="deco-icon" viewBox="0 0 24 24" width="13" height="13">
                  <path d="M6,12 C6,9 9,7 12,7 C15,7 18,9 18,12 L18,17 C18,19 15,21 12,21 C9,21 6,19 6,17 Z" fill="none" stroke="#5c3e21" strokeWidth="1.3"/>
                  <path d="M5,12 L19,12" stroke="#5c3e21" strokeWidth="1.3"/>
                  <circle cx="10" cy="5" r="1" fill="#5c3e21"/>
                  <circle cx="14" cy="3.5" r="1.2" fill="#5c3e21" opacity="0.7"/>
                  <path d="M8,20 L7,23 M16,20 L17,23" stroke="#5c3e21" strokeWidth="1"/>
                </svg>
                Alchemy & Other Items
              </h3>
              <div className="lines">
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i}><input type="text" id={`alchemy-line-${i+1}`} {...bindInput(`alchemy-line-${i+1}`)} /></div>
                ))}
              </div>
            </div>
          </div>

          <svg className="filigree-flourish" viewBox="0 0 140 16" style={{ maxWidth: '160px' }}>
            <path d="M10,12 C8,10 5,10 3,12 C5,8 8,6 12,7 L20,8 C25,8 28,10 30,12 L35,10 C38,8 42,8 45,9 L50,10 C52,10 55,9 58,10 L62,11" fill="none" stroke="#5c3e21" strokeWidth="0.8" opacity="0.4"/>
            <path d="M130,12 C132,10 135,10 137,12 C135,8 132,6 128,7 L120,8 C115,8 112,10 110,12 L105,10 C102,8 98,8 95,9 L90,10 C88,10 85,9 82,10 L78,11" fill="none" stroke="#5c3e21" strokeWidth="0.8" opacity="0.4"/>
            <polygon points="70,4 74,8 70,12 66,8" fill="#5c3e21" opacity="0.35"/>
            <circle cx="70" cy="8" r="1.5" fill="#f3e5c8" stroke="#5c3e21" strokeWidth="0.5" opacity="0.5"/>
            <path d="M12,7 C15,3 20,2 25,4 M128,7 C125,3 120,2 115,4" fill="none" stroke="#5c3e21" strokeWidth="0.6" opacity="0.3"/>
          </svg>

          {/* Pets & Companions Block */}
          <div className="parchment-box h-38mm">
            <h3>
              <svg className="deco-icon" viewBox="0 0 24 24" width="12" height="12">
                <path d="M12,2 L8,6 L4,5 L6,10 L4,14 L8,13 L10,18 L12,22 L14,18 L16,13 L20,14 L18,10 L20,5 L16,6 L12,2 Z" fill="none" stroke="#5c3e21" strokeWidth="1.2" strokeLinejoin="round"/>
                <circle cx="9.5" cy="9" r="1" fill="#5c3e21"/>
                <circle cx="14.5" cy="9" r="1" fill="#5c3e21"/>
                <path d="M10,13 L12,15 L14,13" fill="none" stroke="#5c3e21" strokeWidth="0.8"/>
              </svg>
              Pets & Companions
            </h3>
            
            <div className="pet-portrait-frame">
              <svg viewBox="0 0 24 24" style={{ fill: 'none' }}>
                <path d="M 3.15,12 A 8.85,8.85 0 0,1 20.85,12" fill="#8a6c51" fillOpacity="0.25" />
                <circle cx="12" cy="12" r="9" stroke="#8a6c51" strokeWidth="1.6" />
                <path d="M 3.15,12 L 9,12 M 15,12 L 20.85,12" stroke="#8a6c51" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="3" stroke="#8a6c51" strokeWidth="1.6" fill="#fdfbfa" />
                <circle cx="12" cy="12" r="1.1" fill="#8a6c51" />
              </svg>
            </div>

            <div style={{ marginLeft: '52px' }}>
              <div className="row" style={{ marginBottom: '3px' }}>
                <div className="field flex-2"><label style={{ fontSize: '8px' }}>Companion:</label><input type="text" id="pet-name" {...bindInput('pet-name')} /></div>
                <div className="field flex-1"><label style={{ fontSize: '8px' }}>Type:</label><input type="text" id="pet-type" {...bindInput('pet-type')} /></div>
              </div>
              <div className="row row-no-stack" style={{ marginBottom: '3px', gap: '6px' }}>
                <div className="field flex-1"><label style={{ fontSize: '7.5px' }}>Atk:</label><input type="text" id="pet-atk" {...bindInput('pet-atk')} /></div>
                <div className="field flex-1"><label style={{ fontSize: '7.5px' }}>Def:</label><input type="text" id="pet-def" {...bindInput('pet-def')} /></div>
                <div className="field flex-1"><label style={{ fontSize: '7.5px' }}>Body:</label><input type="text" id="pet-body" {...bindInput('pet-body')} /></div>
                <div className="field flex-1"><label style={{ fontSize: '7.5px' }}>Mind:</label><input type="text" id="pet-mind" {...bindInput('pet-mind')} /></div>
              </div>
              <div className="field" style={{ marginBottom: 0 }}><label style={{ fontSize: '7.5px' }}>Abilities:</label><input type="text" id="pet-abilities" {...bindInput('pet-abilities')} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2: BACK PAGE */}
      <div className="page-wrapper">
        <div className="page" id="back-page">
          <Corners />
          <Borders />

          {/* Watermark: Crossed Swords with Shield */}
          <svg className="page-watermark" viewBox="0 0 200 200">
            <path d="M40,180 L120,30" stroke="#5c3e21" strokeWidth="2.5" fill="none" opacity="0.4"/>
            <path d="M55,165 L42,178 M38,182 L52,168" stroke="#5c3e21" strokeWidth="3.5" opacity="0.35"/>
            <circle cx="37" cy="185" r="4" fill="#5c3e21" opacity="0.3"/>
            <path d="M160,180 L80,30" stroke="#5c3e21" strokeWidth="2.5" fill="none" opacity="0.4"/>
            <path d="M145,165 L158,178 M162,182 L148,168" stroke="#5c3e21" strokeWidth="3.5" opacity="0.35"/>
            <circle cx="163" cy="185" r="4" fill="#5c3e21" opacity="0.3"/>
            <path d="M100,55 L130,70 L130,115 C130,140 100,160 100,162 C100,160 70,140 70,115 L70,70 Z" fill="#5c3e21" opacity="0.25"/>
            <path d="M100,62 L125,74 L125,112 C125,135 100,153 100,155 C100,153 75,135 75,112 L75,74 Z" fill="#f3e5c8" stroke="#5c3e21" strokeWidth="0.8" opacity="0.5"/>
            <path d="M100,78 L100,140 M85,105 L115,105" stroke="#5c3e21" strokeWidth="2" opacity="0.3"/>
            <path d="M65,65 C55,75 55,90 60,100 C50,90 48,75 55,62 Z" fill="#5c3e21" opacity="0.15"/>
            <path d="M135,65 C145,75 145,90 140,100 C150,90 152,75 145,62 Z" fill="#5c3e21" opacity="0.15"/>
          </svg>

          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="header-container">
              <h1 className="main-title" style={{ fontSize: '20px' }}>THE HERO'S ARSENAL</h1>
              <div className="subtitle" style={{ fontSize: '9px', letterSpacing: '2.5px' }}>Equipment & Trophies</div>
            </div>

            {/* Combat Gear Layout */}
            <div className="row h-38mm">
              <div className="parchment-box flex-1 lined-zone" style={{ zIndex: 2 }}>
                <svg className="box-illustration" viewBox="0 0 100 100" style={{ opacity: 0.085, fill: 'none', stroke: '#4a2e13', strokeWidth: 1.8 }}>
                  <path d="M25,85 L25,20" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M15,30 C12,25 12,18 18,15 L25,20 L18,35 C12,33 13,28 15,30 Z" fill="#4a2e13" opacity="0.15"/>
                  <path d="M50,88 L50,18 L48,15 L50,10 L52,15 L50,18" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M42,22 L58,22" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M75,88 L75,25" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M75,25 L70,15 L75,8 L80,15 Z" fill="#4a2e13" opacity="0.12"/>
                  <path d="M12,80 L88,80" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
                  <path d="M15,80 L15,90 M85,80 L85,90" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                </svg>

                <h3>
                  <svg className="deco-icon" viewBox="0 0 24 24" width="12" height="12">
                    <path d="M4,20 L14,4" stroke="#5c3e21" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                    <path d="M20,20 L10,4" stroke="#5c3e21" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                    <path d="M7,9 L4,7 L6,3 L10,5" fill="#5c3e21" opacity="0.6"/>
                    <path d="M8,6 L16,6" stroke="#5c3e21" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Weapons & Gear
                </h3>
                <div className="lines">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div key={i}><input type="text" id={`weapon-line-${i+1}`} {...bindInput(`weapon-line-${i+1}`)} /></div>
                  ))}
                </div>
              </div>

              {/* Armor Block */}
              <div className="parchment-box flex-1 lined-zone" style={{ zIndex: 2 }}>
                <svg className="box-illustration" viewBox="0 0 100 100" style={{ opacity: 0.08, fill: 'none', stroke: '#4a2e13', strokeWidth: 1.8 }}>
                  <path d="M30,22 L70,22 L70,58 C70,75 50,88 50,90 C50,88 30,75 30,58 Z" strokeLinejoin="round" strokeWidth="2"/>
                  <path d="M35,27 L65,27 L65,55 C65,70 50,82 50,84 C50,82 35,70 35,55 Z" strokeDasharray="2 2" strokeWidth="1"/>
                  <path d="M50,35 C47,35 44,38 44,42 C44,46 47,50 50,52 C53,50 56,46 56,42 C56,38 53,35 50,35 Z" fill="#4a2e13" opacity="0.1"/>
                  <path d="M50,40 L50,48 M46,44 L54,44" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
                  <path d="M42,22 C42,14 50,8 50,8 C50,8 58,14 58,22" strokeWidth="1.5"/>
                  <path d="M46,16 L54,16" strokeWidth="0.8" opacity="0.6"/>
                  <path d="M30,28 C24,30 20,35 22,40" strokeWidth="1.5" opacity="0.6"/>
                  <path d="M70,28 C76,30 80,35 78,40" strokeWidth="1.5" opacity="0.6"/>
                </svg>

                <h3>
                  <svg className="deco-icon" viewBox="0 0 24 24" width="11" height="11">
                    <path d="M12,2 L20,6 L20,13 C20,18 12,22 12,22 C12,22 4,18 4,13 L4,6 Z" fill="none" stroke="#5c3e21" strokeWidth="1.3" strokeLinejoin="round"/>
                    <path d="M12,6 L12,18 M8,11 L16,11" stroke="#5c3e21" strokeWidth="1"/>
                    <circle cx="12" cy="11" r="2" fill="none" stroke="#5c3e21" strokeWidth="0.8"/>
                  </svg>
                  Armor & Protection
                </h3>
                <div className="lines">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div key={i}><input type="text" id={`armor-line-${i+1}`} {...bindInput(`armor-line-${i+1}`)} /></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Crossed swords divider to fill vertical space */}
            <div className="divider" style={{ margin: '14px 0' }}>
              <div className="divider-line"></div>
              <svg viewBox="0 0 100 24" style={{ width: '65px', height: '18px', fill: 'none', stroke: '#4a2e13', strokeWidth: 1.2, margin: '0 8px', opacity: 0.8 }}>
                <path d="M5,12 L38,12 M62,12 L95,12" strokeWidth="1" />
                <path d="M42,17 L58,7 M58,17 L42,7" strokeLinecap="round" />
                <path d="M40,19 L43,16 M60,19 L57,16" strokeLinecap="round" />
                <circle cx="50" cy="12" r="3" fill="#4a2e13" stroke="none" />
              </svg>
              <div className="divider-line"></div>
            </div>

            {/* Giant Defeated Foes Ledger */}
            <div>
              <div className="scroll-header">
                <h3>The Ledger of Defeated Foes</h3>
              </div>
              
              <div className="parchment-box h-112mm" style={{ overflow: 'hidden', zIndex: 2 }}>
                <table className="monster-table">
                  <thead>
                    <tr>
                      <th colSpan={2}>
                        <svg className="deco-icon" viewBox="0 0 24 24" width="11" height="11" fill="#fffdfa" style={{ marginRight: '3px' }}>
                          <path d="M12,2 C8,2 4,5 4,10 C4,13 5.5,15.5 8,17 L7,21 L10,19 L12,21 L14,19 L17,21 L16,17 C18.5,15.5 20,13 20,10 C20,5 16,2 12,2 Z"/>
                          <circle cx="9" cy="10" r="2" fill="#4a2e13"/>
                          <circle cx="15" cy="10" r="2" fill="#4a2e13"/>
                          <path d="M10,14 L12,15 L14,14" fill="none" stroke="#4a2e13" strokeWidth="1"/>
                          <path d="M4,8 L2,3 L5,6 M20,8 L22,3 L19,6" fill="#fffdfa" stroke="#fffdfa" strokeWidth="0.5"/>
                        </svg>
                        Monster Type (Write-in)
                      </th>
                      <th className="tally">Kills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 18 }, (_, index) => {
                      const i = index + 1;
                      const nameId = `foe-name-${i}`;
                      const killsId = `foe-kills-${i}`;
                      return (
                        <tr key={i}>
                          <td className="num">{i}</td>
                          <td className="name-input">
                            <input type="text" id={nameId} {...bindInput(nameId)} />
                          </td>
                          <td className="tally">
                            <input type="text" id={killsId} {...bindInput(killsId)} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 3: SPELLS & TALENTS */}
      <div className="page-wrapper">
        <div className="page" id="talents-page">
          <Corners />
          <Borders />

          {/* Watermark: Magic Pentagram */}
          <svg className="page-watermark" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="75" stroke="#5c3e21" strokeWidth="1.5" fill="none" opacity="0.4"/>
            <circle cx="100" cy="100" r="70" stroke="#5c3e21" strokeWidth="0.5" fill="none" strokeDasharray="3 3" opacity="0.3"/>
            <polygon points="100,28 118,72 172,72 128,100 142,148 100,120 58,148 72,100 28,72 82,72" fill="none" stroke="#5c3e21" strokeWidth="1.2" opacity="0.35"/>
            <polygon points="100,55 125,82 115,115 85,115 75,82" fill="#5c3e21" opacity="0.06"/>
            <circle cx="100" cy="95" r="12" fill="none" stroke="#5c3e21" strokeWidth="1" opacity="0.4"/>
            <circle cx="100" cy="95" r="5" fill="#5c3e21" opacity="0.15"/>
            <circle cx="100" cy="95" r="2" fill="#f3e5c8" opacity="0.5"/>
            <text x="100" y="18" textAnchor="middle" fontFamily="serif" fontSize="8" fill="#5c3e21" opacity="0.25">ᚠ</text>
            <text x="170" y="55" textAnchor="middle" fontFamily="serif" fontSize="8" fill="#5c3e21" opacity="0.25">ᚢ</text>
            <text x="175" y="140" textAnchor="middle" fontFamily="serif" fontSize="8" fill="#5c3e21" opacity="0.25">ᚦ</text>
            <text x="100" y="188" textAnchor="middle" fontFamily="serif" fontSize="8" fill="#5c3e21" opacity="0.25">ᚨ</text>
            <text x="25" y="140" textAnchor="middle" fontFamily="serif" fontSize="8" fill="#5c3e21" opacity="0.25">ᚱ</text>
            <text x="30" y="55" textAnchor="middle" fontFamily="serif" fontSize="8" fill="#5c3e21" opacity="0.25">ᚲ</text>
            <path d="M100,28 L100,15 M172,72 L182,65 M142,148 L150,158 M58,148 L50,158 M28,72 L18,65" stroke="#5c3e21" strokeWidth="0.8" opacity="0.2"/>
          </svg>

          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="header-container">
              <h1 className="main-title" style={{ fontSize: '20px' }}>SPELLS & TALENTS</h1>
              <div className="subtitle" style={{ fontSize: '9px', letterSpacing: '2px' }}>Advancements & Codex</div>
            </div>

            {/* Permanent Stat Advancements */}
            <div className="parchment-box" style={{ padding: '5px 8px' }}>
              <h3>Permanent Stat Advancements (AP Purchases)</h3>
              <div className="stat-upgrades-grid">
                <div className="stat-upgrade-card">
                  <span className="stat-upgrade-label">Toughness (Body, Max +3)</span>
                  <div className="stat-upgrade-slots">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div
                        key={i}
                        className={`stat-upgrade-slot ${(i + 1) <= (charState.purchasedTalents['toughness'] || 0) ? 'checked' : ''}`}
                        id={`slot-toughness-${i+1}`}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="stat-upgrade-card">
                  <span className="stat-upgrade-label">Iron Will (Mind, Max +2)</span>
                  <div className="stat-upgrade-slots">
                    {Array.from({ length: 2 }, (_, i) => (
                      <div
                        key={i}
                        className={`stat-upgrade-slot ${(i + 1) <= (charState.purchasedTalents['iron_will'] || 0) ? 'checked' : ''}`}
                        id={`slot-iron-will-${i+1}`}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="stat-upgrade-card">
                  <span className="stat-upgrade-label">Attack Die (Max +1)</span>
                  <div className="stat-upgrade-slots">
                    <div className="stat-upgrade-slot" id="slot-attack-1"></div>
                  </div>
                </div>
                <div className="stat-upgrade-card">
                  <span className="stat-upgrade-label">Defend Die (Max +1)</span>
                  <div className="stat-upgrade-slots">
                    <div
                      className={`stat-upgrade-slot ${(charState.purchasedTalents['living_fortress'] || 0) > 0 ? 'checked' : ''}`}
                      id="slot-defense-1"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Magic star divider to fill space */}
            <div className="divider" style={{ margin: '8px 0' }}>
              <div className="divider-line"></div>
              <svg viewBox="0 0 100 24" style={{ width: '65px', height: '18px', fill: 'none', stroke: '#4a2e13', strokeWidth: 1.2, margin: '0 8px', opacity: 0.8 }}>
                <path d="M5,12 L38,12 M62,12 L95,12" strokeWidth="1" />
                <polygon points="50,4 53,11 60,11 55,15 57,21 50,17 43,21 45,15 40,11 47,11" fill="#4a2e13" stroke="none" />
                <circle cx="50" cy="12" r="7" stroke="#4a2e13" strokeWidth="0.8" />
              </svg>
              <div className="divider-line"></div>
            </div>

            {/* Unlocked Talents Box */}
            <div className="parchment-box h-68mm" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3>Unlocked Talents & Special Abilities</h3>
              <div className="unlocked-talents-list" id="unlocked-talents-list" style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflow: 'hidden', flexGrow: 1 }}>
                {Object.keys(charState.purchasedTalents).filter(tid => charState.purchasedTalents[tid] > 0).length > 0 ? (
                  Object.keys(charState.purchasedTalents)
                    .filter(tid => charState.purchasedTalents[tid] > 0)
                    .map((tid) => {
                      const count = charState.purchasedTalents[tid];
                      const talent = getTalentById(tid);
                      if (!talent) return null;
                      const displayCount = count > 1 ? ` (x${count})` : '';
                      return (
                        <div key={tid} className="unlocked-talent-item">
                          <span className="unlocked-talent-name">{talent.name}{displayCount}:</span>
                          <span className="unlocked-talent-desc">{talent.desc}</span>
                        </div>
                      );
                    })
                ) : (
                  <div className="lines" style={{ marginTop: '2px', flexGrow: 1, overflow: 'hidden' }}>
                    {Array.from({ length: 13 }, (_, i) => (
                      <div key={i}><input type="text" id={`hand-talent-line-${i+1}`} {...bindInput(`hand-talent-line-${i+1}`)} /></div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Magic star divider to fill space */}
            <div className="divider" style={{ margin: '8px 0' }}>
              <div className="divider-line"></div>
              <svg viewBox="0 0 100 24" style={{ width: '65px', height: '18px', fill: 'none', stroke: '#4a2e13', strokeWidth: 1.2, margin: '0 8px', opacity: 0.8 }}>
                <path d="M5,12 L38,12 M62,12 L95,12" strokeWidth="1" />
                <polygon points="50,4 53,11 60,11 55,15 57,21 50,17 43,21 45,15 40,11 47,11" fill="#4a2e13" stroke="none" />
                <circle cx="50" cy="12" r="7" stroke="#4a2e13" strokeWidth="0.8" />
              </svg>
              <div className="divider-line"></div>
            </div>

            {/* Spellbook / Notes Lined Section */}
            <div className="parchment-box h-52mm">
              <h3>Spellbook & Magic Scrolls</h3>
              <div className="lines" style={{ marginTop: '2px' }}>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i}><input type="text" id={`spell-line-${i+1}`} {...bindInput(`spell-line-${i+1}`)} /></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 4: RULES & REFERENCE SHEET */}
      <div className="page-wrapper">
        <div className="page" id="rules-reference-page">
          <Corners />
          <Borders />

          {/* Watermark: Open Book with Quill */}
          <svg className="page-watermark" viewBox="0 0 200 200" style={{ opacity: 0.035 }}>
            {/* Left page */}
            <path d="M30,40 L95,35 L95,160 L30,165 Z" fill="#5c3e21" opacity="0.3"/>
            {/* Right page */}
            <path d="M170,40 L105,35 L105,160 L170,165 Z" fill="#5c3e21" opacity="0.3"/>
            {/* Spine */}
            <path d="M95,35 L100,30 L105,35 M95,160 L100,165 L105,160" fill="none" stroke="#5c3e21" strokeWidth={2}/>
            <path d="M100,30 L100,165" stroke="#5c3e21" strokeWidth={1.5}/>
            {/* Page lines (left) */}
            <path d="M40,55 L88,52 M40,65 L88,62 M40,75 L88,72 M40,85 L88,82 M40,95 L88,92 M40,105 L88,102 M40,115 L88,112 M40,125 L88,122 M40,135 L88,132 M40,145 L88,142" stroke="#5c3e21" strokeWidth={0.4} opacity={0.5}/>
            {/* Page lines (right) */}
            <path d="M112,52 L160,55 M112,62 L160,65 M112,72 L160,75 M112,82 L160,85 M112,92 L160,95 M112,102 L160,105 M112,112 L160,115 M112,122 L160,125 M112,132 L160,135 M112,142 L160,145" stroke="#5c3e21" strokeWidth={0.4} opacity={0.5}/>
            {/* Quill pen */}
            <path d="M155,20 C150,25 145,35 140,50 C138,55 135,58 130,60" stroke="#5c3e21" strokeWidth={1.5} fill="none"/>
            <path d="M155,20 L162,15 C165,18 163,22 160,24 Z" fill="#5c3e21" opacity="0.5"/>
            {/* Ink drops */}
            <circle cx={128} cy={62} r={2} fill="#5c3e21" opacity="0.4"/>
            <circle cx={132} cy={65} r={1} fill="#5c3e21" opacity="0.3"/>
          </svg>

          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="header-container" style={{ marginBottom: '6px' }}>
              <h1 className="main-title" style={{ fontSize: '20px' }}>HERO REFERENCE</h1>
              <div className="subtitle" style={{ fontSize: '9px', letterSpacing: '2px' }}>Codex & Leveling Rules</div>
            </div>

            <div className="reference-grid">
              
              {/* LEFT COLUMN: TALENTS */}
              <div className="reference-column">
                
                {/* Class Talents Reference Box */}
                <div className="parchment-box reference-box h-110mm" style={{ overflow: 'hidden' }}>
                  <h3 id="ref-class-title">
                    {charState.class ? `${getClassNameReadable(charState.class)} Talents Reference` : 'Class Talents Reference'}
                  </h3>
                  <div id="ref-class-talents-content" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {charState.class && TALENTS.classes[charState.class] ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5px', overflow: 'hidden', paddingTop: '2px', height: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5px' }}>
                          {TALENTS.classes[charState.class].map((talent) => (
                            <div key={talent.id} className="ref-talent-item">
                              <span className="ref-talent-name">{talent.name}</span>
                              <span className="ref-talent-cost">{talent.cost} AP</span>
                              {talent.desc}
                            </div>
                          ))}
                        </div>
                        <div className="divider" style={{ margin: '8px 0 4px 0' }}>
                          <div className="divider-line" style={{ opacity: 0.3 }}></div>
                          <span style={{ fontFamily: 'Cinzel, serif', fontSize: '7.5px', color: '#724216', padding: '0 6px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.6 }}>Notes & Special Rules</span>
                          <div className="divider-line" style={{ opacity: 0.3 }}></div>
                        </div>
                        <div className="lines" style={{ marginTop: '2px', flexGrow: 1 }}>
                          {Array.from({ length: 7 }, (_, i) => {
                            const lineIndex = 8 + i;
                            return (
                              <div key={lineIndex}>
                                <input type="text" id={`ref-class-line-${lineIndex}`} {...bindInput(`ref-class-line-${lineIndex}`)} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="lines" style={{ marginTop: '2px' }}>
                        {Array.from({ length: 14 }, (_, i) => (
                          <div key={i}><input type="text" id={`ref-class-line-${i+1}`} {...bindInput(`ref-class-line-${i+1}`)} /></div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Shared Talents Reference Box */}
                <div className="parchment-box reference-box h-65mm" style={{ overflow: 'hidden' }}>
                  <h3>Shared Talents Reference</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div className="ref-talent-item"><span className="ref-talent-name">Toughness</span><span className="ref-talent-cost">1 AP</span>+1 Body Point (Max 3 purchases)</div>
                    <div className="ref-talent-item"><span className="ref-talent-name">Iron Will</span><span className="ref-talent-cost">1 AP</span>+1 Mind Point (Max 2 purchases)</div>
                    <div className="ref-talent-item"><span className="ref-talent-name">Veteran</span><span className="ref-talent-cost">1 AP</span>Once per quest reroll one die.</div>
                    <div className="ref-talent-item"><span className="ref-talent-name">Lucky</span><span className="ref-talent-cost">2 AP</span>Once per quest redraw a treasure card.</div>
                    <div className="ref-talent-item"><span className="ref-talent-name">Battle Hardened</span><span className="ref-talent-cost">2 AP</span>Ignore 1st damage point each quest.</div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: LEVELING & XP RULES */}
              <div className="reference-column">
                
                {/* Leveling thresholds Box */}
                <div className="parchment-box reference-box h-75mm" style={{ overflow: 'hidden' }}>
                  <h3 style={{ marginBottom: '6px' }}>XP Level progression</h3>
                  <table className="ref-table" style={{ textAlign: 'center', fontSize: '12px', marginBottom: '6px', width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center', width: '50%' }}>Lvl</th>
                        <th style={{ textAlign: 'center', width: '50%' }}>XP</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td><strong>1</strong></td><td>0</td></tr>
                      <tr><td><strong>2</strong></td><td>20</td></tr>
                      <tr><td><strong>3</strong></td><td>50</td></tr>
                      <tr><td><strong>4</strong></td><td>90</td></tr>
                      <tr><td><strong>5</strong></td><td>140</td></tr>
                      <tr><td><strong>6</strong></td><td>200</td></tr>
                      <tr><td><strong>7</strong></td><td>270</td></tr>
                      <tr><td><strong>8</strong></td><td>350</td></tr>
                      <tr><td><strong>9</strong></td><td>450</td></tr>
                      <tr><td><strong>10</strong></td><td>600</td></tr>
                    </tbody>
                  </table>
                  <div style={{ fontSize: '9px', fontStyle: 'italic', color: '#5c3e21', marginTop: '6px', lineHeight: 1.3, textAlign: 'center' }}>
                    *Each level grants 1 Advancement Point (AP) to buy talents.
                  </div>
                </div>

                {/* Monster Tiers & XP Box */}
                <div className="parchment-box reference-box h-100mm" style={{ overflow: 'hidden' }}>
                  <h3 style={{ marginBottom: '6px' }}>Monster Tiers & XP values</h3>
                  <table className="ref-table" style={{ fontSize: '11.5px', marginBottom: '12px', width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center', width: '22%' }}>Tier</th>
                        <th style={{ textAlign: 'center', width: '18%' }}>XP</th>
                        <th style={{ textAlign: 'left', width: '60%' }}>Monsters Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: 'center' }}><strong>I</strong></td>
                        <td style={{ textAlign: 'center' }}>1</td>
                        <td style={{ textAlign: 'left' }}>Goblin, Skeleton, Zombie</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'center' }}><strong>II</strong></td>
                        <td style={{ textAlign: 'center' }}>2</td>
                        <td style={{ textAlign: 'left' }}>Orc, Fimir, Ghoul, Mummy</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'center' }}><strong>III</strong></td>
                        <td style={{ textAlign: 'center' }}>4</td>
                        <td style={{ textAlign: 'left' }}>Chaos Warrior, Abomination</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'center' }}><strong>IV</strong></td>
                        <td style={{ textAlign: 'center' }}>8</td>
                        <td style={{ textAlign: 'left' }}>Ogre, Gargoyle, Minotaur</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'center' }}><strong>V</strong></td>
                        <td style={{ textAlign: 'center' }}>12</td>
                        <td style={{ textAlign: 'left' }}>Giant, Dragonling, Demon</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'center' }}><strong>VI</strong></td>
                        <td style={{ textAlign: 'center' }}>20</td>
                        <td style={{ textAlign: 'left' }}>Greater Demon, Dragon</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3 style={{ marginBottom: '6px' }}>Bonus XP Milestones</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', padding: '2px 4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted rgba(92,62,33,0.15)', paddingBottom: '2px' }}>
                      <span>🎯 Bounty Target</span><strong style={{ color: '#8c1e13' }}>+5 XP</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted rgba(92,62,33,0.15)', paddingBottom: '2px' }}>
                      <span>👤 Named Enemy</span><strong style={{ color: '#8c1e13' }}>+10 XP</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted rgba(92,62,33,0.15)', paddingBottom: '2px' }}>
                      <span>🏰 Dungeon Boss</span><strong style={{ color: '#8c1e13' }}>+25 XP</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted rgba(92,62,33,0.15)', paddingBottom: '2px' }}>
                      <span>👑 Campaign Boss</span><strong style={{ color: '#8c1e13' }}>+100 XP</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="parchment-box" style={{ padding: '4px 6px', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontFamily: 'Cinzel', fontWeight: 'bold', color: '#4a2e13' }}>
                <span>🎯 Target Traps & Secret Doors first!</span>
                <span>💀 Body Point 0 = Death!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
