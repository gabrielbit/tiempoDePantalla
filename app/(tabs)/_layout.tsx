import { Tabs, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabsLayout() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return null; // o un loading spinner mientras verifica
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#009D96',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hoy',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="calendar-day" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profiles"
        options={{
          title: 'Perfiles',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="users" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedules"
        options={{
          title: 'Horarios',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="clock" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tareas',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="tasks" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 