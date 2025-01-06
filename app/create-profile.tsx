import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { childrenService } from '../src/services/api.service';

export default function CreateProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    screenTimeLimit: '120',
  });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!profile.name || !profile.age) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      await childrenService.create({
        name: profile.name,
        age: parseInt(profile.age),
        screenTimeLimit: parseInt(profile.screenTimeLimit),
        screenTimeUsed: 0,
      });
      router.back();
    } catch (error) {
      console.error('Error creating profile:', error);
      Alert.alert('Error', 'No se pudo crear el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
            placeholder="Nombre del niño"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Edad</Text>
          <TextInput
            style={styles.input}
            value={profile.age}
            onChangeText={(text) => setProfile(prev => ({ ...prev, age: text }))}
            keyboardType="numeric"
            placeholder="Edad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Límite de tiempo de pantalla (minutos)</Text>
          <TextInput
            style={styles.input}
            value={profile.screenTimeLimit}
            onChangeText={(text) => setProfile(prev => ({ ...prev, screenTimeLimit: text }))}
            keyboardType="numeric"
            placeholder="120"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creando...' : 'Crear Perfil'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#009D96',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 