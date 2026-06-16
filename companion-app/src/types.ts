import type { User, Session } from '@supabase/supabase-js';

export interface Talent {
  id: string;
  name: string;
  cost: number;
  desc: string;
  max?: number;
}

export interface XPSetting {
  key: string;
  label: string;
  xp: number;
  icon?: string;
}

export interface SheetFieldConfig {
  visible: boolean;
  label: string;
}

export interface GameConfig {
  classes: Record<string, {
    name: string;
    talents: Talent[];
  }>;
  xpSettings: XPSetting[];
  sheetLayout: Record<string, SheetFieldConfig>;
  sharedTalents?: Talent[];
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
  activeTab: 'sheet-tab' | 'rulebook-tab' | 'dm-tab';
  
  // Temporary state for the interactive XP calculator
  calculator: Record<string, number>;
  
  // Game Config (Classes, XP rules, layout settings)
  gameConfig: GameConfig;
  configLoading: boolean;

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

  // DM Party Tracker state
  activePartyIds: string[];

  // Theme state
  
  // Navigation actions
  setActiveTab: (tab: 'sheet-tab' | 'rulebook-tab' | 'dm-tab') => void;
  
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
  adjustCalculator: (key: string, delta: number) => void;
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

  // DM / Game Config actions
  fetchGameConfig: () => Promise<void>;
  saveGameConfig: (config: GameConfig) => Promise<{ error: { message: string } | null }>;
  togglePartyMember: (id: string) => void;
  fetchAllPlayersCharacters: () => Promise<any[]>;
}

