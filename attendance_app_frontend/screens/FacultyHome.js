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
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

const { width } = Dimensions.get('window');

export default function FacultyHome() {
  const navigation = useNavigation();
  const [profileVisible, setProfileVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Sample data for calendar
  const markedDates = {
    '2025-04-25': {
      marked: true,
      dotColor: '#4CAF50',
      classes: [
        { name: "Java Programming", time: "09:00 AM - 10:00 AM", room: "CS-101", type: 'Lecture' },
        { name: "Design & Analysis of Algorithms", time: "02:00 PM - 03:00 PM", room: "CS-201", type: 'Lab' }
      ]
    },
    '2025-04-26': {
      marked: true,
      dotColor: '#4CAF50',
      classes: [
        { name: "Data Structures", time: "11:00 AM - 12:00 PM", room: "CS-105", type: 'Lecture' }
      ]
    },
    '2025-04-27': {
      selected: true,
      marked: true,
      dotColor: '#FFF',
      selectedColor: '#00BCD4',
      classes: [
        { name: "Operating Systems", time: "10:00 AM - 11:00 AM", room: "CS-301", type: 'Lecture' },
        { name: "Database Systems", time: "03:00 PM - 04:00 PM", room: "CS-202", type: 'Seminar' }
      ]
    },
  };

  const facultyStats = [
    { label: 'Classes Today', value: '3', icon: 'book', color: '#00BCD4' },
    { label: 'Avg Attendance', value: '88%', icon: 'trending-up', color: '#4CAF50' },
    { label: 'Pending Reports', value: '1', icon: 'clipboard', color: '#FF9800' },
  ];

  return (
    <LinearGradient colors={['#0A0E21', '#121212']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* 1️⃣ Header Section */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
              <Ionicons name="menu" size={28} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.greeting}>Welcome, Dr. Kumar</Text>
              <Text style={styles.deptInfo}>Senior Professor • CSE Dept</Text>
            </View>
            <TouchableOpacity
              onPress={() => setProfileVisible(true)}
              style={styles.headerProfile}
            >
              <View style={styles.profileAvatarBorder}>
                <Image
                  source={require('../assets/profile.png')}
                  style={styles.profileAvatar}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* 2️⃣ Date & Time Banner */}
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateWrapper}>
              <Ionicons name="calendar-outline" size={16} color="#00BCD4" />
              <Text style={styles.dateText}>
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </Text>
            </View>
            <View style={styles.timeWrapper}>
              <Text style={styles.timeText}>
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>

          {/* 3️⃣ Quick Stats Row */}
          <View style={styles.statsRow}>
            {facultyStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIconBg, { backgroundColor: `${stat.color}15` }]}>
                  <Feather name={stat.icon} size={18} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* 4️⃣ Main Actions Grid */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dashboard Actions</Text>
          </View>
          <View style={styles.actionGrid}>
            <ActionItem
              icon="people-outline"
              label="Headcount"
              color="#00BCD4"
              onPress={() => navigation.navigate("HeadcountVerification")}
            />
            <ActionItem
              icon="qr-code-outline"
              label="Create QR"
              color="#4CAF50"
              onPress={() => navigation.navigate("QRCreate")}
            />
            <ActionItem
              icon="analytics-outline"
              label="Reports"
              color="#FF9800"
              onPress={() => navigation.navigate("AttendanceReports")}
            />

          </View>

          {/* 5️⃣ Active Class Status */}
          <View style={styles.activeClassBanner}>
            <LinearGradient
              colors={['#1F2A44', '#121212']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.activeClassContent}
            >
              <View style={styles.activeClassBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.activeBadgeText}>ONGOING CLASS</Text>
              </View>
              <Text style={styles.activeClassName}>OS - Lab (Batch B)</Text>
              <View style={styles.activeClassFooter}>
                <View style={styles.activeMetaItem}>
                  <Ionicons name="location-outline" size={14} color="#888" />
                  <Text style={styles.activeMetaText}>Room 304</Text>
                </View>
                <View style={styles.activeMetaItem}>
                  <Ionicons name="time-outline" size={14} color="#888" />
                  <Text style={styles.activeMetaText}>Ends in 25m</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* 6️⃣ Calendar & Daily Schedule */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Class Schedule</Text>
          </View>

          <Calendar
            current={selectedDate}
            markedDates={markedDates}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'rgba(255,255,255,0.03)',
              textSectionTitleColor: '#666',
              selectedDayBackgroundColor: '#00BCD4',
              selectedDayTextColor: '#FFF',
              todayTextColor: '#00BCD4',
              dayTextColor: '#AAA',
              textDisabledColor: '#333',
              dotColor: '#00BCD4',
              selectedDotColor: '#FFF',
              arrowColor: '#00BCD4',
              monthTextColor: '#FFF',
              textDayFontWeight: '400',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '500',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13
            }}
            style={styles.calendar}
          />

          <View style={styles.scheduleList}>
            {markedDates[selectedDate]?.classes ? (
              markedDates[selectedDate].classes.map((cls, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.classCard}
                  onPress={() => navigation.navigate("HeadcountVerification", { className: cls.name })}
                >
                  <View style={[styles.classTypeIndicator, { backgroundColor: cls.type === 'Lab' ? '#E91E63' : '#4CAF50' }]} />
                  <View style={styles.classCardBody}>
                    <View style={styles.classHeader}>
                      <Text style={styles.classNameText}>{cls.name}</Text>
                      <Text style={styles.classTypeText}>{cls.type}</Text>
                    </View>
                    <View style={styles.classDetailsRow}>
                      <View style={styles.classDetailItem}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.classDetailText}>{cls.time}</Text>
                      </View>
                      <View style={styles.classDetailItem}>
                        <Ionicons name="location-outline" size={14} color="#666" />
                        <Text style={styles.classDetailText}>{cls.room}</Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#444" />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptySchedule}>
                <Ionicons name="cafe-outline" size={40} color="#333" />
                <Text style={styles.emptyText}>No classes scheduled for today</Text>
              </View>
            )}
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

              <Text style={styles.profileModalName}>Dr. Kumaragurubaran</Text>
              <Text style={styles.profileModalRole}>Senior Professor</Text>
            </LinearGradient>

            <View style={styles.profileModalBody}>
              <ProfileInfoRow icon="card-outline" label="Staff ID" value="STAFF_REC_007" color="#00BCD4" />
              <ProfileInfoRow icon="business-outline" label="Department" value="Computer Science & Engineering" color="#4CAF50" />
              <ProfileInfoRow icon="ribbon-outline" label="Designation" value="Head of Research Dept" color="#FF9800" />
              <ProfileInfoRow icon="mail-outline" label="Faculty Email" value="kumar.g@rajalakshmi.edu.in" color="#E91E63" />

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => setProfileVisible(false)}
              >
                <Text style={styles.logoutText}>Faculty Profile Verified</Text>
                <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

// Helper Components
function ActionItem({ icon, label, color, onPress }) {
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={[styles.actionIconContainer, { backgroundColor: `${color}15`, borderColor: `${color}30` }]}>
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    marginBottom: 20,
  },
  menuButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  greeting: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  deptInfo: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  headerProfile: {
    padding: 2,
  },
  profileAvatarBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(0,188,212,0.5)',
    padding: 2,
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  dateWrapper: {
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: {
    color: '#00BCD4',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  statCard: {
    width: (width - 60) / 3,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
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
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  actionItem: {
    alignItems: 'center',
    width: (width - 60) / 3,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
  },
  actionLabel: {
    color: '#AAA',
    fontSize: 11,
    fontWeight: '600',
  },
  activeClassBanner: {
    marginTop: 25,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,188,212,0.2)',
  },
  activeClassContent: {
    padding: 20,
  },
  activeClassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E91E63',
  },
  activeBadgeText: {
    color: '#E91E63',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  activeClassName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  activeClassFooter: {
    flexDirection: 'row',
    gap: 15,
  },
  activeMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activeMetaText: {
    color: '#888',
    fontSize: 12,
  },
  calendar: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  scheduleList: {
    gap: 12,
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  classTypeIndicator: {
    width: 4,
    height: '60%',
    borderRadius: 2,
    marginRight: 12,
  },
  classCardBody: {
    flex: 1,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  classNameText: {
    color: '#EEE',
    fontSize: 15,
    fontWeight: '600',
  },
  classTypeText: {
    color: '#666',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  classDetailsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  classDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  classDetailText: {
    color: '#888',
    fontSize: 12,
  },
  emptySchedule: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
  },
  emptyText: {
    color: '#444',
    fontSize: 14,
    marginTop: 10,
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileModalRole: {
    color: '#00BCD4',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: 5,
    textTransform: 'uppercase',
  },
  profileModalBody: {
    padding: 24,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconBg: {
    width: 40,
    height: 40,
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
    fontSize: 11,
    marginBottom: 2,
  },
  infoValue: {
    color: '#EEE',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.1)',
  },
  logoutText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
});