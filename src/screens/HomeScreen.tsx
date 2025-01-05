import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CHILDREN_PROFILES } from '../data/profiles';
import { SvgProps } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { ChildProfile } from '../types/types';

export default function HomeScreen() {
  const router = useRouter();

  const renderAvatar = (profile: ChildProfile) => {
    if (profile.avatar) {
      const AvatarComponent = profile.avatar as React.FC<SvgProps>;
      return (
        <View style={styles.avatarContainer}>
          <AvatarComponent width={80} height={80} />
        </View>
      );
    }
    return (
      <View style={[styles.avatarContainer, styles.avatarPlaceholder]}>
        <Text style={styles.avatarText}>{profile.name[0]}</Text>
      </View>
    );
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
        {CHILDREN_PROFILES.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="users" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No hay perfiles creados</Text>
            <Text style={styles.emptySubtext}>
              Toca el botón "Agregar niño" para comenzar
            </Text>
          </View>
        ) : (
          CHILDREN_PROFILES.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              style={styles.profileCard}
              onPress={() => router.push(`/profile/${profile.id}`)}
            >
              {renderAvatar(profile)}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileAge}>{profile.age} años</Text>
                <View style={styles.timeInfo}>
                  <Text style={styles.timeText}>
                    Tiempo restante: {profile.screenTimeLimit - profile.screenTimeUsed} min
                  </Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${(profile.screenTimeUsed / profile.screenTimeLimit) * 100}%` }
                      ]} 
                    />
                  </View>
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
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    backgroundColor: '#009D96',
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  profileAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeInfo: {
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#009D96',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#009D96',
    borderRadius: 30,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 