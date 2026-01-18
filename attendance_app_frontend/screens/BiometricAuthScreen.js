import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function BiometricAuthScreen({ navigation }) {
  const [status, setStatus] = useState('pending');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for the biometric icon
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const handleBiometric = useCallback(async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setStatus('failure');
        navigation.replace('RoleSelection');
        return;
      }

      setStatus('pending');
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify your identity',
        disableDeviceFallback: true,
      });

      if (success) {
        setStatus('success');
        setTimeout(() => {
          navigation.replace('RoleSelection');
        }, 800);
      } else {
        setStatus('failure');
      }
    } catch (error) {
      console.error('Biometric error:', error);
      setStatus('failure');
    }
  }, [navigation]);

  const handlePasswordSubmit = () => {
    if (password === '1234') { // Mock verification
      setIsModalVisible(false);
      setStatus('success');
      setTimeout(() => {
        navigation.replace('RoleSelection');
      }, 500);
    } else {
      Alert.alert('Error', 'Incorrect Password');
    }
  };

  useEffect(() => {
    handleBiometric();
  }, [handleBiometric]);

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return { color: '#4CAF50', text: 'Authentication Successful', icon: 'checkmark-circle' };
      case 'failure':
        return { color: '#FF5252', text: 'Authentication Failed. Try again', icon: 'alert-circle' };
      default:
        return { color: '#00BCD4', text: 'System Ready', icon: 'fingerprint' };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={styles.container}>
      {/* Security Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/authentication.png')}
          style={styles.securityImage}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Secure Authentication</Text>
        <Text style={styles.headerSubtitle}>Verify your identity to continue</Text>
      </View>

      {/* Central Biometric Icon */}
      <View style={styles.centerSection}>
        <Animated.View style={[styles.iconPulse, { transform: [{ scale: pulseAnim }], borderColor: config.color }]}>
          <MaterialCommunityIcons
            name={Platform.OS === 'ios' ? 'face-recognition' : 'fingerprint'}
            size={80}
            color="#FFF"
          />
        </Animated.View>

        <View style={styles.statusContainer}>
          {status !== 'pending' && <Ionicons name={config.icon} size={20} color={config.color} />}
          <Text style={[styles.statusText, { color: config.color }]}>{config.text}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.authButton}
          onPress={handleBiometric}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#00BCD4', '#0097A7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Text style={styles.authButtonText}>Authenticate using Biometrics</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fallbackButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.fallbackText}>Use Password Instead</Text>
        </TouchableOpacity>

        {/* Demo Access Section */}
        <View style={styles.demoSection}>
          <View style={styles.demoDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.demoDividerText}>OR QUICK DEMO</Text>
            <View style={styles.dividerLine} />
          </View>
          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={[styles.demoLink, { borderColor: '#00BCD4' }]}
              onPress={() => navigation.replace('StudentApp')}
            >
              <Text style={[styles.demoLinkText, { color: '#00BCD4' }]}>Student Portal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.demoLink, { borderColor: '#FF9800' }]}
              onPress={() => navigation.replace('FacultyApp')}
            >
              <Text style={[styles.demoLinkText, { color: '#FF9800' }]}>Faculty Portal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Password Fallback Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContentWrapper}
          >
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Enter Password</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#888" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubtitle}>Please enter your password to continue</Text>

              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoFocus={true}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#00BCD4"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={handlePasswordSubmit}
              >
                <LinearGradient
                  colors={['#00BCD4', '#0097A7']}
                  style={styles.modalButtonGradient}
                >
                  <Text style={styles.modalButtonText}>VERIFY</Text>
                </LinearGradient>
              </TouchableOpacity>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E21', // Dark Navy / Charcoal
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
  },
  securityImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 16,
    marginTop: 8,
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPulse: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginBottom: 40,
    gap: 15,
  },
  authButton: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 60,
    elevation: 4,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  fallbackButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#00BCD4',
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContentWrapper: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 20,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0E21',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  modalButton: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 56,
  },
  modalButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  demoSection: {
    marginTop: 10,
    alignItems: 'center',
  },
  demoDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  demoDividerText: {
    color: '#555',
    fontSize: 10,
    fontWeight: 'bold',
    marginHorizontal: 10,
    letterSpacing: 1,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  demoLink: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  demoLinkText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
