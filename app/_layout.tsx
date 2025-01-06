import { Stack } from 'expo-router';
import { SessionProvider } from '../src/context/SessionContext';

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="login" 
          options={{ 
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="create-schedule"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Crear Horario',
            headerTintColor: '#009D96',
          }}
        />
        <Stack.Screen 
          name="profile/[id]" 
          options={{ 
            presentation: 'modal',
          }} 
        />
      </Stack>
    </SessionProvider>
  );
}
