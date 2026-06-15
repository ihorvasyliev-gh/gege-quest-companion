import type { User, Session } from '@supabase/supabase-js';

export interface Talent {
  id: string;
  name: string;
  cost: number;
  desc: string;
  max?: number;
}

export interface CharacterState {
  xp: number;
  level: number;
  apEarned: number;
  apSpent: number;
  apAvailable: number;
  purchasedTalents: Record<string, number>; // { [talentId]: count }
  class: string;
}

export interface CloudCharacterSummary {
  id: string;
  name: string;
  class: string;
  level: number;
  updated_at: string;
}

export interface AppState {
  // Character core state
  charState: CharacterState;
  
  // Map of all free text inputs (bound to DOM input fields)
  inputs: Record<string, string>;
  
  // Currently active tab
  activeTab: 'sheet-tab' | 'rulebook-tab';
  
  // Temporary state for the interactive XP calculator
  calculator: {
    tier1: number;
    tier2: number;
    tier3: number;
    tier4: number;
    tier5: number;
    tier6: number;
    bounty: number;
    named: number;
    dboss: number;
    cboss: number;
  };
  
  // Tome inputs
  tomeGoldInput: string;
  tomeMonsterInput: string;
  tomeMonsterTierInput: string;
  
  // Toast notifications list
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error';
  }>;

  // Supabase Auth state
  user: User | null;
  session: Session | null;
  authLoading: boolean;
  rememberMe: boolean;

  // Cloud Characters state
  cloudCharacters: CloudCharacterSummary[];
  currentCharId: string | null; // null means editing local offline character
  savingState: 'idle' | 'saving' | 'saved' | 'error';

  // Theme state
  theme: 'light' | 'dark';
  
  // Navigation actions
  setActiveTab: (tab: 'sheet-tab' | 'rulebook-tab') => void;
  
  // Input changes
  updateInput: (id: string, value: string) => void;
  
  // Character sheet updates
  changeClass: (className: string) => void;
  buyTalent: (id: string) => void;
  refundTalent: (id: string) => void;
  
  // Gold management actions
  setTomeGoldInput: (val: string) => void;
  modifyGold: (isAdd: boolean) => void;
  
  // Monster logger actions
  setTomeMonsterInput: (val: string) => void;
  setTomeMonsterTierInput: (val: string) => void;
  logMonsterKill: () => void;
  adjustTomeMonster: (rowIndex: number, delta: number) => void;
  
  // Calculator actions
  adjustCalculator: (key: keyof AppState['calculator'], delta: number) => void;
  clearCalculator: () => void;
  applyCalculatorXP: () => void;
  
  // Toast notifications actions
  showToast: (message: string, type?: 'success' | 'error') => void;
  dismissToast: (id: string) => void;
  
  // Sheet global actions
  resetSheet: () => void;
  importCharacter: (jsonData: string) => boolean;

  // Supabase Auth actions
  setRememberMe: (remember: boolean) => void;
  signUp: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  signIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<void>;
  recoverSession: () => Promise<void>;

  // Cloud character actions
  fetchCharacters: () => Promise<void>;
  createCharacter: (name: string, className: string) => Promise<{ id: string; error: { message: string } | null } | null>;
  selectCharacter: (id: string | null) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  saveCharacterToCloud: (id: string, inputs: Record<string, string>, charState: CharacterState) => Promise<{ error: { message: string } | null }>;
  setSavingState: (state: 'idle' | 'saving' | 'saved' | 'error') => void;

  // Theme actions
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

