import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChildProfile } from '../types/types';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type ProfileDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProfileDetail'>;

interface ProfileDetailScreenProps {
  route: ProfileDetailScreenRouteProp;
}

export const ProfileDetailScreen = ({ route }: ProfileDetailScreenProps) => {
  const { profile } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.age}>{profile.age} años</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Tiempo Límite</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  age: {
    fontSize: 18,
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
}); 