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
          name="profile/[id]" 
          options={{ 
            presentation: 'modal',
          }} 
        />
      </Stack>
    </SessionProvider>
  );
}
