import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useSession } from '../../src/context/SessionContext';
import { useRouter } from 'expo-router';

export default function TabsLayout() {
  const { logout } = useSession();
  const router = useRouter();

  const headerRight = (screen: string) => () => (
    <>
      <TouchableOpacity 
        onPress={() => router.push(`/create-${screen}`)}
        style={{ marginRight: 15 }}
      >
        <FontAwesome5 
          name="plus" 
          size={20} 
          color="#009D96" 
        />
      </TouchableOpacity>
      {screen === 'schedules' && (
        <TouchableOpacity 
          onPress={logout}
          style={{ marginRight: 15 }}
        >
          <FontAwesome5 
            name="sign-out-alt" 
            size={20} 
            color="#009D96" 
          />
        </TouchableOpacity>
      )}
    </>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#009D96',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#009D96',
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
          headerTitle: 'Perfiles',
          headerRight: headerRight('profile'),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="users" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedules"
        options={{
          title: 'Horarios',
          headerTitle: 'Horarios',
          headerRight: headerRight('schedules'),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="calendar-alt" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tareas',
          headerTitle: 'Tareas',
          headerRight: headerRight('tasks'),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="tasks" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 