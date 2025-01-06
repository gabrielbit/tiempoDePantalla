import { TaskIconType } from '../constants/icons';

export interface Schedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  recommendedDuration: number;
  isActive: boolean;
  appliedToAll: boolean;
  tasks: {
    taskId: string;
    task: {
      id: string;
      name: string;
      description: string;
      icon: TaskIconType;
      isRequired: boolean;
    }
  }[];
  children: {
    childId: string;
    child: {
      id: string;
      name: string;
    }
  }[];
} 