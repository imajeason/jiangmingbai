'use client';

import React from 'react';
import CircleAreaLab from './CircleAreaLab';
import PythagoreanTheoremLab from './PythagoreanTheoremLab';
import BuoyancyArchimedesLab from './BuoyancyArchimedesLab';
import ClockReadingLab from './ClockReadingLab';
import TenFrameLab from './TenFrameLab';
import TransferBalanceLab from './TransferBalanceLab';

interface AnimationPlayerProps {
  type: 'circle-area' | 'pythagorean-theorem' | 'buoyancy-archimedes' | 'clock-reading' | 'ten-frame' | 'transfer-and-balance' | string;
}

export default function AnimationPlayer({ type }: AnimationPlayerProps) {
  switch (type) {
    case 'circle-area':
      return <CircleAreaLab />;
    case 'pythagorean-theorem':
      return <PythagoreanTheoremLab />;
    case 'buoyancy-archimedes':
      return <BuoyancyArchimedesLab />;
    case 'clock-reading':
      return <ClockReadingLab />;
    case 'ten-frame':
      return <TenFrameLab />;
    case 'transfer-and-balance':
      return <TransferBalanceLab />;

    default:
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ color: '#64748b' }}>该知识点动画正在紧锣密鼓制作中...</p>
        </div>
      );
  }
}
