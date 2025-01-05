import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CHILDREN_PROFILES } from '../data/profiles';
import { SvgProps } from 'react-native-svg';
import { ScreenTimeSchedule } from '../types/types';
import { TASKS } from '../data/tasks';

// Definir la interfaz localmente
interface ScheduleWithProfiles extends ScreenTimeSchedule {
  profiles: {
    id: string;
    name: string;
    avatar?: React.FC<SvgProps>;
  }[];
}

export default function ScheduleManagementScreen() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'inactive'>('all');
  const [childFilter, setChildFilter] = React.useState<string>('all');
  const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);
  const [showChildDropdown, setShowChildDropdown] = React.useState(false);

  const initialSchedules = React.useMemo(() => {
    return CHILDREN_PROFILES.reduce<ScheduleWithProfiles[]>((schedules, profile) => {
      profile.schedules.forEach(schedule => {
        const existingSchedule = schedules.find(s => s.id === schedule.id);
        if (!existingSchedule) {
          schedules.push({
            ...schedule,
            profiles: [{
              id: profile.id,
              name: profile.name,
              avatar: profile.avatar
            }]
          });
        } else {
          existingSchedule.profiles.push({
            id: profile.id,
            name: profile.name,
            avatar: profile.avatar
          });
        }
      });
      return schedules;
    }, []).sort((a, b) => {
      const [aHours, aMinutes] = a.startTime.split(':').map(Number);
      const [bHours, bMinutes] = b.startTime.split(':').map(Number);
      return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
    });
  }, []);

  const [schedules, setSchedules] = React.useState<ScheduleWithProfiles[]>(initialSchedules);

  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let durationInMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    
    if (durationInMinutes < 0) {
      durationInMinutes += 24 * 60;
    }
    
    return durationInMinutes;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutos`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}min`
      : `${hours} horas`;
  };

  const renderAvatar = (profile: { id: string; name: string; avatar?: React.FC<SvgProps> }) => {
    if (profile.avatar) {
      const AvatarComponent = profile.avatar;
      return (
        <View style={styles.avatarContainer}>
          <AvatarComponent width={36} height={36} />
        </View>
      );
    }
    return (
      <View style={[styles.avatarContainer, styles.avatarPlaceholder]}>
        <Text style={styles.avatarText}>{profile.name[0]}</Text>
      </View>
    );
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && schedule.isActive) ||
      (statusFilter === 'inactive' && !schedule.isActive);
    
    const matchesChild = childFilter === 'all' ||
      schedule.profiles.some(profile => profile.id === childFilter);
    
    return matchesStatus && matchesChild;
  });

  const getStatusLabel = () => {
    switch (statusFilter) {
      case 'active': return 'Activos';
      case 'inactive': return 'Inactivos';
      default: return 'Todos';
    }
  };

  const getChildLabel = () => {
    if (childFilter === 'all') return 'Todos';
    const child = CHILDREN_PROFILES.find(c => c.id === childFilter);
    return child ? child.name : 'Todos';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Horarios</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/schedule/new')}
        >
          <FontAwesome5 name="plus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowStatusDropdown(true)}
          >
            <Text style={styles.dropdownLabel}>Estado:</Text>
            <Text style={styles.dropdownValue}>{getStatusLabel()}</Text>
            <FontAwesome5 name="chevron-down" size={12} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowChildDropdown(true)}
          >
            <Text style={styles.dropdownLabel}>Niño:</Text>
            <Text style={styles.dropdownValue}>{getChildLabel()}</Text>
            <FontAwesome5 name="chevron-down" size={12} color="#666" />
          </TouchableOpacity>
        </View>

        <Modal
          visible={showStatusDropdown}
          transparent
          animationType="slide"
          onRequestClose={() => setShowStatusDropdown(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowStatusDropdown(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Estado</Text>
                <TouchableOpacity onPress={() => setShowStatusDropdown(false)}>
                  <FontAwesome5 name="times" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => {
                  setStatusFilter('all');
                  setShowStatusDropdown(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  statusFilter === 'all' && styles.modalOptionActive
                ]}>Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => {
                  setStatusFilter('active');
                  setShowStatusDropdown(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  statusFilter === 'active' && styles.modalOptionActive
                ]}>Activos</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => {
                  setStatusFilter('inactive');
                  setShowStatusDropdown(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  statusFilter === 'inactive' && styles.modalOptionActive
                ]}>Inactivos</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={showChildDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowChildDropdown(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowChildDropdown(false)}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => {
                  setChildFilter('all');
                  setShowChildDropdown(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  childFilter === 'all' && styles.modalOptionActive
                ]}>Todos</Text>
              </TouchableOpacity>
              {CHILDREN_PROFILES.map(child => (
                <TouchableOpacity 
                  key={child.id}
                  style={styles.modalOption}
                  onPress={() => {
                    setChildFilter(child.id);
                    setShowChildDropdown(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    childFilter === child.id && styles.modalOptionActive
                  ]}>{child.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      <ScrollView style={styles.container}>
        {filteredSchedules.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="clock" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No hay horarios creados</Text>
            <Text style={styles.emptySubtext}>
              Toca el botón "+" para agregar un horario
            </Text>
          </View>
        ) : (
          filteredSchedules.map(schedule => (
            <TouchableOpacity
              key={schedule.id}
              style={styles.scheduleCard}
              onPress={() => router.push(`/schedule/${schedule.id}`)}
            >
              <View style={styles.scheduleHeader}>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{schedule.startTime} - {schedule.endTime}</Text>
                  <Text style={styles.durationText}>
                    {formatDuration(calculateDuration(schedule.startTime, schedule.endTime))}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: schedule.isActive ? '#4CAF50' : '#999' }
                ]}>
                  <Text style={styles.statusText}>
                    {schedule.isActive ? 'Activo' : 'Inactivo'}
                  </Text>
                </View>
              </View>

              <View style={styles.profilesContainer}>
                <Text style={styles.profilesLabel}>Asignado a:</Text>
                <View style={styles.profilesList}>
                  <View style={styles.avatarsContainer}>
                    {schedule.profiles.slice(0, 3).map((profile, index) => (
                      <View key={profile.id} style={[
                        styles.avatarContainer,
                        { zIndex: 3 - index }
                      ]}>
                        {renderAvatar(profile)}
                      </View>
                    ))}
                    {schedule.profiles.length > 3 && (
                      <View style={styles.moreAvatarsCircle}>
                        <Text style={styles.moreAvatarsText}>
                          +{schedule.profiles.length - 3}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {schedule.appliedToAll && (
                <View style={styles.appliedToAllBadge}>
                  <FontAwesome5 name="users" size={12} color="#009D96" />
                  <Text style={styles.appliedToAllText}>Aplicado a todos los niños</Text>
                </View>
              )}

              <View style={styles.tasksContainer}>
                <Text style={styles.tasksLabel}>Tareas asignadas:</Text>
                <View style={styles.taskChips}>
                  {TASKS.filter(task => task.scheduleIds.includes(schedule.id))
                    .map(task => (
                      <View key={task.id} style={styles.taskChip}>
                        <FontAwesome5 
                          name={task.icon} 
                          size={14} 
                          color="#009D96" 
                          style={styles.taskChipIcon}
                        />
                        <Text style={styles.taskChipText}>
                          {task.name}
                          {task.isRequired && ' *'}
                        </Text>
                      </View>
                    ))}
                  {!TASKS.some(task => task.scheduleIds.includes(schedule.id)) && (
                    <Text style={styles.noTasksText}>Sin tareas asignadas</Text>
                  )}
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
  scheduleCard: {
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
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  timeContainer: {
    flex: 1,
  },
  timeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  profilesContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  profilesLabel: {
    fontSize: 14,
    color: '#666',
  },
  profilesList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: -6,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  avatarPlaceholder: {
    backgroundColor: '#009D96',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  moreAvatarsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -6,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  moreAvatarsText: {
    color: '#009D96',
    fontSize: 12,
    fontWeight: 'bold',
  },
  appliedToAllBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#E8F5F5',
    borderRadius: 8,
    justifyContent: 'flex-start',
    width: '100%',
  },
  appliedToAllText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#009D96',
    fontWeight: '500',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dropdownLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  dropdownValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalOption: {
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalOptionActive: {
    color: '#009D96',
    fontWeight: '600',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasksContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tasksLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  taskChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  taskChip: {
    backgroundColor: '#E8F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskChipIcon: {
    marginRight: 6,
  },
  taskChipText: {
    color: '#009D96',
    fontSize: 14,
    fontWeight: '500',
  },
  noTasksText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
}); 