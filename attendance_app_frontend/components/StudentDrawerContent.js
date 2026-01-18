import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function StudentDrawerContent(props) {
  const navigation = useNavigation();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {/* Student Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileIcon}>
          <Ionicons name="person" size={60} color="#FFF" />
        </View>
        <Text style={styles.name}>Manoharan</Text>
        <Text style={styles.department}>Computer Science</Text>
        <Text style={styles.id}>ID: 230701177</Text>
      </View>

      {/* Main Drawer Items */}
      <View style={styles.drawerItems}>
        <DrawerItemList {...props} />
      </View>
      {/* Logout */}
      <TouchableOpacity
        style={[styles.drawerItem, styles.logoutButton]}
        onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'RoleSelection' }],
        })}
      >
        <Ionicons name="log-out" size={24} color="#FFF" />
        <Text style={styles.drawerText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  profileIcon: {
    backgroundColor: '#333',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  department: {
    color: '#BBB',
    fontSize: 14,
    marginBottom: 5,
  },
  id: {
    color: '#888',
    fontSize: 12,
  },
  drawerItems: {
    flex: 1,
    marginTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  drawerText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    marginTop: 'auto',
    backgroundColor: '#D32F2F',
  },
});