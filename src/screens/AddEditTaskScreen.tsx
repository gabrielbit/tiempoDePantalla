import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TASKS } from '../data/tasks';
import { CHILDREN_PROFILES } from '../data/profiles';
import { Task } from '../types/types';

const AVAILABLE_ICONS = [
  'book', 'book-reader', 'running', 'language', 'paint-brush', 'music',
  'calculator', 'puzzle-piece', 'gamepad', 'basketball-ball'
];

export default function AddEditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = Boolean(id);

  const [task, setTask] = useState<Partial<Task>>({
    name: '',
    description: '',
    icon: 'book',
    isRequired: false,
    scheduleIds: [],
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      const existingTask = TASKS.find(t => t.id === id);
      if (existingTask) {
        setTask(existingTask);
      }
    }
  }, [id]);

  const handleSave = () => {
    if (!task.name?.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!task.description?.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    if (!task.scheduleIds?.length) {
      setError('Debes asignar al menos un horario');
      return;
    }

    // Aquí iría la lógica para guardar la tarea
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? 'Editar tarea' : 'Nueva tarea'}
        </Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={task.name}
            onChangeText={(text) => setTask(prev => ({ ...prev, name: text }))}
            placeholder="Nombre de la tarea"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={task.description}
            onChangeText={(text) => setTask(prev => ({ ...prev, description: text }))}
            placeholder="Describe la tarea"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Ícono</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.iconList}
          >
            {AVAILABLE_ICONS.map((iconName) => (
              <TouchableOpacity
                key={iconName}
                style={[
                  styles.iconButton,
                  task.icon === iconName && styles.iconButtonSelected
                ]}
                onPress={() => setTask(prev => ({ ...prev, icon: iconName }))}
              >
                <FontAwesome5 
                  name={iconName} 
                  size={24} 
                  color={task.icon === iconName ? '#fff' : '#666'} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Tarea obligatoria</Text>
            <Switch
              value={task.isRequired}
              onValueChange={(value) => setTask(prev => ({ ...prev, isRequired: value }))}
              trackColor={{ false: '#ddd', true: '#009D96' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Horarios asignados</Text>
          <View style={styles.scheduleChips}>
            {task.scheduleIds?.map(scheduleId => (
              <View key={scheduleId} style={styles.scheduleChip}>
                <Text style={styles.scheduleChipText}>
                  {CHILDREN_PROFILES.find(p => p.schedules.some(s => s.id === scheduleId))?.schedules.find(s => s.id === scheduleId)?.startTime} - {CHILDREN_PROFILES.find(p => p.schedules.some(s => s.id === scheduleId))?.schedules.find(s => s.id === scheduleId)?.endTime}
                </Text>
                <TouchableOpacity 
                  onPress={() => {
                    setTask(prev => ({
                      ...prev,
                      scheduleIds: prev.scheduleIds?.filter(id => id !== scheduleId)
                    }));
                  }}
                  style={styles.removeScheduleButton}
                >
                  <FontAwesome5 name="times" size={12} color="#009D96" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity 
            style={styles.addScheduleButton}
            onPress={() => {
              // Implementar la lógica para mostrar el modal de agregar horario
            }}
          >
            <Text style={styles.addScheduleText}>Agregar horario</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  iconList: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  iconButtonSelected: {
    backgroundColor: '#009D96',
    borderColor: '#009D96',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  scheduleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  scheduleChip: {
    backgroundColor: '#E8F5F5',
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleChipText: {
    color: '#009D96',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  removeScheduleButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addScheduleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#009D96',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addScheduleText: {
    color: '#009D96',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
}); 