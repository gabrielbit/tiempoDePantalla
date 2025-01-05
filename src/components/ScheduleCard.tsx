import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SvgProps } from 'react-native-svg';

export const ScheduleCard = ({ schedule, profileName, avatar }) => {
  const AvatarComponent = avatar as React.FC<SvgProps>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in_progress': return '#2196F3';
      case 'available': return '#FF9800';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in_progress': return 'En Progreso';
      case 'available': return 'Disponible';
      default: return 'No Iniciado';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <AvatarComponent width={40} height={40} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{profileName}</Text>
          <Text style={[styles.status, { color: getStatusColor(schedule.status) }]}>
            {getStatusText(schedule.status)}
          </Text>
        </View>
      </View>

      <View style={styles.timeInfo}>
        <Text style={styles.timeText}>
          {schedule.startTime} - {schedule.endTime}
        </Text>
        <Text style={styles.duration}>
          {schedule.recommendedDuration} minutos
        </Text>
      </View>

      <View style={styles.actions}>
        {schedule.status === 'available' && (
          <TouchableOpacity style={styles.startButton}>
            <FontAwesome5 name="play" size={16} color="#fff" />
            <Text style={styles.buttonText}>Iniciar</Text>
          </TouchableOpacity>
        )}
        {schedule.status === 'in_progress' && (
          <>
            <TouchableOpacity style={styles.pauseButton}>
              <FontAwesome5 name="pause" size={16} color="#fff" />
              <Text style={styles.buttonText}>Pausar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stopButton}>
              <FontAwesome5 name="stop" size={16} color="#fff" />
              <Text style={styles.buttonText}>Finalizar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontSize: 14,
  },
  timeInfo: {
    marginBottom: 12,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  pauseButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  stopButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 