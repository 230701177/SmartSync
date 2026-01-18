import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function RoleSelectionScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [scaleAnim] = useState(new Animated.Value(1));


  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Simple feedback animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigation.navigate('Login', { role: selectedRole });
    }
  };

  return (
    <LinearGradient
      colors={['#0A0E21', '#121212']} // Navy to Charcoal
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.smallLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Select Your Role</Text>
          <Text style={styles.subtitle}>Choose how you want to continue</Text>
        </View>

        {/* Role Cards */}
        <View style={styles.cardsContainer}>
          {/* Student Card */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.card,
              selectedRole === 'Student' && styles.selectedCardStudent
            ]}
            onPress={() => handleRoleSelect('Student')}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(0, 188, 212, 0.1)' }]}>
              <MaterialCommunityIcons
                name="school-outline"
                size={40}
                color={selectedRole === 'Student' ? '#00BCD4' : '#666'}
              />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, selectedRole === 'Student' && { color: '#00BCD4' }]}>
                Student
              </Text>
              <Text style={styles.cardDesc}>Mark attendance & view timetable</Text>
            </View>
            {selectedRole === 'Student' && (
              <Ionicons name="checkmark-circle" size={24} color="#00BCD4" style={styles.checkIcon} />
            )}
          </TouchableOpacity>

          {/* Faculty Card */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.card,
              selectedRole === 'Faculty' && styles.selectedCardFaculty
            ]}
            onPress={() => handleRoleSelect('Faculty')}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
              <MaterialCommunityIcons
                name="account-tie-outline"
                size={40}
                color={selectedRole === 'Faculty' ? '#FF9800' : '#666'}
              />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, selectedRole === 'Faculty' && { color: '#FF9800' }]}>
                Faculty
              </Text>
              <Text style={styles.cardDesc}>Create sessions & manage attendance</Text>
            </View>
            {selectedRole === 'Faculty' && (
              <Ionicons name="checkmark-circle" size={24} color="#FF9800" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        </View>

        {/* Action Button & Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            disabled={!selectedRole}
            onPress={handleContinue}
            activeOpacity={0.8}
            style={[styles.continueButton, !selectedRole && styles.disabledButton]}
          >
            <LinearGradient
              colors={selectedRole ? ['#2196F3', '#1976D2'] : ['#333', '#222']}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>CONTINUE</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.securityMessage}>
            <Ionicons name="lock-closed-outline" size={14} color="#666" />
            <Text style={styles.securityText}>Role-based access is enforced for security</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  smallLogo: {
    width: 240,
    height: 200,
    borderRadius: 30, // Curving the edges
    marginBottom: 15,
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    marginTop: 4,
  },
  cardsContainer: {
    gap: 20,
    marginVertical: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  selectedCardStudent: {
    borderColor: '#00BCD4',
    borderWidth: 2,
    backgroundColor: 'rgba(0, 188, 212, 0.05)',
  },
  selectedCardFaculty: {
    borderColor: '#FF9800',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDesc: {
    color: '#888',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  checkIcon: {
    marginLeft: 10,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    height: 60,
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  securityMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
  securityText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 6,
  },
});