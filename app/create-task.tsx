import React, { useState } from 'react';
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
import { tasksService } from '../src/services/api.service';
import { TaskIcon } from '../src/components/TaskIcon';
import { TASK_ICONS, TaskIconType } from '../src/constants/icons';

export default function CreateTaskScreen() {
  const router = useRouter();
  const [task, setTask] = useState({
    name: '',
    description: '',
    icon: 'homework' as TaskIconType,
    isRequired: true,
  });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!task.name || !task.description) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      await tasksService.create(task);
      router.back();
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'No se pudo crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={task.name}
            onChangeText={(text) => setTask(prev => ({ ...prev, name: text }))}
            placeholder="Nombre de la tarea"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={task.description}
            onChangeText={(text) => setTask(prev => ({ ...prev, description: text }))}
            placeholder="Descripción de la tarea"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ícono</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconList}>
            {Object.entries(TASK_ICONS).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.iconButton,
                  task.icon === key && styles.iconButtonSelected
                ]}
                onPress={() => setTask(prev => ({ ...prev, icon: key as TaskIconType }))}
              >
                <TaskIcon iconType={key as TaskIconType} size={24} />
                <Text style={styles.iconLabel}>{value.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Tarea requerida</Text>
          <Switch
            value={task.isRequired}
            onValueChange={(value) => setTask(prev => ({ ...prev, isRequired: value }))}
            trackColor={{ false: '#767577', true: '#81b0ad' }}
            thumbColor={task.isRequired ? '#009D96' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creando...' : 'Crear Tarea'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  iconList: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconButton: {
    alignItems: 'center',
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: 80,
  },
  iconButtonSelected: {
    borderColor: '#009D96',
    backgroundColor: '#f0f9f9',
  },
  iconLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#009D96',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 