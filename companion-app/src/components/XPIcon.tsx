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
  GiRuleBook
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

    default:
      // Fallback
      return <GiDeathSkull {...iconProps} />;
  }
}
