import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
  StatusBar
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Network from 'expo-network';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function QRCreate() {
  const navigation = useNavigation();
  const [ip, setIP] = useState('');
  const [subject, setSubject] = useState('');
  const [qrValue, setQRValue] = useState('');
  const [qrGeneratedTime, setQrGeneratedTime] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [timeLeft, setTimeLeft] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      try {
        const ipAddr = await Network.getIpAddressAsync();
        setIP(ipAddr);
      } catch (e) {
        setIP('unknown');
      }
    })();
  }, []);

  useEffect(() => {
    let timer;
    if (qrGeneratedTime) {
      timer = setInterval(() => {
        const secondsPassed = Math.floor((Date.now() - qrGeneratedTime) / 1000);
        const remaining = Math.max(0, 120 - secondsPassed);
        setTimeLeft(remaining);
        if (remaining === 0) clearInterval(timer);
      }, 1000);

      // Pulse animation for active QR
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => clearInterval(timer);
  }, [qrGeneratedTime, pulseAnim]);

  const generateQR = () => {
    if (!subject.trim()) {
      alert('Please enter a subject.');
      return;
    }

    const baseURL = 'https://smartsync-verifier.vercel.app';
    const qrText = JSON.stringify({
      ip: ip,
      subject: subject.trim(),
      timestamp: Date.now(),
      type: 'attendance_session'
    });

    setQRValue(qrText);
    setQrGeneratedTime(Date.now());
    setTimeLeft(120);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const cancelQR = () => {
    setSubject('');
    setQRValue('');
    setQrGeneratedTime(null);
    setTimeLeft(0);
    fadeAnim.setValue(0);
  };

  const isExpired = timeLeft === 0 && qrValue !== '';

  return (
    <LinearGradient colors={['#0A0E21', '#121212']} style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={28} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Session Setup</Text>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.mainContent}>
              <Text style={styles.title}>Secure Attendance</Text>
              <Text style={styles.subtitle}>Generate a temporary QR for your session</Text>

              {/* Input Section */}
              <View style={styles.formContainer}>
                <View style={[styles.inputWrapper, qrValue ? styles.inputDisabled : null]}>
                  <View style={styles.inputIcon}>
                    <Ionicons name="book-outline" size={20} color={qrValue ? "#444" : "#00BCD4"} />
                  </View>
                  <TextInput
                    placeholder="Enter Subject Name"
                    placeholderTextColor="#555"
                    style={styles.input}
                    value={subject}
                    onChangeText={setSubject}
                    autoCapitalize="words"
                    editable={!qrValue}
                  />
                </View>

                {!qrValue && (
                  <TouchableOpacity style={styles.primaryButton} onPress={generateQR}>
                    <LinearGradient
                      colors={['#00BCD4', '#0097A7']}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>Generate Session QR</Text>
                      <Ionicons name="qr-code-outline" size={20} color="white" />
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>

              {/* QR Display Area */}
              {qrValue ? (
                <Animated.View style={[styles.qrDisplayArea, { opacity: fadeAnim }]}>
                  <Animated.View style={[
                    styles.qrContainer,
                    { transform: [{ scale: pulseAnim }] },
                    isExpired && styles.qrExpired
                  ]}>
                    <View style={styles.qrShadow}>
                      <QRCode
                        value={qrValue}
                        size={width * 0.55}
                        color={isExpired ? '#444' : '#000'}
                      />
                    </View>
                    {isExpired && (
                      <View style={styles.expiredOverlay}>
                        <Ionicons name="time-outline" size={60} color="#FF5252" />
                        <Text style={styles.expiredOverlayText}>EXPIRED</Text>
                      </View>
                    )}
                  </Animated.View>

                  <View style={styles.statusPanel}>
                    <View style={styles.timerRow}>
                      <Ionicons
                        name={isExpired ? "close-circle" : "timer-outline"}
                        size={20}
                        color={isExpired ? "#FF5252" : "#4CAF50"}
                      />
                      <Text style={[styles.timerText, { color: isExpired ? "#FF5252" : "#4CAF50" }]}>
                        {isExpired ? 'Session Timed Out' : `Valid for ${timeLeft} seconds`}
                      </Text>
                    </View>

                    <View style={styles.progressBarBg}>
                      <View style={[
                        styles.progressBarFill,
                        {
                          width: `${(timeLeft / 120) * 100}%`,
                          backgroundColor: isExpired ? "#FF5252" : "#00BCD4"
                        }
                      ]} />
                    </View>

                    <View style={styles.metaInfo}>
                      <View style={styles.metaItem}>
                        <Ionicons name="wifi-outline" size={14} color="#666" />
                        <Text style={styles.metaText}>{ip}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="shield-checkmark-outline" size={14} color="#666" />
                        <Text style={styles.metaText}>Secure Link</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.cancelButton} onPress={cancelQR}>
                    <Text style={styles.cancelText}>{isExpired ? "GENERATE NEW QR" : "DISCARD SESSION"}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                <View style={styles.infoBox}>
                  <View style={styles.infoIconBg}>
                    <Feather name="info" size={24} color="#00BCD4" />
                  </View>
                  <Text style={styles.infoBoxTitle}>How it works</Text>
                  <Text style={styles.infoBoxText}>
                    This QR code includes your network identity and subject data.
                    Students must be on the same network to scan successfully.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 20 : 50,
    marginBottom: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  mainContent: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 30,
  },
  formContainer: {
    marginBottom: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    height: 60,
    marginBottom: 20,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  primaryButton: {
    height: 60,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrDisplayArea: {
    alignItems: 'center',
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 30,
    position: 'relative',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  qrExpired: {
    shadowColor: '#FF5252',
    opacity: 0.8,
  },
  qrShadow: {
    backgroundColor: 'white',
  },
  expiredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiredOverlayText: {
    color: '#FF5252',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 10,
    letterSpacing: 2,
  },
  statusPanel: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    padding: 20,
    marginTop: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 15,
  },
  timerText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelText: {
    color: '#FF5252',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  infoBox: {
    backgroundColor: 'rgba(0,188,212,0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,188,212,0.1)',
  },
  infoIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(0,188,212,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoBoxTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoBoxText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
});
