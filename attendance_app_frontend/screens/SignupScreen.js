import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function SignupScreen({ navigation, route }) {
  const { role: initialRole } = route.params || { role: 'Student' };
  const [role, setRole] = useState(initialRole);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Student Fields
  const [regNumber, setRegNumber] = useState('');
  const [studentDept, setStudentDept] = useState('');
  const [yearSem, setYearSem] = useState('');

  // Faculty Fields
  const [staffId, setStaffId] = useState('');
  const [facultyDept, setFacultyDept] = useState('');
  const [designation, setDesignation] = useState('');

  // Options
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = () => {
    // Basic Validation
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Success', {
        title: "Account Created!",
        message: "Your account has been successfully registered. You can now start using the Smart Sync Attendance system.",
        redirectTo: role === 'Faculty' ? 'FacultyApp' : 'StudentApp'
      });
    }, 1500);
  };

  const renderInput = (icon, placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default') => (
    <View style={styles.inputWrapper}>
      <Ionicons name={icon} size={20} color="#888" style={styles.inputIcon} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#666"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={28} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Register to access Smart Sync Attendance</Text>
            </View>
          </View>

          {/* Role Header Badge */}
          <View style={styles.roleHeaderBadge}>
            <Text style={[styles.roleBadgeText, { color: role === 'Student' ? '#00BCD4' : '#FF9800' }]}>
              {role.toUpperCase()} ACCOUNT REGISTRATION
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Personal Information</Text>
            {renderInput("person-outline", "Full Name", fullName, setFullName)}
            {renderInput("mail-outline", "Institutional Email ID", email, setEmail, false, "email-address")}

            {role === 'Student' ? (
              <>
                <Text style={styles.sectionLabel}>Academic Details</Text>
                {renderInput("card-outline", "Register Number / Roll Number", regNumber, setRegNumber)}
                {renderInput("business-outline", "Department (e.g., CSE)", studentDept, setStudentDept)}
                {renderInput("calendar-outline", "Year / Semester (e.g., 3/5)", yearSem, setYearSem)}
              </>
            ) : (
              <>
                <Text style={styles.sectionLabel}>Professional Details</Text>
                {renderInput("id-card-outline", "Staff Code", staffId, setStaffId)}
                {renderInput("business-outline", "Department", facultyDept, setFacultyDept)}
                {renderInput("briefcase-outline", "Designation (e.g., Asst. Professor)", designation, setDesignation)}
              </>
            )}

            <Text style={styles.sectionLabel}>Security</Text>
            {renderInput("lock-closed-outline", "Password", password, setPassword, true)}
            {renderInput("shield-checkmark-outline", "Confirm Password", confirmPassword, setConfirmPassword, true)}

            {/* Biometric Toggle */}
            <TouchableOpacity
              style={styles.biometricToggle}
              onPress={() => setBiometricEnabled(!biometricEnabled)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={biometricEnabled ? "checkbox" : "square-outline"}
                size={24}
                color={biometricEnabled ? "#00BCD4" : "#666"}
              />
              <View style={styles.biometricLabelContainer}>
                <Text style={styles.biometricLabel}>Enable biometric login</Text>
                <Text style={styles.biometricSublabel}>Used for faster and secure access</Text>
              </View>
            </TouchableOpacity>

            {/* Face Data Consent */}
            <View style={styles.consentBox}>
              <Ionicons name="information-circle-outline" size={18} color="#888" />
              <Text style={styles.consentText}>
                Facial data is stored as encrypted vectors only.
              </Text>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <LinearGradient
                colors={role === 'Student' ? ['#00BCD4', '#0097A7'] : ['#FF9800', '#F57C00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signupGradient}
              >
                <Text style={styles.signupButtonText}>
                  {isLoading ? 'REGISTERING...' : 'REGISTER'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.loginText, { color: role === 'Student' ? '#00BCD4' : '#FF9800' }]}>Login</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  roleHeaderBadge: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  roleBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  formSection: {
    gap: 12,
  },
  sectionLabel: {
    color: '#555',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 4,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  biometricToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  biometricLabelContainer: {
    marginLeft: 12,
  },
  biometricLabel: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  biometricSublabel: {
    color: '#666',
    fontSize: 12,
  },
  consentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    opacity: 0.6,
    paddingHorizontal: 5,
  },
  consentText: {
    color: '#CCC',
    fontSize: 11,
    marginLeft: 6,
  },
  signupButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  signupGradient: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#888',
    fontSize: 15,
  },
  loginText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});