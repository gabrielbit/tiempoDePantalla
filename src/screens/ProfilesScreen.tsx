import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  RefreshControl 
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { childrenService } from '../services/api.service';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadChildren = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching children...');
      const data = await childrenService.getAll();
      console.log('Children data:', data);
      setChildren(data);
    } catch (error) {
      console.error('Error loading children:', error);
      setError('No se pudieron cargar los perfiles');
      Alert.alert('Error', 'No se pudieron cargar los perfiles');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChildren();
    setRefreshing(false);
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Current token:', token);
      Alert.alert('Auth Status', token ? 'Token presente' : 'No hay token');
    } catch (error) {
      console.error('Error checking token:', error);
    }
  };

  const renderChild = ({ item }: { item: Child }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/profile/${item.id}`)}
    >
      <View style={styles.avatarContainer}>
        <FontAwesome5 name="child" size={24} color="#009D96" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.age}>{item.age} años</Text>
        <Text style={styles.screenTime}>
          Tiempo de pantalla: {item.screenTimeUsed}/{item.screenTimeLimit} min
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadChildren}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <Text>Cargando perfiles...</Text>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#009D96']}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No hay perfiles creados</Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => router.push('/create-profile')}
            >
              <Text style={styles.createButtonText}>Crear Perfil</Text>
            </TouchableOpacity>
          </View>
        )}
        ListHeaderComponent={() => (
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={checkAuth}
          >
            <Text style={styles.debugButtonText}>Verificar Auth</Text>
          </TouchableOpacity>
        )}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  age: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  screenTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#009D96',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#009D96',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugButton: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
    alignSelf: 'flex-end',
  },
  debugButtonText: {
    color: '#666',
    fontSize: 12,
  },
}); 