'use client';

import React from 'react';
import CircleAreaLab from './CircleAreaLab';
import PythagoreanTheoremLab from './PythagoreanTheoremLab';
import BuoyancyArchimedesLab from './BuoyancyArchimedesLab';

interface AnimationPlayerProps {
  type: 'circle-area' | 'pythagorean-theorem' | 'buoyancy-archimedes';
}

export default function AnimationPlayer({ type }: AnimationPlayerProps) {
  switch (type) {
    case 'circle-area':
      return <CircleAreaLab />;
    case 'pythagorean-theorem':
      return <PythagoreanTheoremLab />;
    case 'buoyancy-archimedes':
      return <BuoyancyArchimedesLab />;
    default:
      return <div>该动画正在制作中</div>;
  }
}
