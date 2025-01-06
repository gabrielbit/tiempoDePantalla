import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { schedulesService, tasksService, childrenService } from '../services/api.service';
import { Task, Child } from '../types';

export default function CreateScheduleScreen() {
  const router = useRouter();
  const [schedule, setSchedule] = useState({
    name: '',
    startTime: '',
    endTime: '',
    recommendedDuration: '',
    isActive: true,
    appliedToAll: false,
    childrenIds: [] as string[],
    taskIds: [] as string[],
  });

  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [availableChildren, setAvailableChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasks, children] = await Promise.all([
        tasksService.getAll(),
        childrenService.getAll()
      ]);
      setAvailableTasks(tasks);
      setAvailableChildren(children);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    }
  };

  const toggleTask = (taskId: string) => {
    setSchedule(prev => ({
      ...prev,
      taskIds: prev.taskIds.includes(taskId)
        ? prev.taskIds.filter(id => id !== taskId)
        : [...prev.taskIds, taskId]
    }));
  };

  const toggleChild = (childId: string) => {
    setSchedule(prev => ({
      ...prev,
      childrenIds: prev.childrenIds.includes(childId)
        ? prev.childrenIds.filter(id => id !== childId)
        : [...prev.childrenIds, childId]
    }));
  };

  const handleCreate = async () => {
    if (!schedule.name || !schedule.startTime || !schedule.endTime || !schedule.recommendedDuration) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (schedule.taskIds.length === 0) {
      Alert.alert('Error', 'Selecciona al menos una tarea');
      return;
    }

    if (schedule.childrenIds.length === 0 && !schedule.appliedToAll) {
      Alert.alert('Error', 'Selecciona al menos un niño o marca "Aplicar a todos"');
      return;
    }

    try {
      setLoading(true);
      await schedulesService.create({
        ...schedule,
        recommendedDuration: parseInt(schedule.recommendedDuration),
      });
      router.back();
    } catch (error) {
      console.error('Error creating schedule:', error);
      Alert.alert('Error', 'No se pudo crear el horario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Nuevo Horario</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={schedule.name}
          onChangeText={(text) => setSchedule(prev => ({ ...prev, name: text }))}
          placeholder="Ej: Horario de tarde"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hora de inicio</Text>
        <TextInput
          style={styles.input}
          value={schedule.startTime}
          onChangeText={(text) => setSchedule(prev => ({ ...prev, startTime: text }))}
          placeholder="HH:mm"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hora de fin</Text>
        <TextInput
          style={styles.input}
          value={schedule.endTime}
          onChangeText={(text) => setSchedule(prev => ({ ...prev, endTime: text }))}
          placeholder="HH:mm"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Duración recomendada (minutos)</Text>
        <TextInput
          style={styles.input}
          value={schedule.recommendedDuration}
          onChangeText={(text) => setSchedule(prev => ({ ...prev, recommendedDuration: text }))}
          keyboardType="numeric"
          placeholder="120"
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Activo</Text>
        <Switch
          value={schedule.isActive}
          onValueChange={(value) => setSchedule(prev => ({ ...prev, isActive: value }))}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Aplicar a todos</Text>
        <Switch
          value={schedule.appliedToAll}
          onValueChange={(value) => setSchedule(prev => ({ ...prev, appliedToAll: value }))}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tareas</Text>
        {availableTasks.map(task => (
          <TouchableOpacity 
            key={task.id}
            style={styles.checkItem}
            onPress={() => toggleTask(task.id)}
          >
            <Text>{task.icon} {task.name}</Text>
            <View style={[
              styles.checkbox,
              schedule.taskIds.includes(task.id) && styles.checkboxChecked
            ]} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Niños</Text>
        {availableChildren.map(child => (
          <TouchableOpacity 
            key={child.id}
            style={styles.checkItem}
            onPress={() => toggleChild(child.id)}
            disabled={schedule.appliedToAll}
          >
            <Text>{child.name}</Text>
            <View style={[
              styles.checkbox,
              schedule.childrenIds.includes(child.id) && styles.checkboxChecked
            ]} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleCreate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creando...' : 'Crear Horario'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#009D96',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#009D96',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  checkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#009D96',
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#009D96',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
}); 