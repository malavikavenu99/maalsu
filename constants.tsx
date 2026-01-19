
import React from 'react';

export const IEEE_COLORS = {
  primary: '#00629B',
  secondary: '#004165',
  accent: '#00B5E2',
  background: '#F8FAFC',
};

export const ADMIN_PASSWORD = 'IEEEAdmin2025'; // Mock for demo purposes

export const IEEELogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 24" className={className} fill="currentColor">
    <path d="M0 0h3.5v24H0V0zm6.5 0h14v3.5H10v6.5h8v3.5h-8v7h10.5V24h-14V0zm18 0h14v3.5h-10.5v6.5h8v3.5h-8v7h10.5V24h-14V0zm18 0h14v3.5h-10.5v6.5h8v3.5h-8v7h10.5V24h-14V0z" />
    <text x="75" y="18" fontStyle="italic" fontWeight="bold" fontSize="16">IEEE</text>
  </svg>
);
