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
import HiddenCubesLab from './HiddenCubesLab';
import ChickenRabbitLab from './ChickenRabbitLab';
import TriangleAreaLab from './TriangleAreaLab';
import PerimeterVsAreaLab from './PerimeterVsAreaLab';
import CubeNetsLab from './CubeNetsLab';
import SpeedMeetingLab from './SpeedMeetingLab';
import CylinderConeLab from './CylinderConeLab';
import FractionsLab from './FractionsLab';
import TreePlantingLab from './TreePlantingLab';
import SumDifferenceMultipleLab from './SumDifferenceMultipleLab';
import SurplusDeficiencyLab from './SurplusDeficiencyLab';
import WorkRateLab from './WorkRateLab';
import NewtonCowPastureLab from './NewtonCowPastureLab';
import AlgebraicEquationsLab from './AlgebraicEquationsLab';
import RiverBoatMotionLab from './RiverBoatMotionLab';
import TrainBridgeCrossingLab from './TrainBridgeCrossingLab';
import AverageBenchmarkLab from './AverageBenchmarkLab';
import InclusionExclusionLab from './InclusionExclusionLab';
import AgeDifferenceLab from './AgeDifferenceLab';

interface AnimationPlayerProps {
  type: 'circle-area' | 'pythagorean-theorem' | 'buoyancy-archimedes' | 'clock-reading' | 'ten-frame' | 'transfer-and-balance' | 'line-up-ordering' | 'front-back-left-right' | 'compass-directions' | 'multiplication-array' | 'hidden-cubes-counting' | 'chicken-rabbit-cage' | 'triangle-area-parallelogram' | 'perimeter-vs-area' | 'cube-nets-folding' | 'speed-meeting-chasing' | 'cylinder-cone-volume' | 'fractions-basics' | 'tree-planting-intervals' | 'sum-difference-multiple' | 'surplus-and-deficiency' | 'work-rate-problem' | 'newton-cow-pasture' | 'algebraic-equations-basics' | 'river-boat-motion' | 'train-bridge-crossing' | 'average-benchmark' | 'inclusion-exclusion-venn' | 'age-difference' | 'age-difference-problem' | string;
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
    case 'hidden-cubes-counting':
      return <HiddenCubesLab />;
    case 'chicken-rabbit-cage':
      return <ChickenRabbitLab />;
    case 'triangle-area-parallelogram':
      return <TriangleAreaLab />;
    case 'perimeter-vs-area':
      return <PerimeterVsAreaLab />;
    case 'cube-nets-folding':
      return <CubeNetsLab />;
    case 'speed-meeting-chasing':
      return <SpeedMeetingLab />;
    case 'cylinder-cone-volume':
      return <CylinderConeLab />;
    case 'fractions-basics':
      return <FractionsLab />;
    case 'tree-planting-intervals':
      return <TreePlantingLab />;
    case 'sum-difference-multiple':
      return <SumDifferenceMultipleLab />;
    case 'surplus-and-deficiency':
      return <SurplusDeficiencyLab />;
    case 'work-rate-problem':
      return <WorkRateLab />;
    case 'newton-cow-pasture':
      return <NewtonCowPastureLab />;
    case 'algebraic-equations-basics':
      return <AlgebraicEquationsLab />;
    case 'river-boat-motion':
      return <RiverBoatMotionLab />;
    case 'train-bridge-crossing':
      return <TrainBridgeCrossingLab />;
    case 'average-benchmark':
      return <AverageBenchmarkLab />;
    case 'inclusion-exclusion-venn':
      return <InclusionExclusionLab />;
    case 'age-difference':
    case 'age-difference-problem':
      return <AgeDifferenceLab />;







    default:
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ color: '#64748b' }}>该知识点动画正在紧锣密鼓制作中...</p>
        </div>
      );
  }
}
