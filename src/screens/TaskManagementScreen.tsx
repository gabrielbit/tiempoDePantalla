import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TASKS } from '../data/tasks';
import { CHILDREN_PROFILES } from '../data/profiles';

export default function TaskManagementScreen() {
  const router = useRouter();

  const getScheduleTimeRanges = (scheduleIds: string[]) => {
    const timeRanges = scheduleIds.map(id => {
      const schedule = CHILDREN_PROFILES.flatMap(p => p.schedules).find(s => s.id === id);
      return schedule ? `${schedule.startTime} - ${schedule.endTime}` : null;
    }).filter(Boolean);

    return timeRanges.join(', ');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Tareas</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/task/new')}
        >
          <FontAwesome5 name="plus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.container}>
        {TASKS.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="tasks" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No hay tareas creadas</Text>
            <Text style={styles.emptySubtext}>
              Toca el botón "Agregar tarea" para comenzar
            </Text>
          </View>
        ) : (
          TASKS.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskCard}
              onPress={() => router.push(`/task/${task.id}`)}
            >
              <View style={styles.taskHeader}>
                <View style={styles.taskIcon}>
                  <FontAwesome5 name={task.icon} size={24} color="#009D96" />
                </View>
                <View style={styles.taskInfo}>
                  <View style={styles.taskNameRow}>
                    <Text style={styles.taskName}>{task.name}</Text>
                    <View style={[
                      styles.taskBadge,
                      { backgroundColor: task.isRequired ? '#FF9800' : '#4CAF50' }
                    ]}>
                      <FontAwesome5 
                        name={task.isRequired ? 'exclamation' : 'check'} 
                        size={10} 
                        color="#fff" 
                      />
                      <Text style={styles.taskBadgeText}>
                        {task.isRequired ? 'Req.' : 'Opt.'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.taskDescription}>{task.description}</Text>
                </View>
              </View>

              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleLabel}>Horarios asignados:</Text>
                <View style={styles.scheduleChips}>
                  {task.scheduleIds.map(scheduleId => {
                    const schedule = CHILDREN_PROFILES.flatMap(p => p.schedules)
                      .find(s => s.id === scheduleId);
                    if (!schedule) return null;
                    return (
                      <View key={scheduleId} style={styles.scheduleChip}>
                        <Text style={styles.scheduleChipText}>
                          {schedule.startTime} - {schedule.endTime}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  taskCard: {
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
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  taskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FF9800',
  },
  taskBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  scheduleInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  scheduleLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  scheduleChip: {
    backgroundColor: '#E8F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scheduleChipText: {
    color: '#009D96',
    fontSize: 14,
    fontWeight: '500',
  },
}); 