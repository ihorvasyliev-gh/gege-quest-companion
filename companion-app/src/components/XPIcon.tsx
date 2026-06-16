import React from 'react';
import {
  GiGoblinHead,
  GiOrcHead,
  GiSkeleton,
  GiGargoyle,
  GiHornedSkull,
  GiDragonHead,
  GiScrollUnfurled,
  GiShield,
  GiDeathSkull,
  GiCrown,
  GiCrossedSwords,
  GiChest,
  GiHealthPotion,
  GiRuleBook,
  GiTroll,
  GiOgre,
  GiShamblingZombie,
  GiGhost,
  GiSpiderFace,
  GiSlime,
  GiWerewolf,
  GiWizardFace,
  GiCultist,
  GiRockGolem,
  GiWolfHead,
  GiCoins,
  GiKey,
  GiTreasureMap,
  GiBattleAxe,
  GiWarhammer,
  GiBowArrow
} from 'react-icons/gi';

export interface XPIconProps {
  name?: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export function XPIcon({ name = 'skeleton', size = 20, className = '', style = {} }: XPIconProps) {
  const iconName = name.toLowerCase().trim();

  // Common styling for icons
  const iconProps = {
    size,
    className,
    style: {
      display: 'inline-block',
      verticalAlign: 'middle',
      ...style,
    },
  };

  switch (iconName) {
    case 'goblin':
      return <GiGoblinHead {...iconProps} />;

    case 'orc':
      return <GiOrcHead {...iconProps} />;

    case 'skeleton':
      return <GiSkeleton {...iconProps} />;

    case 'gargoyle':
      return <GiGargoyle {...iconProps} />;

    case 'demon':
      return <GiHornedSkull {...iconProps} />;

    case 'dragon':
      return <GiDragonHead {...iconProps} />;

    case 'scroll':
      return <GiScrollUnfurled {...iconProps} />;

    case 'shield':
      return <GiShield {...iconProps} />;

    case 'skull':
      return <GiDeathSkull {...iconProps} />;

    case 'crown':
      return <GiCrown {...iconProps} />;

    case 'sword':
      return <GiCrossedSwords {...iconProps} />;

    case 'chest':
      return <GiChest {...iconProps} />;

    case 'potion':
      return <GiHealthPotion {...iconProps} />;

    case 'book':
      return <GiRuleBook {...iconProps} />;

    case 'troll':
      return <GiTroll {...iconProps} />;

    case 'ogre':
      return <GiOgre {...iconProps} />;

    case 'zombie':
      return <GiShamblingZombie {...iconProps} />;

    case 'ghost':
      return <GiGhost {...iconProps} />;

    case 'spider':
      return <GiSpiderFace {...iconProps} />;

    case 'slime':
      return <GiSlime {...iconProps} />;

    case 'werewolf':
      return <GiWerewolf {...iconProps} />;

    case 'wizard':
      return <GiWizardFace {...iconProps} />;

    case 'cultist':
      return <GiCultist {...iconProps} />;

    case 'golem':
      return <GiRockGolem {...iconProps} />;

    case 'wolf':
      return <GiWolfHead {...iconProps} />;

    case 'coins':
      return <GiCoins {...iconProps} />;

    case 'key':
      return <GiKey {...iconProps} />;

    case 'map':
      return <GiTreasureMap {...iconProps} />;

    case 'axe':
      return <GiBattleAxe {...iconProps} />;

    case 'hammer':
      return <GiWarhammer {...iconProps} />;

    case 'bow':
      return <GiBowArrow {...iconProps} />;

    default:
      // Fallback
      return <GiDeathSkull {...iconProps} />;
  }
}
