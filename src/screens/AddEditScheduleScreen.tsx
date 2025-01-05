import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScreenTimeSchedule } from '../types/types';
import { CHILDREN_PROFILES } from '../data/profiles';

interface AddEditScheduleScreenProps {
  schedule?: ScreenTimeSchedule;
  onSave: (schedule: ScreenTimeSchedule) => void;
}

export const AddEditScheduleScreen = ({ schedule, onSave }: AddEditScheduleScreenProps) => {
  const [startTime, setStartTime] = useState(schedule?.startTime || '09:00');
  const [endTime, setEndTime] = useState(schedule?.endTime || '10:30');
  const [duration, setDuration] = useState(schedule?.recommendedDuration || 90);
  const [appliedToAll, setAppliedToAll] = useState(schedule?.appliedToAll || true);
  const [selectedChildren, setSelectedChildren] = useState<string[]>(
    schedule?.childrenIds || []
  );

  const handleSave = () => {
    const newSchedule: ScreenTimeSchedule = {
      id: schedule?.id || Date.now().toString(),
      startTime,
      endTime,
      recommendedDuration: duration,
      isActive: true,
      appliedToAll,
      childrenIds: appliedToAll ? undefined : selectedChildren,
    };
    onSave(newSchedule);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Horario</Text>
        <View style={styles.timeContainer}>
          <View style={styles.timeInput}>
            <Text style={styles.label}>Hora de inicio</Text>
            <TouchableOpacity style={styles.timeButton}>
              <Text style={styles.timeButtonText}>{startTime}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timeInput}>
            <Text style={styles.label}>Hora de fin</Text>
            <TouchableOpacity style={styles.timeButton}>
              <Text style={styles.timeButtonText}>{endTime}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Duración recomendada</Text>
        <View style={styles.durationContainer}>
          <TouchableOpacity 
            style={styles.durationButton}
            onPress={() => setDuration(Math.max(30, duration - 15))}
          >
            <Text style={styles.durationButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.durationText}>{duration} min</Text>
          <TouchableOpacity 
            style={styles.durationButton}
            onPress={() => setDuration(duration + 15)}
          >
            <Text style={styles.durationButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aplicar a</Text>
        <TouchableOpacity 
          style={[styles.optionButton, appliedToAll && styles.optionButtonActive]}
          onPress={() => setAppliedToAll(true)}
        >
          <Text style={styles.optionButtonText}>Todos los niños</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.optionButton, !appliedToAll && styles.optionButtonActive]}
          onPress={() => setAppliedToAll(false)}
        >
          <Text style={styles.optionButtonText}>Seleccionar niños</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeButton: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    color: '#2196F3',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationButton: {
    backgroundColor: '#E3F2FD',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationButtonText: {
    fontSize: 24,
    color: '#2196F3',
  },
  durationText: {
    fontSize: 18,
    marginHorizontal: 16,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#E3F2FD',
  },
  optionButtonActive: {
    backgroundColor: '#2196F3',
  },
  optionButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2196F3',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 