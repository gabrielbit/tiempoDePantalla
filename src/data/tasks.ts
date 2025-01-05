import { Task } from '../types/types';

export const TASKS: Task[] = [
  {
    id: '1',
    name: 'Tarea escolar',
    description: 'Completar las tareas del colegio',
    icon: 'book',
    isRequired: true,
    scheduleIds: ['1', '2']
  },
  {
    id: '2',
    name: 'Ordenar cuarto',
    description: 'Mantener el cuarto ordenado',
    icon: 'broom',
    isRequired: false,
    scheduleIds: ['1']
  },
  {
    id: '3',
    name: 'Lectura',
    description: 'Leer un libro',
    icon: 'book-reader',
    isRequired: true,
    scheduleIds: ['2']
  },
  {
    id: '4',
    name: 'Ejercicio',
    description: 'Hacer ejercicio físico',
    icon: 'running',
    isRequired: false,
    scheduleIds: ['3']
  }
]; 