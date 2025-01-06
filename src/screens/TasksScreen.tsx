import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { tasksService } from '../services/api.service';
import { Task } from '../types';
import { TaskIcon } from '../components/TaskIcon';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksService.getAll();
      setTasks(response);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <TaskIcon iconType={item.icon} size={24} />
        <View style={styles.taskInfo}>
          <Text style={styles.taskName}>{item.name}</Text>
          <Text style={styles.taskDescription}>{item.description}</Text>
        </View>
        {item.isRequired ? (
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>Req.</Text>
          </View>
        ) : (
          <View style={styles.optionalBadge}>
            <Text style={styles.optionalText}>Opt.</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando tareas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadTasks}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
    marginLeft: 12,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  requiredBadge: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  requiredText: {
    color: '#f44336',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionalBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  optionalText: {
    color: '#4caf50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: '#009D96',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    alignSelf: 'center',
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 