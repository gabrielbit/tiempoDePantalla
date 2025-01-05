import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { CHILDREN_PROFILES } from '../../src/data/profiles';
import { ScreenTimeSchedule } from '../../src/types/types';
import { useSession } from '../../src/context/SessionContext';
import { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../src/components/BackButton';
import { SvgProps } from 'react-native-svg';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const profile = CHILDREN_PROFILES.find(p => p.id === id);
  const currentDate = new Date();
  const { startSession, endSession, getActiveSession } = useSession();
  const [timeState, setTimeState] = useState({
    elapsedTime: 0,
    isRunning: false,
    isPaused: false,
    totalTime: 0,
  });
  const router = useRouter();

  const handleStartSession = (schedule: ScreenTimeSchedule) => {
    if (profile) {
      startSession(profile.id, schedule);
      setTimeState({
        elapsedTime: 0,
        isRunning: true,
        isPaused: false,
        totalTime: schedule.recommendedDuration * 60,
      });
    }
  };

  const handlePauseResume = () => {
    setTimeState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  };

  const handleEndSession = (scheduleId: string) => {
    if (profile) {
      endSession(profile.id, scheduleId);
      setTimeState({
        elapsedTime: 0,
        isRunning: false,
        isPaused: false,
        totalTime: 0,
      });
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeState.isRunning && !timeState.isPaused) {
      timer = setInterval(() => {
        setTimeState(prev => ({
          ...prev,
          elapsedTime: prev.elapsedTime + 1,
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeState.isRunning, timeState.isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return Math.min((timeState.elapsedTime / timeState.totalTime) * 100, 100);
  };

  const isOvertime = () => {
    return timeState.elapsedTime > timeState.totalTime;
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'long' });
    return `${day} de ${month}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#4CAF50';
      case 'in_progress':
        return '#2196F3';
      case 'completed':
        return '#9E9E9E';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'in_progress':
        return 'En curso';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const renderAvatar = (profile: ChildProfile) => {
    if (profile.avatar) {
      const AvatarComponent = profile.avatar as React.FC<SvgProps>;
      return (
        <View style={styles.avatarContainer}>
          <AvatarComponent width={40} height={40} />
        </View>
      );
    }

    return (
      <View style={[styles.avatarContainer, styles.avatarPlaceholder]}>
        <Text style={styles.avatarText}>
          {getInitials(profile.name)}
        </Text>
      </View>
    );
  };

  const renderScheduleActions = (schedule: ScreenTimeSchedule) => {
    switch (schedule.status) {
      case 'available':
        return (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleStartSession(schedule)}
          >
            <Text style={styles.actionButtonText}>Iniciar Tiempo</Text>
          </TouchableOpacity>
        );
      case 'in_progress':
        return (
          <View style={styles.progressInfo}>
            <View style={styles.timeDisplay}>
              <Text style={[
                styles.timeText,
                isOvertime() && styles.overtimeText
              ]}>
                {formatTime(timeState.elapsedTime)}
              </Text>
              <Text style={styles.totalTimeText}>
                de {formatTime(timeState.totalTime)}
              </Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar,
                  { width: `${getProgressPercentage()}%` },
                  isOvertime() && styles.overtimeBar
                ]} 
              />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.pauseButton]}
                onPress={handlePauseResume}
              >
                <Text style={styles.actionButtonText}>
                  {timeState.isPaused ? 'Reanudar' : 'Pausar'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.stopButton]}
                onPress={() => handleEndSession(schedule.id)}
              >
                <Text style={styles.actionButtonText}>Terminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'completed':
        return (
          <View style={styles.completedInfo}>
            <Text style={styles.completedText}>
              Tiempo completado: {formatTime(timeState.elapsedTime)}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Perfil no encontrado</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BackButton onPress={() => router.back()} />
          {renderAvatar(profile)}
          <Text style={styles.title}>{profile.name}</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>Horarios de Hoy</Text>
          {profile?.schedules.map((schedule) => (
            <View key={schedule.id} style={styles.scheduleCard}>
              <View style={styles.scheduleHeader}>
                <Text style={styles.scheduleTime}>
                  {schedule.startTime} - {schedule.endTime}
                </Text>
                <Text style={[
                  styles.scheduleStatus,
                  { color: getStatusColor(schedule.status) }
                ]}>
                  {getStatusText(schedule.status)}
                </Text>
              </View>
              <Text style={styles.scheduleDuration}>
                Duración: {schedule.recommendedDuration} min
              </Text>
              {renderScheduleActions(schedule)}
            </View>
          ))}
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Tiempo Límite Total</Text>
            <Text style={styles.statValue}>{profile.screenTimeLimit} min</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Tiempo Usado</Text>
            <Text style={styles.statValue}>{profile.screenTimeUsed} min</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Tiempo Restante</Text>
            <Text style={styles.statValue}>
              {profile.screenTimeLimit - profile.screenTimeUsed} min
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scheduleSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  scheduleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  scheduleStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  scheduleDuration: {
    fontSize: 14,
    color: '#666',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    flex: 1,
  },
  pauseButton: {
    backgroundColor: '#FFA000',
    marginRight: 8,
  },
  stopButton: {
    backgroundColor: '#F44336',
    marginLeft: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  progressText: {
    color: '#1976D2',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  completedInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  completedText: {
    color: '#2E7D32',
    fontSize: 14,
    textAlign: 'center',
  },
  timeDisplay: {
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  overtimeText: {
    color: '#F44336',
  },
  totalTimeText: {
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  overtimeBar: {
    backgroundColor: '#F44336',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
  },
  avatarPlaceholder: {
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 