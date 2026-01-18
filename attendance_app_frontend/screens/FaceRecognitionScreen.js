import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FaceRecognitionScreen({ route }) {
  const navigation = useNavigation();
  const { subject } = route.params || {};

  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);

  if (!permission) {
    return <View><Text>Requesting camera permissions...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const simulateFaceVerification = async () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);

      const success = Math.random() > 0.1; // 90% chance success simulation

      if (success) {
        // Save to History Logs
        try {
          const log = {
            id: Date.now().toString(),
            subject: subject || 'General Session',
            code: 'SCAN',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
            status: 'Success',
            type: 'Lecture'
          };
          const existingLogs = await AsyncStorage.getItem('attendance_logs');
          const logs = existingLogs ? JSON.parse(existingLogs) : [];
          logs.unshift(log);
          await AsyncStorage.setItem('attendance_logs', JSON.stringify(logs.slice(0, 50))); // Keep last 50
        } catch (e) {
          console.error("Failed to save log", e);
        }

        navigation.navigate('Success', {
          title: "Attendance Marked",
          message: `Face matched successfully for ${subject || 'your session'}.`,
          redirectTo: 'StudentHome'
        });

      } else {
        Alert.alert('Face Not Recognized ❌', 'Please try scanning again.', [
          { text: 'Retry', onPress: () => { } }
        ]);
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} />

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity onPress={simulateFaceVerification} style={styles.button}>
          <Text style={styles.buttonText}>Confirm Face</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  camera: {
    width: '90%',
    height: '70%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
