import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
  StatusBar
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import QRCodeScanner from '../components/QRCodeScanner';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function QRScannerScreen() {
  const navigation = useNavigation();
  const [scanned, setScanned] = useState(false);

  const handleScanSuccess = ({ ip, subject }) => {
    // Navigate to Face Recognition screen after successful QR scan
    navigation.navigate('FaceRecognitionScreen', { ip, subject });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 📸 QR Scanner Engine */}
      <View style={styles.scannerContainer}>
        <QRCodeScanner
          onScanSuccess={handleScanSuccess}
          scanned={scanned}
          setScanned={setScanned}
        />

        {/* 🎨 Overlay Mask */}
        <View style={styles.overlay}>
          <View style={styles.unfocusedTop} />
          <View style={styles.midRow}>
            <View style={styles.unfocusedSide} />
            <View style={styles.focusedSpace}>
              {/* Corner Accents */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />

              {/* Animated Scan Line (Simplified) */}
              <View style={styles.scanLine} />
            </View>
            <View style={styles.unfocusedSide} />
          </View>
          <View style={styles.unfocusedBottom} />
        </View>
      </View>

      {/* 🔝 Premium Header */}
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Class Check-in</Text>
            <Text style={styles.headerSubtitle}>Scan the session QR Code</Text>
          </View>
        </View>

        {/* ℹ️ Instructions Footer */}
        <View style={styles.footer}>
          {scanned && (
            <TouchableOpacity
              style={styles.scanAgainButton}
              onPress={() => setScanned(false)}
            >
              <LinearGradient
                colors={['#00BCD4', '#0097A7']}
                style={styles.scanAgainGradient}
              >
                <Ionicons name="refresh" size={20} color="#FFF" />
                <Text style={styles.scanAgainText}>SCAN AGAIN</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={styles.instructionCard}>
            <LinearGradient
              colors={['rgba(0, 188, 212, 0.15)', 'rgba(0, 188, 212, 0.05)']}
              style={styles.instructionContent}
            >
              <MaterialCommunityIcons name="qrcode-scan" size={24} color="#00BCD4" />
              <View style={styles.instructionTextContainer}>
                <Text style={styles.instructionTitle}>Position QR Code</Text>
                <Text style={styles.instructionDesc}>Align the QR code within the frame to verify class IP and session details.</Text>
              </View>
            </LinearGradient>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  unfocusedTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  midRow: {
    flexDirection: 'row',
    height: width * 0.7,
  },
  unfocusedSide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  focusedSpace: {
    width: width * 0.7,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  unfocusedBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00BCD4',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 15,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 15,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 15,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 15,
  },
  scanLine: {
    height: 2,
    backgroundColor: '#00BCD4',
    width: '100%',
    position: 'absolute',
    top: '50%',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  safeContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 30 : 50,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#00BCD4',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  instructionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 188, 212, 0.3)',
  },
  instructionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 15,
  },
  instructionTextContainer: {
    flex: 1,
  },
  instructionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionDesc: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  scanAgainButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  scanAgainGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  scanAgainText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});