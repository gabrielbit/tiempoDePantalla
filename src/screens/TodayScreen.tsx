import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { CHILDREN_PROFILES } from '../data/profiles';
import { TASKS } from '../data/tasks';
import TaskCounter from '../components/TaskCounter';
import { DailySchedule, ScheduleWithProfiles } from '../types/types';

export default function TodayScreen() {
  const [todaySchedules, setTodaySchedules] = React.useState<ScheduleWithProfiles[]>([]);
  const [expandedScheduleId, setExpandedScheduleId] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Actualizar la hora actual cada minuto
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Obtener los horarios del día actual
  React.useEffect(() => {
    const schedules = CHILDREN_PROFILES.reduce<ScheduleWithProfiles[]>((acc, profile) => {
      profile.schedules.forEach(schedule => {
        const existingSchedule = acc.find(s => s.id === schedule.id);
        if (!existingSchedule) {
          acc.push({
            ...schedule,
            profiles: [{
              id: profile.id,
              name: profile.name,
              avatar: profile.avatar
            }]
          });
        } else {
          existingSchedule.profiles.push({
            id: profile.id,
            name: profile.name,
            avatar: profile.avatar
          });
        }
      });
      return acc;
    }, []).filter(schedule => {
      return schedule.isActive && schedule.status === 'available';
    }).sort((a, b) => {
      const [aHours, aMinutes] = a.startTime.split(':').map(Number);
      const [bHours, bMinutes] = b.startTime.split(':').map(Number);
      return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
    });

    setTodaySchedules(schedules);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canStartSchedule = (schedule: ScheduleWithProfiles) => {
    // Obtener todas las tareas requeridas para este horario
    const requiredTasks = TASKS.filter(task => 
      task.isRequired && task.scheduleIds.includes(schedule.id)
    );

    // Si no hay tareas requeridas, se puede iniciar
    if (requiredTasks.length === 0) return true;

    // Verificar que todas las tareas requeridas estén completadas
    return requiredTasks.every(task => 
      schedule.taskStatuses.find(status => 
        status.taskId === task.id && status.completed
      )
    );
  };

  const handleTaskToggle = (scheduleId: string, taskId: string, completed: boolean) => {
    setTodaySchedules(currentSchedules => 
      currentSchedules.map(schedule => {
        if (schedule.id === scheduleId) {
          const existingStatus = schedule.taskStatuses?.find(s => s.taskId === taskId);
          const updatedStatuses = existingStatus
            ? schedule.taskStatuses.map(s => 
                s.taskId === taskId 
                  ? { ...s, completed, completedAt: completed ? new Date() : undefined }
                  : s
              )
            : [...(schedule.taskStatuses || []), { 
                taskId, 
                completed, 
                completedAt: completed ? new Date() : undefined 
              }];
          
          return {
            ...schedule,
            taskStatuses: updatedStatuses
          };
        }
        return schedule;
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
        <Text style={styles.date}>{formatDate(currentTime)}</Text>
      </View>

      <ScrollView style={styles.container}>
        {todaySchedules.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="calendar-day" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No hay horarios programados para hoy</Text>
          </View>
        ) : (
          todaySchedules.map(schedule => (
            <View key={schedule.id} style={styles.scheduleCard}>
              <View style={styles.scheduleHeader}>
                <View>
                  <Text style={styles.timeText}>{schedule.startTime} - {schedule.endTime}</Text>
                  <View style={styles.profilesContainer}>
                    {schedule.profiles.map(profile => (
                      <Text key={profile.id} style={styles.profileName}>{profile.name}</Text>
                    ))}
                  </View>
                </View>
                <TouchableOpacity 
                  style={[
                    styles.startButton,
                    !canStartSchedule(schedule) && styles.startButtonDisabled
                  ]}
                  disabled={!canStartSchedule(schedule)}
                  onPress={() => {/* Iniciar temporizador */}}
                >
                  <FontAwesome5 
                    name="play" 
                    size={16} 
                    color={canStartSchedule(schedule) ? '#fff' : '#999'} 
                  />
                </TouchableOpacity>
              </View>

              <TaskCounter
                scheduleId={schedule.id}
                taskStatuses={schedule.taskStatuses || []}
                onTaskToggle={(taskId, completed) => handleTaskToggle(schedule.id, taskId, completed)}
                expanded={expandedScheduleId === schedule.id}
                onToggleExpand={() => setExpandedScheduleId(
                  expandedScheduleId === schedule.id ? null : schedule.id
                )}
              />
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#009D96',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  profilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  profileName: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  startButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#009D96',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#eee',
  },
}); 