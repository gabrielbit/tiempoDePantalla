import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { schedulesService } from '../services/api.service';
import { Schedule } from '../types';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TaskIcon } from '../components/TaskIcon';
import { TaskIconType } from '../constants/icons';

export default function SchedulesScreen() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log('SchedulesScreen mounted, loading schedules...');
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      console.log('Starting to load schedules...');
      setLoading(true);
      const response = await schedulesService.getAll();
      console.log('Response in component:', response);
      console.log('Schedules to display:', response.data);
      setSchedules(response.data);
    } catch (err) {
      console.error('Error loading schedules:', err);
      setError('Error al cargar los horarios');
    } finally {
      setLoading(false);
    }
  };

  const renderSchedule = ({ item }: { item: Schedule }) => (
    <TouchableOpacity style={styles.scheduleCard}>
      <Text style={styles.scheduleName}>{item.name}</Text>
      <View style={styles.scheduleDetails}>
        <Text style={styles.scheduleText}>Horario: {item.startTime} - {item.endTime}</Text>
        <Text style={styles.scheduleText}>Duración: {item.recommendedDuration} minutos</Text>
        <Text style={[
          styles.scheduleText, 
          { color: item.isActive ? '#4CAF50' : '#999' }
        ]}>
          Estado: {item.isActive ? '● Activo' : '○ Inactivo'}
        </Text>
      </View>
      <View style={styles.tasksList}>
        <Text style={styles.tasksTitle}>Tareas:</Text>
        {item.tasks?.map(taskRelation => (
          <View key={taskRelation.taskId} style={styles.taskRow}>
            <TaskIcon 
              iconType={taskRelation.task.icon as TaskIconType} 
              size={18} 
              color="#444"
            />
            <Text style={styles.taskItem}> {taskRelation.task.name}</Text>
          </View>
        ))}
      </View>
      <View style={styles.childrenList}>
        <Text style={styles.childrenTitle}>Asignado a:</Text>
        {item.children?.map(childRelation => (
          <Text key={childRelation.childId} style={styles.childItem}>
            👤 {childRelation.child.name}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  const onRefresh = React.useCallback(() => {
    loadSchedules();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando horarios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSchedules}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={schedules}
        renderItem={renderSchedule}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={onRefresh}
      />
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/create-schedule')}
      >
        <FontAwesome5 name="plus" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 8,
  },
  scheduleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  scheduleName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#009D96',
  },
  scheduleDetails: {
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  scheduleText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  tasksList: {
    marginTop: 12,
  },
  tasksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  taskItem: {
    fontSize: 15,
    marginLeft: 8,
    marginBottom: 6,
    color: '#444',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#009D96',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#009D96',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  childrenList: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  childrenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  childItem: {
    fontSize: 15,
    marginLeft: 8,
    marginBottom: 4,
    color: '#444',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginLeft: 8,
  },
}); 