import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Platform,
  Dimensions
} from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Determine role and user info (Mock logic - in real app would come from Auth Context)
  const isFaculty = props.state.routeNames.includes('FacultyHome');
  const roleColor = isFaculty ? '#FF9800' : '#00BCD4';
  const roleGradient = isFaculty ? ['#3D2B1F', '#0A0E21'] : ['#1F2A44', '#0A0E21'];

  const userInfo = isFaculty ? {
    name: "Dr. Rajesh Kumar",
    label1: "School of Computing",
    label2: "FC00582",
    label1Title: "DEPT",
    label2Title: "STAFF CODE"
  } : {
    name: "Manoharan",
    label1: "CSE",
    label2: "230701177",
    label1Title: "DEPT",
    label2Title: "REG NO"
  };

  // 1. Change Password
  const handleChangePassword = () => {
    setSettingsVisible(false);
    setChangePasswordVisible(true);
  };

  const submitPasswordChange = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters");
      return;
    }
    Alert.alert("Success", "Password changed successfully!");
    setChangePasswordVisible(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // 2. Export Attendance Data
  const exportAttendanceData = async (format = 'csv') => {
    setSettingsVisible(false);
    try {
      const attendanceData = await AsyncStorage.getItem('attendanceData') || 'Date,Status\n2023-01-01,Present';

      let content = '';
      let filename = '';

      if (format === 'csv') {
        content = attendanceData;
        filename = 'attendance.csv';
      } else if (format === 'txt') {
        content = attendanceData.replace(/,/g, '  ');
        filename = 'attendance.txt';
      }

      const fileUri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing not available on this device");
        return;
      }

      await Sharing.shareAsync(fileUri, { mimeType: format === 'csv' ? 'text/csv' : 'text/plain' });
    } catch (error) {
      Alert.alert("Error", "Failed to export data: " + error.message);
    }
  };

  // 3. Reset App Data
  const resetAppData = () => {
    setSettingsVisible(false);
    Alert.alert(
      "Reset App Data",
      "This will delete all your local data. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Success", "App data has been reset");
            } catch (error) {
              Alert.alert("Error", "Failed to reset data");
            }
          }
        }
      ]
    );
  };

  // 4. Logout
  const handleLogout = () => {
    setSettingsVisible(false);
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'RoleSelection' }],
            });
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0E21" }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Profile Header Block */}
        <LinearGradient
          colors={roleGradient}
          style={styles.profileHeader}
        >
          <View style={styles.profileImageWrapper}>
            <Image
              source={require('../assets/profile.png')}
              style={[styles.profileImage, { borderColor: roleColor }]}
            />
            <View style={styles.onlineBadge} />
          </View>

          <Text style={[styles.welcomeText, { color: roleColor }]}>WELCOME BACK</Text>
          <Text style={styles.nameText}>{userInfo.name}</Text>

          <View style={styles.infoBadgeContainer}>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>{userInfo.label1}</Text>
            </View>
            <View style={[styles.infoBadge, { backgroundColor: `${roleColor}15` }]}>
              <Text style={[styles.infoBadgeText, { color: roleColor }]}>{userInfo.label2}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Drawer Items List */}
        <View style={styles.itemsContainer}>
          <DrawerItemList
            {...props}
            activeTintColor={roleColor}
            inactiveTintColor="#AAA"
            activeBackgroundColor={`${roleColor}15`}
            itemStyle={styles.drawerItemStyle}
            labelStyle={styles.drawerLabelStyle}
          />
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => setSettingsVisible(true)}
          >
            <View style={[styles.footerIconBg, { backgroundColor: `${roleColor}15` }]}>
              <Ionicons name="settings-outline" size={20} color={roleColor} />
            </View>
            <Text style={styles.footerLabel}>App Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerItem, { marginTop: 10 }]}
            onPress={handleLogout}
          >
            <View style={[styles.footerIconBg, { backgroundColor: 'rgba(255, 82, 82, 0.1)' }]}>
              <Ionicons name="log-out-outline" size={20} color="#FF5252" />
            </View>
            <Text style={[styles.footerLabel, { color: '#FF5252' }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* Modern Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSettingsVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Security & Data</Text>

            <View style={styles.optionsGrid}>
              <SettingsOption
                icon="key-outline"
                title="Security"
                subtitle="Change password"
                roleColor={roleColor}
                onPress={handleChangePassword}
              />
              <SettingsOption
                icon="download-outline"
                title="Data Export"
                subtitle="Sync to CSV"
                roleColor={roleColor}
                onPress={() => exportAttendanceData('csv')}
              />
              <SettingsOption
                icon="document-text-outline"
                title="Logs"
                subtitle="Sync to Text"
                roleColor={roleColor}
                onPress={() => exportAttendanceData('txt')}
              />
              <SettingsOption
                icon="trash-outline"
                title="Reset"
                subtitle="Wipe all data"
                danger
                onPress={resetAppData}
              />
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSettingsVisible(false)}
            >
              <Text style={styles.closeButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={changePasswordVisible}
        onRequestClose={() => setChangePasswordVisible(false)}
      >
        <View style={styles.centerModalOverlay}>
          <View style={styles.passwordModalContent}>
            <Text style={styles.modalTitle}>Secure Update</Text>
            <Text style={styles.modalSubtitle}>Enter your new credentials below</Text>

            <TextInput
              style={styles.darkInput}
              placeholder="Current Password"
              placeholderTextColor="#666"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />

            <TextInput
              style={styles.darkInput}
              placeholder="New Secure Password"
              placeholderTextColor="#666"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TextInput
              style={[styles.darkInput, { marginBottom: 25 }]}
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setChangePasswordVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={submitPasswordChange}
              >
                <LinearGradient
                  colors={['#00BCD4', '#0097A7']}
                  style={styles.modalSubmitGradient}
                >
                  <Text style={styles.modalSubmitText}>Update</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function SettingsOption({ icon, title, subtitle, onPress, danger, roleColor }) {
  return (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={[styles.optionIconBg, danger ? { backgroundColor: 'rgba(255, 82, 82, 0.1)' } : { backgroundColor: `${roleColor}15` }]}>
        <Ionicons name={icon} size={22} color={danger ? "#FF5252" : roleColor} />
      </View>
      <View>
        <Text style={[styles.optionTitle, danger && { color: '#FF5252' }]}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#00BCD4',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#0A0E21',
  },
  welcomeText: {
    color: '#00BCD4',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 5,
  },
  nameText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoBadgeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  infoBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoBadgeText: {
    color: '#AAA',
    fontSize: 12,
    fontWeight: '600',
  },
  itemsContainer: {
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  drawerItemStyle: {
    borderRadius: 12,
    marginVertical: 4,
  },
  drawerLabelStyle: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: -10,
  },
  footer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 20,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 188, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  footerLabel: {
    color: '#AAA',
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1D2E',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  optionsGrid: {
    gap: 15,
    marginBottom: 25,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  optionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 188, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  optionSubtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#AAA',
    fontSize: 14,
    fontWeight: 'bold',
  },
  centerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  passwordModalContent: {
    width: '100%',
    backgroundColor: '#121629',
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 188, 212, 0.2)',
  },
  modalSubtitle: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
  },
  darkInput: {
    backgroundColor: '#0A0E21',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 54,
    color: '#FFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 15,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 15,
  },
  modalCancelButton: {
    flex: 1,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  modalCancelText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSubmitButton: {
    flex: 1,
    height: 54,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalSubmitGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});