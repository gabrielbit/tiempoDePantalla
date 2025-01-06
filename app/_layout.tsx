import { Stack } from 'expo-router';
import { SessionProvider } from '../src/context/SessionContext';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootLayoutNav />
    </SessionProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: false,
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="create-schedule" 
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Crear Horario',
        }}
      />
    </Stack>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#009D96" />
    </View>
  );
}
