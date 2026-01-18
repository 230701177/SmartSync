import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Screens
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import FacultyHome from './screens/FacultyHome';
import StudentHome from './screens/StudentHome';
import QRScannerScreen from './screens/QRScannerScreen';
import TimetableScreen from './screens/TimetableScreen';
import HeadcountVerification from './screens/HeadcountVerification';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import BiometricAuthScreen from './screens/BiometricAuthScreen';
import QRCreate from './screens/QRCreate';
import SuccessScreen from './screens/SuccessScreen';
import AttendanceReportsScreen from './screens/AttendanceReportsScreen';
import ClassManagementScreen from './screens/ClassManagementScreen';
import MyAttendanceScreen from './screens/MyAttendanceScreen';
import AttendanceHistoryScreen from './screens/AttendanceHistoryScreen';
import FaceRecognitionScreen from './screens/FaceRecognitionScreen';


// Drawer Components
import CustomDrawerContent from './screens/CustomDrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function FacultyApp() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#121212', width: 240 },
        drawerLabelStyle: { color: '#fff', fontSize: 16, marginLeft: -10 },
        drawerActiveTintColor: '#4CAF50',
        drawerInactiveTintColor: '#BBB',
        drawerActiveBackgroundColor: 'rgba(76, 175, 80, 0.1)',
      }}
    >
      <Drawer.Screen
        name="FacultyHome"
        component={FacultyHome}
        options={{
          title: 'Home',
          drawerIcon: ({ color }) => <Ionicons name="home" size={20} color={color} />
        }}
      />
      <Drawer.Screen
        name="AttendanceReports"
        component={AttendanceReportsScreen}
        options={{
          drawerLabel: 'Attendance Reports',
          drawerIcon: ({ color }) => <Ionicons name="analytics" size={20} color={color} />
        }}
      />
      <Drawer.Screen
        name="ClassManagement"
        component={ClassManagementScreen}
        options={{
          drawerLabel: 'Manage Classes',
          drawerIcon: ({ color }) => <Ionicons name="people" size={20} color={color} />
        }}
      />
      <Drawer.Screen
        name="Timetable"
        component={TimetableScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="calendar" size={20} color={color} />
        }}
      />
      <Drawer.Screen
        name="HeadcountVerification"
        component={HeadcountVerification}
        options={{
          drawerLabel: 'Headcount Verification',
          drawerIcon: ({ color }) => <Ionicons name="people" size={20} color={color} />
        }}
      />
    </Drawer.Navigator>
  );
}

function StudentApp() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#121212', width: 240 },
        drawerLabelStyle: { color: '#fff', fontSize: 16, marginLeft: -10 },
        drawerActiveTintColor: '#4CAF50',
        drawerInactiveTintColor: '#BBB',
        drawerActiveBackgroundColor: 'rgba(76, 175, 80, 0.1)',
      }}
    >
      <Drawer.Screen
        name="StudentHome"
        component={StudentHome}
        options={{
          title: 'Home',
          drawerIcon: ({ color }) => <Ionicons name="home" size={20} color={color} />
        }}
      />
      <Drawer.Screen
        name="MyAttendance"
        component={MyAttendanceScreen}
        options={{
          drawerLabel: 'My Attendance',
          drawerIcon: ({ color }) => <Ionicons name="calendar" size={20} color={color} />
        }}
      />
      <Drawer.Screen
        name="AttendanceHistory"
        component={AttendanceHistoryScreen}
        options={{
          drawerLabel: 'Attendance Logs',
          drawerIcon: ({ color }) => <Ionicons name="time-outline" size={20} color={color} />
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#121212' }
          }}
          initialRouteName="BiometricAuth"
        >
          <Stack.Screen name="BiometricAuth" component={BiometricAuthScreen} />
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />

          {/* Drawer apps */}
          <Stack.Screen name="FacultyApp" component={FacultyApp} />
          <Stack.Screen name="StudentApp" component={StudentApp} />

          {/* Standalone screens */}
          <Stack.Screen name="QRCreate" component={QRCreate} />
          <Stack.Screen name="Success" component={SuccessScreen} />
          <Stack.Screen name="AttendanceReports" component={AttendanceReportsScreen} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
          <Stack.Screen name="FaceRecognitionScreen" component={FaceRecognitionScreen} />
        </Stack.Navigator>

      </NavigationContainer>
    </SafeAreaView>
  );
}