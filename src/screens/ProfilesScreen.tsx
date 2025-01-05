import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CHILDREN_PROFILES } from '../data/profiles';
import { TASKS } from '../data/tasks';

export default function ProfilesScreen() {
  const router = useRouter();

  // Debug useEffect para verificar datos
  useEffect(() => {
    console.log('TASKS:', TASKS);
    console.log('CHILDREN_PROFILES:', CHILDREN_PROFILES);
  }, []);

  const getCompletedTasksCount = React.useCallback((profileId: string) => {
    const profile = CHILDREN_PROFILES.find(p => p.id === profileId);
    if (!profile) {
      console.log('No profile found for id:', profileId);
      return 0;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const uniqueCompletions = new Set(
      profile.taskCompletions
        .filter(completion => new Date(completion.completedAt) >= thirtyDaysAgo)
        .map(completion => completion.taskId)
    );

    console.log(`Profile ${profileId} completed tasks:`, uniqueCompletions.size);
    return uniqueCompletions.size;
  }, []);

  const getTotalTasksCount = React.useCallback((profileId: string) => {
    const profile = CHILDREN_PROFILES.find(p => p.id === profileId);
    if (!profile) {
      console.log('No profile found for id:', profileId);
      return 0;
    }

    const scheduleIds = profile.schedules.map(s => s.id);
    
    const uniqueTasks = new Set(
      TASKS.filter(task => 
        task.scheduleIds.some(id => scheduleIds.includes(id))
      ).map(task => task.id)
    );

    console.log(`Profile ${profileId} total tasks:`, uniqueTasks.size);
    return uniqueTasks.size;
  }, []);

  // Renderizar los valores directamente para debug
  const renderDebugValues = (profileId: string) => {
    const completed = getCompletedTasksCount(profileId);
    const total = getTotalTasksCount(profileId);
    return `${completed}/${total}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfiles</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/profile/new')}
        >
          <FontAwesome5 name="plus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {CHILDREN_PROFILES.map(profile => (
          <TouchableOpacity
            key={profile.id}
            style={styles.profileCard}
            onPress={() => router.push(`/profile/${profile.id}`)}
          >
            <View style={styles.profileInfo}>
              {profile.avatar ? (
                <View style={styles.avatarContainer}>
                  <profile.avatar width={60} height={60} />
                </View>
              ) : (
                <View style={[styles.avatarContainer, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarText}>{profile.name[0]}</Text>
                </View>
              )}
              <View style={styles.profileDetails}>
                <View style={styles.profileHeader}>
                  <Text style={styles.profileName}>{profile.name}</Text>
                  <Text style={styles.profileAge}>{profile.age} años</Text>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {renderDebugValues(profile.id)}
                    </Text>
                    <Text style={styles.statLabel}>Tareas completadas</Text>
                    <Text style={styles.statPeriod}>últimos 30 días</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {Math.round(profile.screenTimeUsed / 60)}h/{Math.round(profile.screenTimeLimit / 60)}h
                    </Text>
                    <Text style={styles.statLabel}>Tiempo de pantalla</Text>
                    <Text style={styles.statPeriod}>hoy</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  profileCard: {
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
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    backgroundColor: '#009D96',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#009D96',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statPeriod: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileAge: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
}); 