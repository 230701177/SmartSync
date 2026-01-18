import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  Modal,
  Image,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function StudentHome() {
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profileVisible, setProfileVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const overallAttendance = 82;
  const subjects = [
    { name: "Operating Systems", attendance: 78, color: '#00BCD4' },
    { name: "Internet Of Things", attendance: 65, color: '#FF9800' },
    { name: "Design Thinking", attendance: 92, color: '#4CAF50' },
  ];

  return (
    <LinearGradient colors={['#0A0E21', '#121212']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* 1️⃣ Header Section */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
              <Ionicons name="menu" size={28} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.greeting}>Hello, Manoharan</Text>
              <Text style={styles.studentInfo}>230701177 • CSE (V Sem)</Text>
            </View>
          </View>

          <View style={styles.dateTimeContainer}>
            <View style={styles.clockIconContainer}>
              <Ionicons name="calendar-clear" size={16} color="#00BCD4" />
              <Text style={styles.dateText}>
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </Text>
            </View>
            <View style={styles.timeWrapper}>
              <Text style={styles.timeText}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          </View>

          {/* 2️⃣ Quick Actions Panel (Propelled to Top) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Main Actions</Text>
          </View>
          <View style={styles.actionGrid}>
            <ActionItem
              icon="qr-code-outline"
              label="Check-in"
              color="#00BCD4"
              onPress={() => navigation.navigate("QRScanner")}
            />
            <ActionItem
              icon="time-outline"
              label="History"
              color="#4CAF50"
              onPress={() => navigation.navigate("AttendanceHistory")}
            />
            <ActionItem
              icon="analytics-outline"
              label="My Progress"
              color="#E91E63"
              onPress={() => navigation.navigate("MyAttendance")}
            />
            <ActionItem
              icon="person-outline"
              label="Profile"
              color="#FF9800"
              onPress={() => setProfileVisible(true)}
            />
          </View>

          {/* 3️⃣ Attendance Snapshot Widget */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Attendance Status</Text>
            <TouchableOpacity onPress={() => navigation.navigate("MyAttendance")}>
              <Text style={styles.viewMore}>View Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.snapshotCard}>
            <View style={styles.overallContainer}>
              <View style={styles.circlePlaceholder}>
                <Text style={styles.overallPercent}>{overallAttendance}%</Text>
                <Text style={styles.overallLabel}>Overall</Text>
              </View>
              <View style={styles.subjectList}>
                {subjects.map((sub, i) => (
                  <View key={i} style={styles.subjectProgressItem}>
                    <View style={styles.subjectMeta}>
                      <Text style={styles.subjectSmallName}>{sub.name}</Text>
                      <Text style={[styles.subjectSmallPercent, { color: sub.color }]}>{sub.attendance}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${sub.attendance}%`, backgroundColor: sub.color }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* 4️⃣ Notifications & Alerts */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
          </View>
          <View style={styles.alertItem}>
            <View style={[styles.alertIconBg, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
              <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Attendance Marked Successfully</Text>
              <Text style={styles.alertTime}>Today, 09:15 AM • Operating Systems</Text>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>

      {/* Profile Detail Modal */}
      <Modal
        visible={profileVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setProfileVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setProfileVisible(false)}
        >
          <View style={styles.profileModalContent}>
            <LinearGradient
              colors={['#1F2A44', '#0A0E21']}
              style={styles.profileModalHeader}
            >
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setProfileVisible(false)}
              >
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>

              <View style={styles.profileImageLargeWrapper}>
                <Image
                  source={require('../assets/profile.png')}
                  style={styles.profileImageLarge}
                />
                <View style={styles.activeStatusDot} />
              </View>

              <Text style={styles.profileModalName}>Manoharan</Text>
              <Text style={styles.profileModalRole}>Undergraduate Student</Text>
            </LinearGradient>

            <View style={styles.profileModalBody}>
              <ProfileInfoRow icon="card-outline" label="Register Number" value="230701177" color="#00BCD4" />
              <ProfileInfoRow icon="business-outline" label="Department" value="Computer Science & Engineering" color="#4CAF50" />
              <ProfileInfoRow icon="school-outline" label="Current Semester" value="Semester V" color="#FF9800" />
              <ProfileInfoRow icon="mail-outline" label="Email Address" value="230701177@rajalakshmi.edu.in" color="#E91E63" />

              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={() => setProfileVisible(false)}
              >
                <Text style={styles.editProfileText}>Academic Verification Done</Text>
                <Ionicons name="cloud-done" size={20} color="#00BCD4" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

function ProfileInfoRow({ icon, label, value, color }) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIconBg, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function ActionItem({ icon, label, color, onPress }) {
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: `${color}15`, borderColor: `${color}40` }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 45 : 55,
    marginBottom: 20,
  },
  menuButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerInfo: {
    marginLeft: 12,
  },
  greeting: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  studentInfo: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  dateTimeContainer: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  clockIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    color: '#AAA',
    fontSize: 14,
    fontWeight: '500',
  },
  timeWrapper: {
    backgroundColor: 'rgba(0, 188, 212, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: {
    color: '#00BCD4',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  liveCardContainer: {
    marginTop: 25,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  liveCard: {
    padding: 24,
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E91E63',
    marginRight: 6,
  },
  liveTagText: {
    color: '#E91E63',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  timeLeft: {
    color: '#AAA',
    fontSize: 12,
  },
  liveSubject: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  liveDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#CCC',
    fontSize: 14,
    marginLeft: 8,
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  joinButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  joinGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  joinText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  viewMore: {
    color: '#00BCD4',
    fontSize: 14,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    width: (width - 40) / 4.2,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
  },
  actionLabel: {
    color: '#BBB',
    fontSize: 11,
    fontWeight: '600',
  },
  snapshotCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  overallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circlePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  overallPercent: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  overallLabel: {
    color: '#888',
    fontSize: 10,
    marginTop: 2,
  },
  subjectList: {
    flex: 1,
    gap: 12,
  },
  subjectProgressItem: {
    flex: 1,
  },
  subjectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  subjectSmallName: {
    color: '#AAA',
    fontSize: 12,
  },
  subjectSmallPercent: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  monitorCard: {
    backgroundColor: 'rgba(0, 188, 212, 0.05)',
    borderRadius: 16,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 188, 212, 0.2)',
  },
  monitorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  monitorTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  monitorRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statLabel: {
    color: '#BBB',
    fontSize: 12,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  suggestionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  suggestionDesc: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  startButton: {
    marginLeft: 10,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 10,
  },
  alertIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  alertTime: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileModalContent: {
    width: '100%',
    backgroundColor: '#0A0E21',
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,188,212,0.2)',
    elevation: 20,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  profileModalHeader: {
    padding: 30,
    alignItems: 'center',
    position: 'relative',
  },
  closeModalButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 5,
  },
  profileImageLargeWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImageLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00BCD4',
  },
  activeStatusDot: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#0A0E21',
  },
  profileModalName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileModalRole: {
    color: '#00BCD4',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: 5,
    textTransform: 'uppercase',
  },
  profileModalBody: {
    padding: 25,
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    color: '#EEE',
    fontSize: 15,
    fontWeight: '600',
  },
  editProfileButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  editProfileText: {
    color: '#AAA',
    fontSize: 14,
    fontWeight: '600',
  },
});