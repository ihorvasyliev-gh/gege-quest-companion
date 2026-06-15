import React from 'react';

export interface XPIconProps {
  name?: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export function XPIcon({ name = 'skeleton', size = 20, className = '', style = {} }: XPIconProps) {
  const iconName = name.toLowerCase().trim();

  // Common styling for icons
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    style: {
      display: 'inline-block',
      verticalAlign: 'middle',
      ...style,
    },
  };

  switch (iconName) {
    case 'goblin':
      return (
        <svg {...commonProps}>
          {/* Goblin head with long pointed ears and crown-like head spikes */}
          <path d="M12 21a7 7 0 007-7c0-2-1-3.9-3-5V7a4 4 0 00-8 0v2c-2 1.1-3 3-3 5a7 7 0 007 7z" />
          <path d="M12 2v2M8 12a1 1 0 100-2 1 1 0 000 2zM16 12a1 1 0 100-2 1 1 0 000 2z" />
          <path d="M2.5 9.5c0 0 3-1 4.5 1.5M21.5 9.5c0 0-3-1-4.5 1.5" />
          <path d="M10 16.5s1 1 2 1 2-1 2-1" />
        </svg>
      );

    case 'orc':
      return (
        <svg {...commonProps}>
          {/* Orc armored helmet with horns and tusks */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v12" />
          <path d="M7 11h10" />
          <path d="M5 4c-1-1-3-1-4 .5s1.5 4.5 3 3.5M19 4c1-1 3-1 4 .5s-1.5 4.5-3 3.5" />
          <path d="M9 16c0-1.5-1-2-1-2s1.5.5 2 2.5M15 16c0-1.5 1-2 1-2s-1.5.5-2 2.5" />
        </svg>
      );

    case 'skeleton':
      return (
        <svg {...commonProps}>
          {/* Detailed skeletal skull */}
          <path d="M12 2a7 7 0 00-7 7c0 3.5 1.5 5.5 3.5 6.5l-.5 4.5h8l-.5-4.5c2-1 3.5-3 3.5-6.5a7 7 0 00-7-7z" />
          <path d="M9.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM14.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          <path d="M12 11.5L11 13h2z" />
          <path d="M8 20.5h8M10 18.5v2M14 18.5v2" />
        </svg>
      );

    case 'gargoyle':
      return (
        <svg {...commonProps}>
          {/* Gargoyle winged figure */}
          <path d="M12 17c3.5 0 6.5-2.5 6.5-6S15.5 5 12 5s-6.5 2.5-6.5 6 3 6 6 6z" />
          <path d="M5.5 11C3 9.5 1 10 1 10s1.5 3.5 3.5 4.5M18.5 11c2.5-1.5 4.5-1 4.5-1s-1.5 3.5-3.5 4.5" />
          <path d="M9.5 8.5L10 10M14.5 8.5L14 10" />
          <path d="M10 14h4M9.5 5l-1.5-2M14.5 5l1.5-2" />
        </svg>
      );

    case 'demon':
      return (
        <svg {...commonProps}>
          {/* Horned demon skull */}
          <path d="M12 21c4.4 0 8-3.6 8-8 0-3-1.5-5.5-4-7.5l.5-2.5c-2 .8-3.8 2.3-4.5 3H12c-.7-.7-2.5-2.2-4.5-3l.5 2.5C5.5 7.5 4 10 4 13a8 8 0 008 8z" />
          <path d="M9 12a1 1 0 100-2 1 1 0 000 2zM15 12a1 1 0 100-2 1 1 0 000 2z" />
          <path d="M9.5 16.5c1.5 1 3.5 1 5 0" />
          <path d="M6 15h2M18 15h-2" />
        </svg>
      );

    case 'dragon':
      return (
        <svg {...commonProps}>
          {/* Dragon head silhouette */}
          <path d="M19.5 8.5l-2.5-3.5-3.5 1.5-3.5-1.5-2.5 3.5c-2 2.5-2 5.5 0 8l3.5 2 2.5-.5 2.5.5 3.5-2c2-2.5 2-5.5 0-8z" />
          <path d="M8.5 11a1 1 0 100-2 1 1 0 000 2zM15.5 11a1 1 0 100-2 1 1 0 000 2z" />
          <path d="M12 6.5v3M9.5 16h5" />
          <path d="M4.5 13.5h2M17.5 13.5h2" />
        </svg>
      );

    case 'scroll':
      return (
        <svg {...commonProps}>
          {/* Rolled medieval parchment bounty scroll */}
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M16 13H8M16 17H8M10 9H8" />
        </svg>
      );

    case 'shield':
      return (
        <svg {...commonProps}>
          {/* Knight shield */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 2v20M4 10h16" />
        </svg>
      );

    case 'skull':
      return (
        <svg {...commonProps}>
          {/* Gothic boss skull */}
          <path d="M12 2a7 7 0 00-7 7c0 2.5 1 4.5 2.5 5.5l-.5 4.5a1 1 0 001 1.1h10a1 1 0 001-1.1l-.5-4.5c1.5-1 2.5-3 2.5-5.5a7 7 0 00-7-7z" />
          <path d="M9 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM15 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          <path d="M12 11.5L11 13h2z" />
          <path d="M8.5 19.5h7" />
          <path d="M10.5 17.5v2M13.5 17.5v2" />
        </svg>
      );

    case 'crown':
      return (
        <svg {...commonProps}>
          {/* Royal crown with points and jewels */}
          <path d="M2 4l3 12h14l3-12-5 6-4-6-4 6-5-6z" />
          <path d="M4 20h16v-2H4v2z" />
          <path d="M12 10a1 1 0 100-2 1 1 0 000 2zM5 8a1 1 0 100-2 1 1 0 000 2zM19 8a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      );

    case 'sword':
      return (
        <svg {...commonProps}>
          {/* Crossed swords */}
          <path d="M21 3l-8.5 8.5M10.5 13.5L3 21M3 3l18 18M5 19l2-2M19 5l-2 2M15 4.5l4.5 4.5M4.5 15l4.5 4.5" />
        </svg>
      );

    case 'chest':
      return (
        <svg {...commonProps}>
          {/* Locked treasure chest */}
          <path d="M2 12v8a2 2 0 002 2h16a2 2 0 002-2v-8M2 12h20M2 12a3 3 0 013-3h14a3 3 0 013 3" />
          <path d="M11 12v3a1 1 0 002 0v-3" />
          <path d="M6 9v13M18 9v13" />
        </svg>
      );

    case 'potion':
      return (
        <svg {...commonProps}>
          {/* Alchemist potion bottle */}
          <path d="M9 3h6M12 3v5M10 8h4L19 17a3 3 0 01-3 3H8a3 3 0 01-3-3L10 8z" />
          <path d="M6.5 15h11" />
        </svg>
      );

    case 'book':
      return (
        <svg {...commonProps}>
          {/* Spellbook / Tome of rules */}
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20M4 19.5V3.5A2.5 2.5 0 016.5 1H20v16H6.5" />
          <path d="M12 7.5L10 9.5l4 2.5-4 2.5" />
        </svg>
      );

    default:
      // Fallback: A nice simple gothic skull icon
      return (
        <svg {...commonProps}>
          <path d="M12 2a7 7 0 00-7 7c0 2.5 1 4.5 2.5 5.5l-.5 4.5a1 1 0 001 1.1h10a1 1 0 001-1.1l-.5-4.5c1.5-1 2.5-3 2.5-5.5a7 7 0 00-7-7z" />
          <circle cx="9.5" cy="9.5" r="1.5" fill="currentColor" />
          <circle cx="14.5" cy="9.5" r="1.5" fill="currentColor" />
          <path d="M12 11v2" />
        </svg>
      );
  }
}
