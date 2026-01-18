import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function FacultyDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {/* Faculty Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileIcon}>
          <Ionicons name="person-circle-outline" size={80} color="#4CAF50" />
        </View>
        <Text style={styles.name}>Dr. Kumaragurubaran</Text>
        <Text style={styles.department}>Computer Science Engineering</Text>
        <Text style={styles.email}>kumaragurubaran@rajalakshmi.edu.in</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Main Drawer Items */}
      <View style={styles.drawerItems}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('FacultyHome')}
          activeOpacity={0.8}
        >
          <Ionicons name="home-outline" size={22} color="#FFF" />
          <Text style={styles.drawerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('ClassManagement')}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={22} color="#FFF" />
          <Text style={styles.drawerText}>Manage Classes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Timetable')}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={22} color="#FFF" />
          <Text style={styles.drawerText}>Timetable</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('AttendanceReports')}
          activeOpacity={0.8}
        >
          <Ionicons name="analytics-outline" size={22} color="#FFF" />
          <Text style={styles.drawerText}>Attendance Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('HeadcountVerification')}
          activeOpacity={0.8}
        >
          <Ionicons name="people-outline" size={22} color="#FFF" />
          <Text style={styles.drawerText}>Headcount Verification</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => props.navigation.reset({
          index: 0,
          routes: [{ name: 'RoleSelection' }],
        })}
        activeOpacity={0.8}
      >
        <Ionicons name="exit-outline" size={24} color="#FFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  profileSection: {
    paddingVertical: 30,
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  profileIcon: {
    backgroundColor: '#2C2C2C',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  name: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  department: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 2,
  },
  email: {
    color: '#777',
    fontSize: 12,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  drawerItems: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 0,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#2C2C2C',
    marginBottom: 12,
    borderRadius: 8,
  },
  drawerText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});