import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function QRCodeScanner({ onScanSuccess, scanned, setScanned }) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isVerifying, setIsVerifying] = useState(false);

  const getCurrentIP = async () => {
    try {
      const res = await fetch('https://api64.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch (err) {
      console.error('Error fetching IP:', err);
      return 'Unavailable';
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setIsVerifying(true);

    try {
      const url = new URL(data);
      const owner_ip = url.searchParams.get('owner_ip');
      const subject = url.searchParams.get('subject');
      const current_ip = await getCurrentIP();

      setIsVerifying(false);

      if (!owner_ip || !subject) {
        Alert.alert('Invalid QR', 'This QR code is not recognized by SmartSync.');
        return;
      }

      if (owner_ip === current_ip) {
        onScanSuccess({ ip: current_ip, subject });
      } else {
        Alert.alert(
          'Security Mismatch',
          `IP Conflict detected.\n\nYour IP: ${current_ip}\nRequired: ${owner_ip}\n\nPlease connect to the internal campus WiFi.`,
          [{ text: 'Try Again', onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      setIsVerifying(false);
      Alert.alert('Error', 'Malformed or unsupported QR code.');
      setScanned(false);
    }
  };

  if (!permission) return <View style={styles.loadingContainer}><ActivityIndicator color="#00BCD4" /></View>;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <LinearGradient colors={['#1F2A44', '#0A0E21']} style={styles.permissionCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="camera-outline" size={40} color="#00BCD4" />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionDesc}>
            To check-in using QR codes, we need your permission to access the camera.
          </Text>
          <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
            <Text style={styles.permissionButtonText}>Grant Access</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
      />

      {isVerifying && (
        <View style={styles.verifyingOverlay}>
          <ActivityIndicator size="large" color="#00BCD4" />
          <Text style={styles.verifyingText}>Verifying Handshake...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0E21',
  },
  permissionContainer: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0E21',
  },
  permissionCard: {
    width: '100%',
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,188,212,0.2)',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,188,212,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  permissionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  permissionDesc: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 15,
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifyingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyingText: {
    color: '#00BCD4',
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  scanAgainContainer: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 8,
  },
  scanAgainText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});