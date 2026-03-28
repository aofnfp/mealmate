import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/constants/colors';

interface ProgressRingProps {
  size?: number;
  stroke?: number;
  progress?: number;
  trackColor?: string;
  progressColor?: string;
}

export default function ProgressRing({ 
  size = 220, 
  stroke = 14, 
  progress = 0,
  trackColor = colors.outline,
  progressColor = colors.primary
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const strokeDashoffset = circumference * (1 - clampedProgress);
  
  return (
    <Svg width={size} height={size}>
      {/* Track circle */}
      <Circle 
        cx={size / 2} 
        cy={size / 2} 
        r={radius} 
        stroke={trackColor}
        strokeWidth={stroke} 
        fill="none" 
      />
      {/* Progress circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={progressColor}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
        fill="none"
      />
    </Svg>
  );
}