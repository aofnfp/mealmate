import React from "react";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/constants/colors";

interface ProgressRingProps {
  size?: number;
  stroke?: number;
  progress?: number;
}

export default function ProgressRing({ size = 220, stroke = 14, progress = 0 }: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(progress, 1));
  const dash = c * clamped;
  
  return (
    <Svg width={size} height={size}>
      <Circle 
        cx={size/2} 
        cy={size/2} 
        r={r} 
        stroke="#E7EBEF" 
        strokeWidth={stroke} 
        fill="none" 
      />
      <Circle
        cx={size/2}
        cy={size/2}
        r={r}
        stroke={colors.primary}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash}, ${c}`}
        rotation="-90"
        origin={`${size/2}, ${size/2}`}
        fill="none"
      />
    </Svg>
  );
}