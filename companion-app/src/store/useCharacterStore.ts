import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Talent, CharacterState } from '../types';

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

export function getTalentById(id: string): Talent | null {
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

const defaultCalculator = {
  tier1: 0,
  tier2: 0,
  tier3: 0,
  tier4: 0,
  tier5: 0,
  tier6: 0,
  bounty: 0,
  named: 0,
  dboss: 0,
  cboss: 0
};

export function computeStatBonuses(purchased: Record<string, number>, className: string) {
  let attackBonus = 0;
  let defenseBonus = 0;
  let bodyBonus = 0;
  let mindBonus = 0;

  // Toughness (shared) -> +1 Body Point per purchase (max 3)
  const toughnessCount = purchased['toughness'] || 0;
  bodyBonus += Math.min(3, toughnessCount);

  // Iron Will (shared) -> +1 Mind Point per purchase (max 2)
  const ironWillCount = purchased['iron_will'] || 0;
  mindBonus += Math.min(2, ironWillCount);

  // Mana Reservoir (wizard class) -> +1 Mind Point per purchase
  if (className === 'wizard') {
    const manaReservoirCount = purchased['mana_reservoir'] || 0;
    mindBonus += manaReservoirCount;
  }

  // Living Fortress (war_dwarf class) -> +1 Defense per purchase
  if (className === 'war_dwarf') {
    const livingFortressCount = purchased['living_fortress'] || 0;
    defenseBonus += livingFortressCount;
  }

  return { attackBonus, defenseBonus, bodyBonus, mindBonus };
}

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

  // Initialize/migrate base values if not present
  const stats = ['attack', 'defense', 'body', 'mind'];
  stats.forEach(s => {
    const baseKey = `stat-${s}-base`;
    const totalKey = `stat-${s}`;
    if (!(baseKey in updatedInputs)) {
      updatedInputs[baseKey] = updatedInputs[totalKey] || '';
    }
  });

  const { attackBonus, defenseBonus, bodyBonus, mindBonus } = computeStatBonuses(purchased, className);

  const calcTotal = (baseStr: string, bonus: number) => {
    const baseVal = parseInt(baseStr) || 0;
    return String(baseVal + bonus);
  };

  updatedInputs['stat-attack'] = calcTotal(updatedInputs['stat-attack-base'], attackBonus);
  updatedInputs['stat-defense'] = calcTotal(updatedInputs['stat-defense-base'], defenseBonus);
  updatedInputs['stat-body'] = calcTotal(updatedInputs['stat-body-base'], bodyBonus);
  updatedInputs['stat-mind'] = calcTotal(updatedInputs['stat-mind-base'], mindBonus);

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
  if (clean === 'TIER I' || clean === 'I') return 1;
  if (clean === 'TIER II' || clean === 'II') return 2;
  if (clean === 'TIER III' || clean === 'III') return 4;
  if (clean === 'TIER IV' || clean === 'IV') return 8;
  if (clean === 'TIER V' || clean === 'V') return 12;
  if (clean === 'TIER VI' || clean === 'VI') return 20;
  return 0;
}

export function getXpFromMonsterName(name: string): number {
  const match = name.match(/\(Tier (I|II|III|IV|V|VI)\)$/i);
  if (match) {
    return getXpForTier(match[1]);
  }
  return 0;
}

export const useCharacterStore = create<AppState>()(
  persist(
    (set) => ({
      charState: { ...emptyCharState },
      inputs: {},
      activeTab: 'sheet-tab',
      calculator: { ...defaultCalculator },
      tomeGoldInput: '',
      tomeMonsterInput: '',
      tomeMonsterTierInput: 'Tier I',
      toasts: [],

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

        if (id.startsWith('stat-') && id.endsWith('-base')) {
          const recomputed = recalculate(state.charState.xp, state.charState.purchasedTalents, state.charState.class, nextInputs);
          return {
            inputs: recomputed.inputs,
            charState: recomputed.charState
          };
        }
        
        if (id === 'hero-class') {
          const rawVal = value.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
          let matchedKey = '';
          for (const k in TALENTS.classes) {
            if (k === rawVal || getClassNameReadable(k).toLowerCase() === value.trim().toLowerCase()) {
              matchedKey = k;
              break;
            }
          }
          
          let nextClass = state.charState.class;
          const nextPurchased = { ...state.charState.purchasedTalents };
          
          if (matchedKey) {
            nextClass = matchedKey;
            for (const tid in nextPurchased) {
              if (!TALENTS.shared.some(x => x.id === tid)) {
                const belongsToNew = TALENTS.classes[matchedKey].some(x => x.id === tid);
                if (!belongsToNew) {
                  delete nextPurchased[tid];
                }
              }
            }
          } else if (value.trim() === '') {
            nextClass = '';
            for (const tid in nextPurchased) {
              if (!TALENTS.shared.some(x => x.id === tid)) {
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
        
        for (const tid in nextPurchased) {
          const isShared = TALENTS.shared.some(x => x.id === tid);
          if (!isShared) {
            const belongsToNew = className && TALENTS.classes[className]
              ? TALENTS.classes[className].some(x => x.id === tid)
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

      setTalentCount: (id, targetCount) => set((state) => {
        const talent = getTalentById(id);
        if (!talent) return {};
        const max = talent.max || 1;
        const clamped = Math.max(0, Math.min(targetCount, max));
        
        const currentCount = state.charState.purchasedTalents[id] || 0;
        const costDiff = (clamped - currentCount) * talent.cost;
        if (costDiff > 0 && state.charState.apAvailable < costDiff) return {};
        
        const nextPurchased = { ...state.charState.purchasedTalents, [id]: clamped };
        if (clamped === 0) delete nextPurchased[id];
        
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
        
        const currentXP = parseInt(nextInputs['char-xp']) || 0;
        const newXP = Math.max(0, currentXP + xpDiff);
        nextInputs['char-xp'] = String(newXP);
        const recomputed = recalculate(newXP, state.charState.purchasedTalents, state.charState.class, nextInputs);
        
        return {
          inputs: recomputed.inputs,
          charState: recomputed.charState
        };
      }),

      adjustCalculator: (key, delta) => set((state) => {
        const val = state.calculator[key] + delta;
        return {
          calculator: {
            ...state.calculator,
            [key]: val < 0 ? 0 : val
          }
        };
      }),

      clearCalculator: () => set({ calculator: { ...defaultCalculator } }),

      applyCalculatorXP: () => set((state) => {
        const c = state.calculator;
        const addedXP = (c.tier1 * 1) + (c.tier2 * 2) + (c.tier3 * 4) + (c.tier4 * 8) + (c.tier5 * 12) + (c.tier6 * 20) +
                        (c.bounty * 5) + (c.named * 10) + (c.dboss * 25) + (c.cboss * 100);
        
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
          calculator: { ...defaultCalculator }
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
          calculator: { ...defaultCalculator },
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
      }
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
                charState: parsed.charState || parsed.state || { ...emptyCharState }
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
            charState: value.state.charState || { ...emptyCharState }
          };
          localStorage.setItem(name, JSON.stringify(data));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        }
      },
      partialize: (state) => ({
        inputs: state.inputs,
        charState: state.charState
      })
    }
  )
);
