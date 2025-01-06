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
import { schedulesService } from '../src/services/api.service';
import { TaskIcon } from '../src/components/TaskIcon';
import { TASK_ICONS, VALID_ICONS, TaskIconType } from '../src/constants/icons';

export default function CreateScheduleScreen() {
  const router = useRouter();
  const [schedule, setSchedule] = useState({
    name: '',
    startTime: '09:00',
    endTime: '10:00',
    icon: 'homework' as TaskIconType,
    recommendedDuration: 60,
    isActive: true,
    appliedToAll: true,
  });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!schedule.name) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el horario');
      return;
    }

    try {
      setLoading(true);
      await schedulesService.create(schedule);
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
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={schedule.name}
            onChangeText={(text) => setSchedule(prev => ({ ...prev, name: text }))}
            placeholder="Nombre del horario"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Horario</Text>
          <View style={styles.timeContainer}>
            <TextInput
              style={[styles.input, styles.timeInput]}
              value={schedule.startTime}
              onChangeText={(text) => setSchedule(prev => ({ ...prev, startTime: text }))}
              placeholder="09:00"
            />
            <Text style={styles.timeSeparator}>-</Text>
            <TextInput
              style={[styles.input, styles.timeInput]}
              value={schedule.endTime}
              onChangeText={(text) => setSchedule(prev => ({ ...prev, endTime: text }))}
              placeholder="10:00"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duración recomendada (minutos)</Text>
          <TextInput
            style={styles.input}
            value={String(schedule.recommendedDuration)}
            onChangeText={(text) => setSchedule(prev => ({ ...prev, recommendedDuration: parseInt(text) || 0 }))}
            keyboardType="numeric"
            placeholder="60"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ícono</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconList}>
            {VALID_ICONS.map((iconType) => (
              <TouchableOpacity
                key={iconType}
                style={[
                  styles.iconButton,
                  schedule.icon === iconType && styles.iconButtonSelected
                ]}
                onPress={() => setSchedule(prev => ({ ...prev, icon: iconType }))}
              >
                <TaskIcon iconType={iconType} size={24} />
                <Text style={styles.iconLabel}>{TASK_ICONS[iconType].label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Activo</Text>
          <Switch
            value={schedule.isActive}
            onValueChange={(value) => setSchedule(prev => ({ ...prev, isActive: value }))}
            trackColor={{ false: '#767577', true: '#81b0ad' }}
            thumbColor={schedule.isActive ? '#009D96' : '#f4f3f4'}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Aplicar a todos</Text>
          <Switch
            value={schedule.appliedToAll}
            onValueChange={(value) => setSchedule(prev => ({ ...prev, appliedToAll: value }))}
            trackColor={{ false: '#767577', true: '#81b0ad' }}
            thumbColor={schedule.appliedToAll ? '#009D96' : '#f4f3f4'}
          />
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    flex: 1,
  },
  timeSeparator: {
    marginHorizontal: 8,
    fontSize: 16,
    color: '#666',
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