import { useState } from 'react';
import { useCharacterStore, TALENTS, getClassNameReadable } from '../store/useCharacterStore';

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountDrawer({ isOpen, onClose }: AccountDrawerProps) {
  const user = useCharacterStore((state) => state.user);
  const authLoading = useCharacterStore((state) => state.authLoading);
  const rememberMe = useCharacterStore((state) => state.rememberMe);
  const setRememberMe = useCharacterStore((state) => state.setRememberMe);
  const signUp = useCharacterStore((state) => state.signUp);
  const signIn = useCharacterStore((state) => state.signIn);
  const signOut = useCharacterStore((state) => state.signOut);
  const cloudCharacters = useCharacterStore((state) => state.cloudCharacters);
  const currentCharId = useCharacterStore((state) => state.currentCharId);
  const selectCharacter = useCharacterStore((state) => state.selectCharacter);
  const createCharacter = useCharacterStore((state) => state.createCharacter);
  const deleteCharacter = useCharacterStore((state) => state.deleteCharacter);
  const showToast = useCharacterStore((state) => state.showToast);

  // Forms local state
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newCharName, setNewCharName] = useState('');
  const [newCharClass, setNewCharClass] = useState('barbarian');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (isRegisterMode) {
      const { error } = await signUp(email, password);
      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Registration successful! Please sign in.', 'success');
        setIsRegisterMode(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Welcome back, adventurer!', 'success');
        onClose();
      }
    }
  };

  const handleCreateChar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharName.trim()) {
      showToast('Character name is required', 'error');
      return;
    }

    const res = await createCharacter(newCharName.trim(), newCharClass);
    if (res && !res.error) {
      showToast(`Character ${newCharName} created successfully!`, 'success');
      setNewCharName('');
      setShowCreateForm(false);
      await selectCharacter(res.id);
      onClose();
    } else if (res?.error) {
      showToast(res.error.message, 'error');
    }
  };

  const handleDeleteChar = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This character will be lost forever.`)) {
      await deleteCharacter(id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>🛡️ Tavern Hall</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="drawer-content">
          {!user ? (
            /* AUTH FORM */
            <div className="auth-container">
              <div className="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${!isRegisterMode ? 'active' : ''}`}
                  onClick={() => setIsRegisterMode(false)}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab ${isRegisterMode ? 'active' : ''}`}
                  onClick={() => setIsRegisterMode(true)}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleAuth} className="auth-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="adventurer@tavern.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-checkbox">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                </div>

                <button type="submit" className="submit-btn" disabled={authLoading}>
                  {authLoading ? '⚔️ Casting Spell...' : isRegisterMode ? 'Register Account' : 'Enter Tavern'}
                </button>
              </form>
            </div>
          ) : (
            /* LOGGED IN USER INTERFACE */
            <div className="account-info">
              <div className="user-profile">
                <span className="user-email">📧 {user.email}</span>
                <button className="signout-btn" onClick={signOut}>Sign Out</button>
              </div>

              <div className="character-section">
                <div className="character-header">
                  <h3>Your Characters</h3>
                  <button
                    type="button"
                    className="create-toggle-btn"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                  >
                    {showCreateForm ? 'Cancel' : '＋ New Hero'}
                  </button>
                </div>

                {showCreateForm && (
                  <form onSubmit={handleCreateChar} className="create-char-form">
                    <div className="form-group">
                      <label>Character Name</label>
                      <input
                        type="text"
                        placeholder="Conan the Bold"
                        value={newCharName}
                        onChange={(e) => setNewCharName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Starting Class</label>
                      <select
                        value={newCharClass}
                        onChange={(e) => setNewCharClass(e.target.value)}
                      >
                        {Object.keys(TALENTS.classes).map((cKey) => (
                          <option key={cKey} value={cKey}>
                            {getClassNameReadable(cKey)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button type="submit" className="submit-btn">
                      Summon Character
                    </button>
                  </form>
                )}

                <div className="characters-list">
                  {/* Local Character item */}
                  <div
                    className={`character-item ${currentCharId === null ? 'selected' : ''}`}
                    onClick={() => {
                      selectCharacter(null);
                      onClose();
                    }}
                  >
                    <div className="char-details">
                      <span className="char-name">📴 Offline Local Character</span>
                      <span className="char-meta">Stored on this browser only</span>
                    </div>
                  </div>

                  {cloudCharacters.map((char) => (
                    <div
                      key={char.id}
                      className={`character-item ${currentCharId === char.id ? 'selected' : ''}`}
                      onClick={() => {
                        selectCharacter(char.id);
                        onClose();
                      }}
                    >
                      <div className="char-details">
                        <span className="char-name">✨ {char.name}</span>
                        <span className="char-meta">
                          Level {char.level} {getClassNameReadable(char.class) || 'No Class'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="delete-char-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChar(char.id, char.name);
                        }}
                        title="Delete Hero"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}

                  {cloudCharacters.length === 0 && !showCreateForm && (
                    <div className="empty-chars">
                      No cloud characters found. Create a new hero above to begin your journey in the clouds!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
