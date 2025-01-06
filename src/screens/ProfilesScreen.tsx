import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { childrenService } from '../services/api.service';
import { FontAwesome5 } from '@expo/vector-icons';

interface Child {
  id: string;
  name: string;
  age: number;
  screenTimeLimit: number;
  screenTimeUsed: number;
}

export default function ProfilesScreen() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      setLoading(true);
      const response = await childrenService.getAll();
      setChildren(response);
    } catch (err) {
      console.error('Error loading children:', err);
      setError('Error al cargar los perfiles');
    } finally {
      setLoading(false);
    }
  };

  const renderChild = ({ item }: { item: Child }) => (
    <TouchableOpacity style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <FontAwesome5 name="child" size={24} color="#009D96" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{item.name}</Text>
          <Text style={styles.profileAge}>{item.age} años</Text>
        </View>
      </View>
      <View style={styles.screenTimeInfo}>
        <Text style={styles.screenTimeText}>
          Tiempo de pantalla: {item.screenTimeUsed}/{item.screenTimeLimit} min
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando perfiles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadChildren}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={children}
        renderItem={renderChild}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileAge: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  screenTimeInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  screenTimeText: {
    fontSize: 14,
    color: '#666',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: '#009D96',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    alignSelf: 'center',
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 