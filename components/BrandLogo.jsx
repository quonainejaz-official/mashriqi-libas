'use client';

import { useId } from 'react';

const BrandLogo = ({ className = 'w-[190px] md:w-[230px] h-auto', ariaLabel = 'Mashriqi Libas logo' }) => {
  const rawId = useId();
  const safeId = rawId.replace(/:/g, '');
  const goldShimmerId = `goldShimmer-${safeId}`;
  const glowId = `glow-${safeId}`;

  return (
    <svg viewBox="0 0 720 170" className={className} role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <defs>
        <linearGradient id={goldShimmerId} x1="-100%" y1="0%" x2="200%" y2="0%">
          <stop offset="0%" stopColor="var(--color-logo-gold)" stopOpacity="0.7" />
          <stop offset="35%" stopColor="var(--color-logo-highlight)" stopOpacity="1" />
          <stop offset="50%" stopColor="var(--color-text-inverse)" stopOpacity="1" />
          <stop offset="65%" stopColor="var(--color-logo-highlight)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--color-logo-gold)" stopOpacity="0.7" />
          <animate attributeName="x1" values="-100%;100%;100%" keyTimes="0;0.4;1" dur="10s" repeatCount="indefinite" />
          <animate attributeName="x2" values="0%;200%;200%" keyTimes="0;0.4;1" dur="10s" repeatCount="indefinite" />
        </linearGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <style>{`
        .pattern polygon {
          stroke: var(--color-logo-gold);
          stroke-width: 4.8;
          fill: none;
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: drawPattern 14s ease infinite;
        }
        @keyframes drawPattern {
          0% {
            stroke-dashoffset: 300;
          }
          57.14% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .fabric path {
          stroke: var(--color-logo-gold);
          stroke-width: 4.2;
          fill: none;
          stroke-linecap: round;
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: drawFabric 14s ease infinite;
          animation-delay: 1.6s;
        }
        @keyframes drawFabric {
          0% {
            stroke-dashoffset: 200;
          }
          57.14% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .glow {
          filter: drop-shadow(0 0 8px var(--color-logo-glow));
          animation: glowPulse 10s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0% {
            filter: drop-shadow(0 0 4px var(--color-logo-glow-soft));
          }
          20% {
            filter: drop-shadow(0 0 14px var(--color-logo-glow-strong));
          }
          40% {
            filter: drop-shadow(0 0 4px var(--color-logo-glow-soft));
          }
          100% {
            filter: drop-shadow(0 0 4px var(--color-logo-glow-soft));
          }
        }
      `}</style>
      <g className="pattern glow" transform="translate(70,80) scale(0.92)">
        <polygon points="0,-60 22,-22 60,0 22,22 0,60 -22,22 -60,0 -22,-22" />
        <polygon points="0,-40 15,-15 40,0 15,15 0,40 -15,15 -40,0 -15,-15" />
      </g>
      <g className="fabric glow" transform="translate(70,114)">
        <path d="M-45 0 Q0 -35 45 0" />
        <path d="M-32 12 Q0 -18 32 12" />
        <path d="M-20 24 Q0 5 20 24" />
      </g>
      <text
        x="140"
        y="120"
        textAnchor="start"
        fontFamily='"Lucy Said Ok Personal Use Italic", "Cormorant Garamond", "Cinzel", Georgia, serif'
        fontSize="140"
        fontWeight="500"
        fill={`url(#${goldShimmerId})`}
        filter={`url(#${glowId})`}
        letterSpacing="3"
      >
        Mashriqi Libas
      </text>
    </svg>
  );
};

export default BrandLogo;
