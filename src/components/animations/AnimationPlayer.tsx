'use client';

import React from 'react';
import CircleAreaLab from './CircleAreaLab';
import PythagoreanTheoremLab from './PythagoreanTheoremLab';
import BuoyancyArchimedesLab from './BuoyancyArchimedesLab';
import ClockReadingLab from './ClockReadingLab';
import TenFrameLab from './TenFrameLab';
import TransferBalanceLab from './TransferBalanceLab';
import LineUpOrderingLab from './LineUpOrderingLab';
import FrontBackLeftRightLab from './FrontBackLeftRightLab';
import CompassDirectionsLab from './CompassDirectionsLab';
import MultiplicationArrayLab from './MultiplicationArrayLab';

interface AnimationPlayerProps {
  type: 'circle-area' | 'pythagorean-theorem' | 'buoyancy-archimedes' | 'clock-reading' | 'ten-frame' | 'transfer-and-balance' | 'line-up-ordering' | 'front-back-left-right' | 'compass-directions' | 'multiplication-array' | string;
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
    case 'line-up-ordering':
      return <LineUpOrderingLab />;
    case 'front-back-left-right':
      return <FrontBackLeftRightLab />;
    case 'compass-directions':
      return <CompassDirectionsLab />;
    case 'multiplication-array':
      return <MultiplicationArrayLab />;





    default:
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ color: '#64748b' }}>该知识点动画正在紧锣密鼓制作中...</p>
        </div>
      );
  }
}
