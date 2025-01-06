import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { TaskIconType, TASK_ICONS } from '../constants/icons';

interface TaskIconProps {
  iconType: TaskIconType;
  size?: number;
  color?: string;
}

export function TaskIcon({ iconType, size = 24, color = '#009D96' }: TaskIconProps) {
  return (
    <FontAwesome5 
      name={TASK_ICONS[iconType].name} 
      size={size} 
      color={color} 
    />
  );
} 