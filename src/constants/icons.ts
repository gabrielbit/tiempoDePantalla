import { FontAwesome5 } from '@expo/vector-icons';

export type TaskIconType = 
  | 'homework' 
  | 'room' 
  | 'gaming' 
  | 'school' 
  | 'reading' 
  | 'sports' 
  | 'music' 
  | 'art' 
  | 'bath' 
  | 'food';

export const TASK_ICONS: Record<TaskIconType, { name: string; label: string }> = {
  homework: { name: 'book', label: 'Tarea' },
  room: { name: 'bed', label: 'Cuarto' },
  gaming: { name: 'gamepad', label: 'Juegos' },
  school: { name: 'school', label: 'Escuela' },
  reading: { name: 'book-reader', label: 'Lectura' },
  sports: { name: 'running', label: 'Deportes' },
  music: { name: 'music', label: 'Música' },
  art: { name: 'paint-brush', label: 'Arte' },
  bath: { name: 'bath', label: 'Baño' },
  food: { name: 'utensils', label: 'Comida' },
};

export const VALID_ICONS = Object.keys(TASK_ICONS) as TaskIconType[]; 