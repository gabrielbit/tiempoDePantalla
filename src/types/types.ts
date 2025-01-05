export interface TaskStatus {
  taskId: string;
  completed: boolean;
  completedAt?: Date;
}

export interface ScreenTimeSchedule {
  id: string;
  startTime: string; // formato "HH:mm"
  endTime: string;
  recommendedDuration: number; // en minutos
  isActive: boolean;
  appliedToAll: boolean;
  childrenIds?: string[];
  status: 'available' | 'in_progress' | 'completed' | 'cancelled';
  taskStatuses: TaskStatus[];
}

export interface TaskCompletion {
  taskId: string;
  scheduleId: string;
  completedAt: Date;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar?: string; // URL de la imagen
  screenTimeLimit: number;
  screenTimeUsed: number;
  activeSession?: {
    startTime: Date;
    scheduleId: string;
  };
  schedules: ScreenTimeSchedule[];
  taskCompletions: TaskCompletion[];
}

export interface DailySchedule {
  date: string; // formato "YYYY-MM-DD"
  schedules: ScreenTimeSchedule[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof FontAwesome5.glyphMap;
  isRequired: boolean;
  scheduleIds: string[]; // IDs de los horarios asociados
}

interface ScheduleWithProfiles extends ScreenTimeSchedule {
  profiles: {
    id: string;
    name: string;
    avatar?: React.FC<SvgProps>;
  }[];
} 