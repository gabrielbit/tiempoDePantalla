import { ChildProfile } from '../types/types';
import Avatar1 from '../assets/avatars/avatar1.svg';
import Avatar2 from '../assets/avatars/avatar2.svg';

export const CHILDREN_PROFILES: ChildProfile[] = [
  {
    id: '1',
    name: 'Salvador',
    age: 8,
    avatar: Avatar1,
    screenTimeLimit: 120,
    screenTimeUsed: 45,
    schedules: [
      {
        id: '1',
        startTime: '14:00',
        endTime: '15:00',
        recommendedDuration: 60,
        isActive: true,
        appliedToAll: false,
        status: 'available',
        taskStatuses: [
          { taskId: '1', completed: false },
          { taskId: '2', completed: true }
        ]
      },
      {
        id: '3',
        startTime: '10:00',
        endTime: '11:30',
        recommendedDuration: 90,
        isActive: true,
        appliedToAll: true,
        status: 'available',
        taskStatuses: [
          { taskId: '4', completed: false }
        ]
      }
    ],
    taskCompletions: [
      {
        taskId: '1',
        scheduleId: '1',
        completedAt: new Date('2024-02-15T14:30:00'),
      },
      {
        taskId: '2',
        scheduleId: '1',
        completedAt: new Date('2024-02-20T15:00:00'),
      },
      {
        taskId: '3',
        scheduleId: '2',
        completedAt: new Date('2024-02-25T16:30:00'),
      }
    ]
  },
  {
    id: '2',
    name: 'Antonio',
    age: 10,
    avatar: Avatar2,
    screenTimeLimit: 90,
    screenTimeUsed: 30,
    schedules: [
      {
        id: '2',
        startTime: '16:00',
        endTime: '17:00',
        recommendedDuration: 60,
        isActive: true,
        appliedToAll: false,
        status: 'available',
        taskStatuses: [
          { taskId: '1', completed: true },
          { taskId: '3', completed: false }
        ]
      },
      {
        id: '3',
        startTime: '10:00',
        endTime: '11:30',
        recommendedDuration: 90,
        isActive: true,
        appliedToAll: true,
        status: 'available',
        taskStatuses: [
          { taskId: '4', completed: true }
        ]
      }
    ],
    taskCompletions: [
      {
        taskId: '1',
        scheduleId: '2',
        completedAt: new Date('2024-02-18T16:30:00'),
      },
      {
        taskId: '4',
        scheduleId: '3',
        completedAt: new Date('2024-02-22T10:30:00'),
      }
    ]
  }
]; 