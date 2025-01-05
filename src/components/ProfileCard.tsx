import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChildProfile } from '../types/types';
import { DefaultAvatar1 } from '../assets/avatars';

interface ProfileCardProps {
  profile: ChildProfile;
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <View style={styles.profileCard}>
      <DefaultAvatar1 width={50} height={50} />
      <Text style={styles.profileName}>{profile.name}</Text>
      <View style={styles.profileInfo}>
        <Text>Tiempo permitido: {profile.screenTimeLimit} min</Text>
        <Text>Tiempo usado: {profile.screenTimeUsed} min</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2196F3',
  },
  profileInfo: {
    gap: 4,
  },
}); 