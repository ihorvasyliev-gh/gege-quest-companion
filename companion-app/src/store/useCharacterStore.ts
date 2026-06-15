import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Talent, CharacterState, GameConfig, XPSetting, SheetFieldConfig } from '../types';
import { supabase } from '../lib/supabaseClient';


export const XP_LEVELS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 20 },
  { level: 3, xp: 50 },
  { level: 4, xp: 90 },
  { level: 5, xp: 140 },
  { level: 6, xp: 200 },
  { level: 7, xp: 270 },
  { level: 8, xp: 350 },
  { level: 9, xp: 450 },
  { level: 10, xp: 600 }
];

export const TALENTS = {
  shared: [
    { id: 'toughness', name: 'Toughness', cost: 1, desc: '+1 Body Point (Max 3 purchases)', max: 3 },
    { id: 'iron_will', name: 'Iron Will', cost: 1, desc: '+1 Mind Point (Max 2 purchases)', max: 2 },
    { id: 'veteran', name: 'Veteran', cost: 1, desc: 'Once per quest reroll one die.', max: 1 },
    { id: 'lucky', name: 'Lucky', cost: 2, desc: 'Once per quest can redraw a treasure card.', max: 1 },
    { id: 'battle_hardened', name: 'Battle Hardened', cost: 2, desc: 'Ignore first point of damage each quest.', max: 1 }
  ],
  classes: {
    barbarian: [
      { id: 'mighty_blow', name: 'Mighty Blow', cost: 1, desc: 'Once per quest +1 attack dice.' },
      { id: 'cleave', name: 'Cleave', cost: 2, desc: 'Kill a target → immediately attack another adjacent enemy.' },
      { id: 'heroic_charge', name: 'Heroic Charge', cost: 2, desc: 'Move then attack with +1 die (free action).' },
      { id: 'juggernaut', name: 'Juggernaut', cost: 3, desc: 'Immune to forced movement (shove and control).' },
      { id: 'slayer', name: 'Slayer', cost: 3, desc: '+1 attack die against bosses.' }
    ],
    berserker: [
      { id: 'blood_rage', name: 'Blood Rage', cost: 1, desc: 'When wounded gain +1 attack die for that turn.' },
      { id: 'reckless_strike', name: 'Reckless Strike', cost: 2, desc: '-1 defense, +2 attack.' },
      { id: 'last_stand', name: 'Last Stand', cost: 2, desc: 'At 1 Body Point: +2 attack dice.' },
      { id: 'death_frenzy', name: 'Death Frenzy', cost: 3, desc: 'Kill → gain extra attack.' }
    ],
    lady_berserker: [
      { id: 'dancing_blades', name: 'Dancing Blades', cost: 1, desc: 'Reroll one attack die.' },
      { id: 'whirlwind', name: 'Whirlwind', cost: 2, desc: 'Attack all adjacent enemies.' },
      { id: 'predator', name: 'Predator', cost: 2, desc: 'Gain +1 attack against wounded enemies.' },
      { id: 'executioner', name: 'Executioner', cost: 3, desc: 'Bosses defend with one fewer die.' }
    ],
    paladin: [
      { id: 'lay_on_hands', name: 'Lay on Hands', cost: 1, desc: 'Heal 2 Body once per quest.' },
      { id: 'divine_shield', name: 'Divine Shield', cost: 2, desc: 'Ignore one attack completely once per quest.' },
      { id: 'smite_evil', name: 'Smite Evil', cost: 2, desc: '+1 attack dice versus undead and demons.' },
      { id: 'aura_of_courage', name: 'Aura of Courage', cost: 3, desc: 'Adjacent allies reroll one defense die.' },
      { id: 'resurrection_prayer', name: 'Resurrection Prayer', cost: 4, desc: 'Once per campaign revive a fallen hero in the line of sight.' }
    ],
    wizard: [
      { id: 'arcane_memory', name: 'Arcane Memory', cost: 1, desc: 'Recover one spell once per quest.' },
      { id: 'mana_reservoir', name: 'Mana Reservoir', cost: 1, desc: '+1 Mind Point.' },
      { id: 'spell_focus', name: 'Spell Focus', cost: 2, desc: 'One chosen spell gains +1 effect.' },
      { id: 'counterspell', name: 'Counterspell', cost: 3, desc: 'Cancel enemy magic for one round.' },
      { id: 'archmage', name: 'Archmage', cost: 4, desc: 'Cast one spell twice.' }
    ],
    lady_elf_archer: [
      { id: 'deadeye', name: 'Deadeye', cost: 1, desc: 'Reroll one ranged attack die.' },
      { id: 'quick_shot', name: 'Quick Shot', cost: 2, desc: 'Shoot after moving full distance for free.' },
      { id: 'hunter', name: 'Hunter', cost: 2, desc: '+1 attack die against monsters not adjacent.' },
      { id: 'eagle_eye', name: 'Eagle Eye', cost: 3, desc: 'Ignore line-of-sight penalties once per quest.' },
      { id: 'sniper', name: 'Sniper', cost: 4, desc: 'Once per quest double skulls rolled.' }
    ],
    mine_dwarf: [
      { id: 'trap_master', name: 'Trap Master', cost: 1, desc: 'Automatic trap detection nearby.' },
      { id: 'engineer', name: 'Engineer', cost: 2, desc: 'Disarm traps automatically.' },
      { id: 'tunnel_fighter', name: 'Tunnel Fighter', cost: 2, desc: '+1 defence in corridors.' },
      { id: 'stubborn', name: 'Stubborn', cost: 3, desc: 'Ignore first fatal blow each quest.' }
    ],
    war_dwarf: [
      { id: 'shield_wall', name: 'Shield Wall', cost: 1, desc: 'Adjacent allies gain +1 defense.' },
      { id: 'iron_skin', name: 'Iron Skin', cost: 2, desc: 'Once per quest reduce damage by 1.' },
      { id: 'hammer_master', name: 'Hammer Master', cost: 2, desc: 'Reroll attack with hammers.' },
      { id: 'living_fortress', name: 'Living Fortress', cost: 4, desc: '+1 permanent defence die.' }
    ],
    shamaness: [
      { id: 'spirit_heal', name: 'Spirit Heal', cost: 1, desc: 'Heal ally 2 Body points once per quest.' },
      { id: 'spirit_sight', name: 'Spirit Sight', cost: 1, desc: 'Reveal hidden enemies.' },
      { id: 'totem_ward', name: 'Totem Ward', cost: 2, desc: 'Ally gains +1 defence once per quest.' },
      { id: 'ancestor_wrath', name: 'Ancestor\'s Wrath', cost: 3, desc: 'Free Magic attack at range once per quest.' },
      { id: 'spirit_walk', name: 'Spirit Walk', cost: 4, desc: 'Move through enemies once per quest.' }
    ]
  } as Record<string, Talent[]>
};

export const DEFAULT_XP_SETTINGS: XPSetting[] = [
  { key: 'tier1', label: 'Tier I', xp: 1, icon: 'goblin' },
  { key: 'tier2', label: 'Tier II', xp: 2, icon: 'orc' },
  { key: 'tier3', label: 'Tier III', xp: 4, icon: 'skeleton' },
  { key: 'tier4', label: 'Tier IV', xp: 8, icon: 'gargoyle' },
  { key: 'tier5', label: 'Tier V', xp: 12, icon: 'demon' },
  { key: 'tier6', label: 'Tier VI', xp: 20, icon: 'dragon' },
  { key: 'bounty', label: 'Bounty', xp: 5, icon: 'scroll' },
  { key: 'named', label: 'Named', xp: 10, icon: 'shield' },
  { key: 'dboss', label: 'Dungeon Boss', xp: 25, icon: 'skull' },
  { key: 'cboss', label: 'Campaign Boss', xp: 100, icon: 'crown' }
];

export const DEFAULT_SHEET_LAYOUT: Record<string, SheetFieldConfig> = {
  'hero-name': { visible: true, label: 'Hero Name' },
  'hero-class': { visible: true, label: 'Class' },
  'stat-attack': { visible: true, label: 'Attack Dice' },
  'stat-defense': { visible: true, label: 'Defend Dice' },
  'stat-body': { visible: true, label: 'Body' },
  'stat-mind': { visible: true, label: 'Mind' },
  'health-tracker': { visible: true, label: 'Current Body Points' },
  'char-gold': { visible: true, label: 'Gold Coins' },
  'weapons-gear': { visible: true, label: 'Weapons & Gear' },
  'armor-protection': { visible: true, label: 'Armor & Protection' },
  'defeated-foes': { visible: true, label: 'Defeated Foes' },
  'spells-scrolls': { visible: true, label: 'Spellbook & Magic Scrolls' },
  'notes-rules': { visible: true, label: 'Notes & Special Rules' }
};

export const getDefaultGameConfig = (): GameConfig => {
  const classesConfig: Record<string, { name: string; talents: Talent[] }> = {};
  for (const k in TALENTS.classes) {
    classesConfig[k] = {
      name: k === 'barbarian' ? 'Barbarian' :
            k === 'berserker' ? 'Berserker' :
            k === 'lady_berserker' ? 'Lady Berserker' :
            k === 'paladin' ? 'Paladin' :
            k === 'wizard' ? 'Wizard' :
            k === 'lady_elf_archer' ? 'Lady Elf Archer' :
            k === 'mine_dwarf' ? 'Mine Dwarf' :
            k === 'war_dwarf' ? 'War Dwarf' :
            k === 'shamaness' ? 'Shamaness' : k,
      talents: TALENTS.classes[k]
    };
  }
  return {
    classes: classesConfig,
    xpSettings: DEFAULT_XP_SETTINGS,
    sheetLayout: DEFAULT_SHEET_LAYOUT,
    sharedTalents: TALENTS.shared
  };
};

export function getTalentById(id: string): Talent | null {
  // Search custom config first if initialized
  try {
    const storeConfig = useCharacterStore.getState()?.gameConfig;
    if (storeConfig) {
      if (storeConfig.sharedTalents) {
        const shared = storeConfig.sharedTalents.find(t => t.id === id);
        if (shared) return shared;
      }
      if (storeConfig.classes) {
        for (const className in storeConfig.classes) {
          const classTalent = storeConfig.classes[className]?.talents?.find(t => t.id === id);
          if (classTalent) return classTalent;
        }
      }
    }
  } catch (e) {
    // Ignore error if store is not fully initialized
  }

  // Fallback to static
  const sharedTalent = TALENTS.shared.find(t => t.id === id);
  if (sharedTalent) return sharedTalent;

  for (const className in TALENTS.classes) {
    const classTalent = TALENTS.classes[className].find(t => t.id === id);
    if (classTalent) return classTalent;
  }
  return null;
}

export function getClassNameReadable(key: string): string {
  if (!key) return '';
  try {
    const storeConfig = useCharacterStore.getState()?.gameConfig;
    if (storeConfig && storeConfig.classes && storeConfig.classes[key]) {
      return storeConfig.classes[key].name;
    }
  } catch (e) {
    // Ignore
  }
  const names: Record<string, string> = {
    barbarian: 'Barbarian',
    berserker: 'Berserker',
    lady_berserker: 'Lady Berserker',
    paladin: 'Paladin',
    wizard: 'Wizard',
    lady_elf_archer: 'Lady Elf Archer',
    mine_dwarf: 'Mine Dwarf',
    war_dwarf: 'War Dwarf',
    shamaness: 'Shamaness'
  };
  return names[key] || key;
}

const emptyCharState: CharacterState = {
  xp: 0,
  level: 1,
  apEarned: 0,
  apSpent: 0,
  apAvailable: 0,
  purchasedTalents: {},
  class: ''
};

// Recomputes Level, Next Level target, Rank, AP, and updates matching text fields in inputs map.
function recalculate(xpVal: number, purchased: Record<string, number>, className: string, inputsMap: Record<string, string>) {
  let level = 1;
  for (let i = 0; i < XP_LEVELS.length; i++) {
    if (xpVal >= XP_LEVELS[i].xp) {
      level = XP_LEVELS[i].level;
    } else {
      break;
    }
  }

  let nextTarget = '-';
  if (level < 10) {
    nextTarget = XP_LEVELS[level].xp + ' XP';
  }

  let rank = 'Novice';
  if (level >= 3 && level <= 4) rank = 'Adventurer';
  else if (level >= 5 && level <= 6) rank = 'Veteran';
  else if (level >= 7 && level <= 8) rank = 'Champion';
  else if (level >= 9) rank = 'Legend';

  const apEarned = level - 1;
  let spent = 0;
  for (const tid in purchased) {
    const count = purchased[tid];
    const talent = getTalentById(tid);
    if (talent) {
      spent += talent.cost * count;
    }
  }
  const apAvailable = apEarned - spent;

  const updatedInputs = { ...inputsMap };
  updatedInputs['char-xp'] = String(xpVal);
  updatedInputs['char-next-level'] = nextTarget;
  
  const currentRank = updatedInputs['char-rank'];
  if (!currentRank || ['Novice', 'Adventurer', 'Veteran', 'Champion', 'Legend'].includes(currentRank)) {
    updatedInputs['char-rank'] = rank;
  }

  updatedInputs['hero-class'] = getClassNameReadable(className);

  return {
    charState: {
      xp: xpVal,
      level,
      apEarned,
      apSpent: spent,
      apAvailable,
      purchasedTalents: purchased,
      class: className
    },
    inputs: updatedInputs
  };
}

export function getXpForTier(tierStr: string): number {
  const clean = tierStr.trim().toUpperCase();
  try {
    const storeConfig = useCharacterStore.getState()?.gameConfig;
    if (storeConfig && storeConfig.xpSettings) {
      const found = storeConfig.xpSettings.find(
        s => s.label.toUpperCase() === clean || s.key.toUpperCase() === clean
      );
      if (found) return found.xp;
    }
  } catch (e) {
    // Ignore
  }

  if (clean === 'TIER I' || clean === 'I') return 1;
  if (clean === 'TIER II' || clean === 'II') return 2;
  if (clean === 'TIER III' || clean === 'III') return 4;
  if (clean === 'TIER IV' || clean === 'IV') return 8;
  if (clean === 'TIER V' || clean === 'V') return 12;
  if (clean === 'TIER VI' || clean === 'VI') return 20;
  return 0;
}

export function getXpFromMonsterName(name: string): number {
  const match = name.match(/\(([^)]+)\)$/);
  if (match) {
    return getXpForTier(match[1]);
  }
  return 0;
}export const useCharacterStore = create<AppState>()(
  persist(
    (set, get) => ({
      charState: { ...emptyCharState },
      inputs: {},
      activeTab: 'sheet-tab',
      calculator: {},
      gameConfig: getDefaultGameConfig(),
      configLoading: false,
      tomeGoldInput: '',
      tomeMonsterInput: '',
      tomeMonsterTierInput: 'Tier I',
      toasts: [],

      // Supabase Auth state
      user: null,
      session: null,
      authLoading: false,
      rememberMe: localStorage.getItem('gege_remember_me') !== 'false',

      // Cloud Characters state
      cloudCharacters: [],
      currentCharId: null,
      savingState: 'idle',


      setActiveTab: (tab) => set({ activeTab: tab }),

      updateInput: (id, value) => set((state) => {
        const nextInputs = { ...state.inputs, [id]: value };
        
        if (id === 'char-xp') {
          const parsedXp = parseInt(value) || 0;
          const recomputed = recalculate(parsedXp, state.charState.purchasedTalents, state.charState.class, nextInputs);
          return {
            inputs: recomputed.inputs,
            charState: recomputed.charState
          };
        }
        
        if (id === 'hero-class') {
          const rawVal = value.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
          let matchedKey = '';
          const storeConfig = state.gameConfig;
          const classes = storeConfig?.classes || TALENTS.classes || {};
          const sharedTalents = storeConfig?.sharedTalents || TALENTS.shared || [];
          const allClassKeys = new Set([
            ...Object.keys(TALENTS.classes),
            ...Object.keys(classes)
          ]);
          
          for (const k of allClassKeys) {
            if (k === rawVal || getClassNameReadable(k).toLowerCase() === value.trim().toLowerCase()) {
              matchedKey = k;
              break;
            }
          }
          
          let nextClass = state.charState.class;
          const nextPurchased = { ...state.charState.purchasedTalents };
          
          if (matchedKey) {
            nextClass = matchedKey;
            const classTalents = storeConfig?.classes?.[matchedKey]?.talents 
              || TALENTS.classes[matchedKey] 
              || [];
              
            for (const tid in nextPurchased) {
              if (!sharedTalents.some(x => x.id === tid)) {
                const belongsToNew = classTalents.some(x => x.id === tid);
                if (!belongsToNew) {
                  delete nextPurchased[tid];
                }
              }
            }
          } else if (value.trim() === '') {
            nextClass = '';
            for (const tid in nextPurchased) {
              if (!sharedTalents.some(x => x.id === tid)) {
                delete nextPurchased[tid];
              }
            }
          }
          
          const recomputed = recalculate(state.charState.xp, nextPurchased, nextClass, nextInputs);
          return {
            inputs: recomputed.inputs,
            charState: recomputed.charState
          };
        }
        
        if (id.startsWith('foe-name-') || id.startsWith('foe-kills-')) {
          const parts = id.split('-');
          const index = parts[2];
          
          const oldName = state.inputs[`foe-name-${index}`] || '';
          const oldKills = parseInt(state.inputs[`foe-kills-${index}`]) || 0;
          const oldRowXP = getXpFromMonsterName(oldName) * oldKills;
          
          const newName = nextInputs[`foe-name-${index}`] || '';
          const newKills = parseInt(nextInputs[`foe-kills-${index}`]) || 0;
          const newRowXP = getXpFromMonsterName(newName) * newKills;
          
          const xpDiff = newRowXP - oldRowXP;
          if (xpDiff !== 0) {
            const currentXP = parseInt(state.inputs['char-xp']) || 0;
            const newXP = Math.max(0, currentXP + xpDiff);
            nextInputs['char-xp'] = String(newXP);
            
            const recomputed = recalculate(newXP, state.charState.purchasedTalents, state.charState.class, nextInputs);
            return {
              inputs: recomputed.inputs,
              charState: recomputed.charState
            };
          }
        }

        return { inputs: nextInputs };
      }),

      changeClass: (className) => set((state) => {
        const nextPurchased = { ...state.charState.purchasedTalents };
        const classTalents = state.gameConfig?.classes?.[className]?.talents 
          || TALENTS.classes[className] 
          || [];
        const sharedTalents = state.gameConfig?.sharedTalents || TALENTS.shared || [];
          
        for (const tid in nextPurchased) {
          const isShared = sharedTalents.some(x => x.id === tid);
          if (!isShared) {
            const belongsToNew = className
              ? classTalents.some(x => x.id === tid)
              : false;
            if (!belongsToNew) {
              delete nextPurchased[tid];
            }
          }
        }
        
        const nextInputs = { ...state.inputs };
        nextInputs['hero-class'] = getClassNameReadable(className);
        
        const recomputed = recalculate(state.charState.xp, nextPurchased, className, nextInputs);
        return {
          inputs: recomputed.inputs,
          charState: recomputed.charState
        };
      }),

      buyTalent: (id) => set((state) => {
        const talent = getTalentById(id);
        if (!talent) return {};
        
        const currentCount = state.charState.purchasedTalents[id] || 0;
        const max = talent.max || 1;
        
        if (currentCount >= max) return {};
        if (state.charState.apAvailable < talent.cost) return {};
        
        const nextPurchased = {
          ...state.charState.purchasedTalents,
          [id]: currentCount + 1
        };
        
        const recomputed = recalculate(state.charState.xp, nextPurchased, state.charState.class, state.inputs);
        return {
          inputs: recomputed.inputs,
          charState: recomputed.charState
        };
      }),

      refundTalent: (id) => set((state) => {
        const currentCount = state.charState.purchasedTalents[id] || 0;
        if (currentCount <= 0) return {};
        
        const nextPurchased = { ...state.charState.purchasedTalents };
        if (currentCount === 1) {
          delete nextPurchased[id];
        } else {
          nextPurchased[id] = currentCount - 1;
        }
        
        const recomputed = recalculate(state.charState.xp, nextPurchased, state.charState.class, state.inputs);
        return {
          inputs: recomputed.inputs,
          charState: recomputed.charState
        };
      }),

      setTomeGoldInput: (val) => set({ tomeGoldInput: val }),

      modifyGold: (isAdd) => set((state) => {
        const amount = parseInt(state.tomeGoldInput) || 0;
        if (amount <= 0) {
          state.showToast("Please enter a positive gold amount first.", "error");
          return {};
        }
        
        const currentGold = parseInt(state.inputs['char-gold']) || 0;
        let nextGold = isAdd ? (currentGold + amount) : (currentGold - amount);
        if (nextGold < 0) nextGold = 0;
        
        const nextInputs = {
          ...state.inputs,
          'char-gold': String(nextGold)
        };
        
        const actionText = isAdd ? `Added +${amount} Gold` : `Spent -${amount} Gold`;
        state.showToast(`${actionText} successfully!\nNew Gold Total: ${nextGold}`, "success");
        
        return {
          inputs: nextInputs,
          tomeGoldInput: ''
        };
      }),

      setTomeMonsterInput: (val) => set({ tomeMonsterInput: val }),

      setTomeMonsterTierInput: (val) => set({ tomeMonsterTierInput: val }),

      logMonsterKill: () => set((state) => {
        const name = state.tomeMonsterInput.trim();
        const tier = state.tomeMonsterTierInput;
        if (!name) {
          state.showToast("Please enter a monster name.", "error");
          return {};
        }
        
        const fullName = `${name} (${tier})`;
        const nextInputs = { ...state.inputs };
        let foundIndex = -1;
        for (let i = 1; i <= 22; i++) {
          const mName = (nextInputs['foe-name-' + i] || '').trim();
          if (mName.toLowerCase() === fullName.toLowerCase()) {
            foundIndex = i;
            break;
          }
        }
        
        const xpPerKill = getXpForTier(tier);
        
        if (foundIndex !== -1) {
          const currentKills = parseInt(nextInputs['foe-kills-' + foundIndex]) || 0;
          nextInputs['foe-kills-' + foundIndex] = String(currentKills + 1);
          state.showToast(`Logged kill for existing monster: ${fullName}.\nNew kills count: ${currentKills + 1}`, "success");
        } else {
          let emptyIndex = -1;
          for (let i = 1; i <= 22; i++) {
            const mName = (nextInputs['foe-name-' + i] || '').trim();
            if (!mName) {
              emptyIndex = i;
              break;
            }
          }
          
          if (emptyIndex !== -1) {
            nextInputs['foe-name-' + emptyIndex] = fullName;
            nextInputs['foe-kills-' + emptyIndex] = '1';
            state.showToast(`Added new monster to ledger: ${fullName} (Row ${emptyIndex}) with 1 kill.`, "success");
          } else {
            state.showToast("Cannot add monster: Your ledger on Page 2 is full (all 22 rows are occupied)!", "error");
            return {};
          }
        }
        
        const currentXP = parseInt(nextInputs['char-xp']) || 0;
        const newXP = currentXP + xpPerKill;
        nextInputs['char-xp'] = String(newXP);
        const recomputed = recalculate(newXP, state.charState.purchasedTalents, state.charState.class, nextInputs);
        
        return {
          inputs: recomputed.inputs,
          charState: recomputed.charState,
          tomeMonsterInput: ''
        };
      }),

      adjustTomeMonster: (rowIndex, delta) => set((state) => {
        const nextInputs = { ...state.inputs };
        const name = nextInputs['foe-name-' + rowIndex] || '';
        const currentKills = parseInt(nextInputs['foe-kills-' + rowIndex]) || 0;
        const nextKills = currentKills + delta;
        
        const xpPerKill = getXpFromMonsterName(name);
        const xpDiff = xpPerKill * delta;
        
        if (nextKills < 1) {
          nextInputs['foe-name-' + rowIndex] = '';
          nextInputs['foe-kills-' + rowIndex] = '';
          state.showToast(`Removed ${name} from ledger.`, "success");
        } else {
          nextInputs['foe-kills-' + rowIndex] = String(nextKills);
        }
        
        const currentXP = parseInt(state.inputs['char-xp']) || 0;
        const newXP = Math.max(0, currentXP + xpDiff);
        nextInputs['char-xp'] = String(newXP);
        const recomputed = recalculate(newXP, state.charState.purchasedTalents, state.charState.class, nextInputs);
        
        return {
          inputs: recomputed.inputs,
          charState: recomputed.charState
        };
      }),

      adjustCalculator: (key, delta) => set((state) => {
        const currentVal = state.calculator[key] || 0;
        const nextVal = currentVal + delta;
        return {
          calculator: {
            ...state.calculator,
            [key]: nextVal < 0 ? 0 : nextVal
          }
        };
      }),

      clearCalculator: () => set({ calculator: {} }),

      applyCalculatorXP: () => set((state) => {
        const c = state.calculator;
        const xpSettings = state.gameConfig.xpSettings;
        let addedXP = 0;
        
        xpSettings.forEach((setting) => {
          const count = c[setting.key] || 0;
          addedXP += count * setting.xp;
        });
        
        if (addedXP <= 0) {
          state.showToast("Please add some kills or achievements in the calculator first!", "error");
          return {};
        }
        
        const currentXP = parseInt(state.inputs['char-xp']) || 0;
        const newXP = currentXP + addedXP;
        
        const nextInputs = { ...state.inputs };
        nextInputs['char-xp'] = String(newXP);
        
        const recomputed = recalculate(newXP, state.charState.purchasedTalents, state.charState.class, nextInputs);
        
        state.showToast(`Slaying logged successfully!\n+${addedXP} XP added to your sheet.\nNew XP Total: ${newXP}`, "success");
        
        return {
          inputs: recomputed.inputs,
          charState: recomputed.charState,
          calculator: {}
        };
      }),

      showToast: (message, type = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { id, message, type }]
        }));
      },

      dismissToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      })),

      resetSheet: () => set((state) => {
        const recomputed = recalculate(0, {}, '', {});
        state.showToast("Character sheet reset completely!", "success");
        return {
          inputs: recomputed.inputs,
          charState: recomputed.charState,
          calculator: {},
          tomeGoldInput: '',
          tomeMonsterInput: '',
          tomeMonsterTierInput: 'Tier I'
        };
      }),

      importCharacter: (jsonData) => {
        try {
          const data = JSON.parse(jsonData);
          let loadedCharState = { ...emptyCharState };
          
          if (data.state) {
            loadedCharState = {
              ...emptyCharState,
              ...data.state,
              purchasedTalents: data.state.purchasedTalents || {}
            };
          }
          
          let loadedInputs: Record<string, string> = {};
          if (data.inputs) {
            loadedInputs = { ...data.inputs };
          }
          
          const recomputed = recalculate(loadedCharState.xp, loadedCharState.purchasedTalents, loadedCharState.class, loadedInputs);
          set({
            inputs: recomputed.inputs,
            charState: recomputed.charState
          });
          return true;
        } catch (e) {
          console.error("Failed to parse imported JSON:", e);
          return false;
        }
      },

      // Supabase Auth actions
      setRememberMe: (remember) => {
        localStorage.setItem('gege_remember_me', String(remember));
        set({ rememberMe: remember });
      },

      signUp: async (email, password) => {
        set({ authLoading: true });
        const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo
          }
        });
        set({ authLoading: false });
        if (!error && data?.user && data?.session) {
          set({ user: data.user, session: data.session });
        } else {
          set({ user: null, session: null });
        }
        return { error };
      },

      signIn: async (email, password) => {
        set({ authLoading: true });
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        set({ authLoading: false });
        if (!error && data?.user) {
          set({ user: data.user, session: data.session });
          await get().fetchCharacters();
          await get().fetchGameConfig();
        }
        return { error };
      },

      signOut: async () => {
        set({ authLoading: true });
        await supabase.auth.signOut();

        let loadedInputs = {};
        let loadedCharState = { ...emptyCharState };

        const localOfflineData = localStorage.getItem('gege_quest_offline_char_data');
        if (localOfflineData) {
          try {
            const parsed = JSON.parse(localOfflineData);
            loadedInputs = parsed.inputs || {};
            loadedCharState = parsed.charState || { ...emptyCharState };
          } catch (e) {
            console.error(e);
          }
        } else {
          // Fallback to recalculating an empty character
          const recomputed = recalculate(0, {}, '', {});
          loadedInputs = recomputed.inputs;
          loadedCharState = recomputed.charState;
        }

        set({
          user: null,
          session: null,
          authLoading: false,
          cloudCharacters: [],
          currentCharId: null,
          savingState: 'idle',
          inputs: loadedInputs,
          charState: loadedCharState
        });
      },

      recoverSession: async () => {
        set({ authLoading: true });
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error && session) {
          set({
            session,
            user: session.user,
            authLoading: false
          });
          await get().fetchCharacters();
          await get().fetchGameConfig();

          // Sync the active cloud character if one was selected
          const currentId = get().currentCharId;
          if (currentId) {
            await get().selectCharacter(currentId);
          }
        } else {
          set({
            session: null,
            user: null,
            authLoading: false,
            currentCharId: null,
          });
          await get().fetchGameConfig();
        }
      },

      // Cloud Character actions
      fetchCharacters: async () => {
        const user = get().user;
        if (!user) return;
        const { data, error } = await supabase
          .from('characters')
          .select('id, name, class, level, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        if (!error && data) {
          set({ cloudCharacters: data });
        }
      },

      createCharacter: async (name, className) => {
        const user = get().user;
        if (!user) return null;
        
        const initialInputs: Record<string, string> = {
          'hero-name': name,
          'hero-class': getClassNameReadable(className),
          'char-xp': '0',
          'char-next-level': '20 XP',
          'char-rank': 'Novice'
        };
        const initialCharState: CharacterState = {
          xp: 0,
          level: 1,
          apEarned: 0,
          apSpent: 0,
          apAvailable: 0,
          purchasedTalents: {},
          class: className
        };

        const { data, error } = await supabase
          .from('characters')
          .insert({
            user_id: user.id,
            name,
            class: className,
            level: 1,
            char_state: initialCharState,
            inputs: initialInputs
          })
          .select('id')
          .single();

        if (!error && data) {
          await get().fetchCharacters();
          return { id: data.id, error: null };
        }
        return { id: '', error };
      },

      selectCharacter: async (id) => {
        // If switching from offline (currentCharId === null) to a cloud character (id !== null),
        // save the current offline character's data to gege_quest_offline_char_data first
        if (get().currentCharId === null) {
          const offlineData = {
            inputs: get().inputs,
            charState: get().charState
          };
          localStorage.setItem('gege_quest_offline_char_data', JSON.stringify(offlineData));
        }

        if (!id) {
          // Switching back to offline character. Load from dedicated backup first
          const localOfflineData = localStorage.getItem('gege_quest_offline_char_data');
          if (localOfflineData) {
            try {
              const parsed = JSON.parse(localOfflineData);
              set({
                currentCharId: null,
                inputs: parsed.inputs || {},
                charState: parsed.charState || { ...emptyCharState },
                savingState: 'idle'
              });
              return;
            } catch (e) {
              console.error(e);
            }
          }

          // Fallback to gege_quest_char_data for backward compatibility if no offline data exists
          const localData = localStorage.getItem('gege_quest_char_data');
          if (localData) {
            try {
              const parsed = JSON.parse(localData);
              const loadedInputs = parsed.inputs || {};
              const loadedCharState = parsed.charState || { ...emptyCharState };
              set({
                currentCharId: null,
                inputs: loadedInputs,
                charState: loadedCharState,
                savingState: 'idle'
              });
              return;
            } catch (e) {
              console.error(e);
            }
          }
          const recomputed = recalculate(0, {}, '', {});
          set({
            currentCharId: null,
            inputs: recomputed.inputs,
            charState: recomputed.charState,
            savingState: 'idle'
          });
          return;
        }

        const { data, error } = await supabase
          .from('characters')
          .select('char_state, inputs')
          .eq('id', id)
          .single();

        if (!error && data) {
          set({
            currentCharId: id,
            inputs: data.inputs || {},
            charState: data.char_state || { ...emptyCharState },
            savingState: 'saved'
          });
        } else {
          get().showToast("Failed to load character from cloud", "error");
        }
      },

      deleteCharacter: async (id) => {
        const { error } = await supabase
          .from('characters')
          .delete()
          .eq('id', id);

        if (!error) {
          get().showToast("Character deleted successfully", "success");
          await get().fetchCharacters();
          if (get().currentCharId === id) {
            await get().selectCharacter(null);
          }
        } else {
          get().showToast("Failed to delete character", "error");
        }
      },

      saveCharacterToCloud: async (id, inputs, charState) => {
        const heroName = (inputs['hero-name'] || '').trim() || 'Unnamed Hero';
        const heroClass = charState.class || '';
        const heroLevel = charState.level || 1;

        const { error } = await supabase
          .from('characters')
          .update({
            name: heroName,
            class: heroClass,
            level: heroLevel,
            inputs,
            char_state: charState
          })
          .eq('id', id);

        if (!error) {
          set((state) => ({
            cloudCharacters: state.cloudCharacters.map((c) =>
              c.id === id ? { ...c, name: heroName, class: heroClass, level: heroLevel, updated_at: new Date().toISOString() } : c
            )
          }));
        }
        return { error };
      },

      setSavingState: (savingState) => set({ savingState }),

      fetchGameConfig: async () => {
        set({ configLoading: true });
        try {
          const { data, error } = await supabase
            .from('game_config')
            .select('*')
            .eq('id', 'default')
            .single();

          if (error && error.code === 'PGRST116') {
            // Row does not exist at all, let's insert the default one!
            const defaultConfig = getDefaultGameConfig();
            const { error: insertError } = await supabase
              .from('game_config')
              .insert({
                id: 'default',
                classes: defaultConfig.classes,
                xp_settings: defaultConfig.xpSettings,
                sheet_layout: defaultConfig.sheetLayout,
                shared_talents: defaultConfig.sharedTalents,
                updated_at: new Date().toISOString()
              });
            if (insertError) {
              console.error("Failed to seed game config table:", insertError);
            } else {
              console.log("Successfully seeded game config table with default values.");
            }
            localStorage.setItem('gege_quest_game_config', JSON.stringify(defaultConfig));
            set({ gameConfig: defaultConfig, configLoading: false });
            return;
          }
            
          if (!error && data) {
            let needsUpdate = false;
            
            // Merge missing fields with defaults
            const mergedLayout = { ...DEFAULT_SHEET_LAYOUT, ...data.sheet_layout };
            if (!data.sheet_layout || Object.keys(data.sheet_layout).length === 0) {
              needsUpdate = true;
            }

            const mergedClasses = (!data.classes || Object.keys(data.classes).length === 0)
              ? getDefaultGameConfig().classes
              : data.classes;
            if (!data.classes || Object.keys(data.classes).length === 0) {
              needsUpdate = true;
            }

            const mergedXpSettings = (!data.xp_settings || data.xp_settings.length === 0)
              ? DEFAULT_XP_SETTINGS
              : data.xp_settings;
            if (!data.xp_settings || data.xp_settings.length === 0) {
              needsUpdate = true;
            }

            const mergedSharedTalents = (!data.shared_talents || data.shared_talents.length === 0)
              ? TALENTS.shared
              : data.shared_talents;
            if (!data.shared_talents || data.shared_talents.length === 0) {
              needsUpdate = true;
            }

            const finalConfig = {
              classes: mergedClasses,
              xpSettings: mergedXpSettings,
              sheetLayout: mergedLayout,
              sharedTalents: mergedSharedTalents
            };

            if (needsUpdate) {
              const { error: updateError } = await supabase
                .from('game_config')
                .update({
                  classes: finalConfig.classes,
                  xp_settings: finalConfig.xpSettings,
                  sheet_layout: finalConfig.sheetLayout,
                  shared_talents: finalConfig.sharedTalents,
                  updated_at: new Date().toISOString()
                })
                .eq('id', 'default');
              if (updateError) {
                console.error("Failed to update missing fields in game config:", updateError);
              } else {
                console.log("Updated missing fields in game_config database entry.");
              }
            }
            
            localStorage.setItem('gege_quest_game_config', JSON.stringify(finalConfig));
            set({ gameConfig: finalConfig, configLoading: false });
          } else {
            throw new Error(error?.message || "No data");
          }
        } catch (e) {
          console.warn("Failed to fetch game config from Supabase, loading from cache...", e);
          const cached = localStorage.getItem('gege_quest_game_config');
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              const mergedLayout = { ...DEFAULT_SHEET_LAYOUT, ...parsed.sheetLayout };
              const mergedClasses = (!parsed.classes || Object.keys(parsed.classes).length === 0)
                ? getDefaultGameConfig().classes
                : parsed.classes;
              set({
                gameConfig: {
                  classes: mergedClasses,
                  xpSettings: parsed.xpSettings && parsed.xpSettings.length > 0 ? parsed.xpSettings : DEFAULT_XP_SETTINGS,
                  sheetLayout: mergedLayout,
                  sharedTalents: parsed.sharedTalents || TALENTS.shared
                },
                configLoading: false
              });
            } catch {
              set({ gameConfig: getDefaultGameConfig(), configLoading: false });
            }
          } else {
            set({ gameConfig: getDefaultGameConfig(), configLoading: false });
          }
        }
      },

      saveGameConfig: async (config) => {
        const { error } = await supabase
          .from('game_config')
          .update({
            classes: config.classes,
            xp_settings: config.xpSettings,
            sheet_layout: config.sheetLayout,
            shared_talents: config.sharedTalents,
            updated_at: new Date().toISOString()
          })
          .eq('id', 'default');
          
        if (!error) {
          localStorage.setItem('gege_quest_game_config', JSON.stringify(config));
          set({ gameConfig: config });
          get().showToast("Game configuration saved successfully to the cloud!", "success");
        } else {
          get().showToast("Failed to save configuration: " + error.message, "error");
        }
        return { error };
      },

    }),
    {
      name: 'gege_quest_char_data',
      storage: {
        getItem: (name) => {
          const raw = localStorage.getItem(name);
          if (!raw) return null;
          try {
            const parsed = JSON.parse(raw);
            return {
              state: {
                inputs: parsed.inputs || {},
                charState: parsed.charState || { ...emptyCharState },
                rememberMe: parsed.rememberMe !== false,
                currentCharId: parsed.currentCharId || null
              }
            };
          } catch {
            return null;
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setItem: (name, value: any) => {
          const data = {
            inputs: value.state.inputs || {},
            charState: value.state.charState || { ...emptyCharState },
            rememberMe: value.state.rememberMe !== false,
            currentCharId: value.state.currentCharId || null
          };
          localStorage.setItem(name, JSON.stringify(data));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        }
      },
      partialize: (state) => ({
        inputs: state.inputs,
        charState: state.charState,
        rememberMe: state.rememberMe,
        currentCharId: state.currentCharId
      })
    }
  )
);
