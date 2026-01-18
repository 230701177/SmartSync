import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Enhanced Sample data for CSE department sections with stats
const cseSections = {
  'CSE A': {
    avgAttendance: 85,
    students: [
      { id: '1', name: 'Lingeswaran', rollNo: 'CS001', attendance: 85, trend: 'up' },
      { id: '2', name: 'Mokesh', rollNo: 'CS002', attendance: 78, trend: 'stable' },
      { id: '3', name: 'Karneesh', rollNo: 'CS003', attendance: 92, trend: 'up' },
    ]
  },
  'CSE B': {
    avgAttendance: 81,
    students: [
      { id: '4', name: 'Monic Auditya', rollNo: 'CS004', attendance: 88, trend: 'up' },
      { id: '5', name: 'Monish Dy', rollNo: 'CS005', attendance: 75, trend: 'down' },
      { id: '6', name: 'Mithesh', rollNo: 'CS006', attendance: 81, trend: 'stable' },
    ]
  },
  // Adding more mock data for fuller feel
  'CSE C': {
    avgAttendance: 84,
    students: [
      { id: '7', name: 'Kumaran', rollNo: 'CS007', attendance: 90, trend: 'up' },
      { id: '8', name: 'Arun', rollNo: 'CS008', attendance: 82, trend: 'stable' },
      { id: '9', name: 'Bala', rollNo: 'CS009', attendance: 79, trend: 'down' },
    ]
  }
};

export default function AttendanceReportsScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeSectionName, setActiveSectionName] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sectionsData = useMemo(() => {
    return Object.keys(cseSections).map(name => ({
      name,
      ...cseSections[name]
    }));
  }, []);

  const getAttendanceColor = (val) => {
    if (val >= 85) return '#4CAF50';
    if (val >= 75) return '#FF9800';
    return '#FF5252';
  };

  const renderStudentItem = ({ item }) => (
    <View style={styles.studentCard}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentRoll}>Roll: {item.rollNo}</Text>
      </View>
      <View style={styles.studentStats}>
        <Text style={[styles.studentPercent, { color: getAttendanceColor(item.attendance) }]}>
          {item.attendance}%
        </Text>
        <Ionicons
          name={item.trend === 'up' ? 'trending-up' : item.trend === 'down' ? 'trending-down' : 'remove'}
          size={16}
          color={item.trend === 'up' ? '#4CAF50' : item.trend === 'down' ? '#FF5252' : '#888'}
        />
      </View>
    </View>
  );

  const showSectionDetails = (sectionName) => {
    setActiveSectionName(sectionName);
    setModalVisible(true);
  };

  const filteredStudents = useMemo(() => {
    if (!activeSectionName) return [];
    const students = cseSections[activeSectionName].students;
    if (!searchQuery) return students;
    return students.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeSectionName, searchQuery]);

  return (
    <LinearGradient colors={['#0A0E21', '#121212']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Attendance Analytics</Text>
            <Text style={styles.headerSubtitle}>Computer Science Department</Text>
          </View>
        </View>

        {/* Overview Stats */}
        <View style={styles.overviewContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>83%</Text>
            <Text style={styles.statLabel}>Avg. Dept</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Alerts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>V Sem</Text>
            <Text style={styles.statLabel}>Batch</Text>
          </View>
        </View>

        {/* Sections List */}
        <FlatList
          data={sectionsData}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionCard}
              onPress={() => showSectionDetails(item.name)}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                style={styles.cardGradient}
              >
                <View style={styles.sectionHeaderLine}>
                  <View style={styles.sectionTitleBlock}>
                    <Text style={styles.sectionName}>{item.name}</Text>
                    <Text style={styles.studentCount}>{item.students.length} Students</Text>
                  </View>
                  <View style={[styles.avgBadge, { backgroundColor: `${getAttendanceColor(item.avgAttendance)}15` }]}>
                    <Text style={[styles.avgText, { color: getAttendanceColor(item.avgAttendance) }]}>
                      {item.avgAttendance}% Avg
                    </Text>
                  </View>
                </View>

                <View style={styles.studentPreview}>
                  {item.students.slice(0, 2).map((s, idx) => (
                    <View key={s.id} style={styles.previewRow}>
                      <Text style={styles.previewName}>{s.name}</Text>
                      <Text style={[styles.previewPercent, { color: getAttendanceColor(s.attendance) }]}>{s.attendance}%</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.viewMoreRow}>
                  <Text style={styles.viewMoreText}>Analysis Summary</Text>
                  <Ionicons name="arrow-forward" size={16} color="#00BCD4" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />

        {/* Detailed Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />

              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>{activeSectionName} Analysis</Text>
                  <Text style={styles.modalSubtitle}>Academic Year 2024-25</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeIcon}>
                  <Ionicons name="close-circle" size={32} color="#444" />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Query Student Name or Roll..."
                  placeholderTextColor="#666"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <FlatList
                data={filteredStudents}
                keyExtractor={(item) => item.id}
                renderItem={renderStudentItem}
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 45 : 55,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 14,
  },
  overviewContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 188, 212, 0.05)',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 188, 212, 0.1)',
    marginBottom: 25,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
    fontSize: 11,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  listPadding: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionCard: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardGradient: {
    padding: 20,
  },
  sectionHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sectionName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  studentCount: {
    color: '#555',
    fontSize: 13,
    marginTop: 2,
  },
  avgBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  avgText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  studentPreview: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 15,
    padding: 12,
    gap: 8,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewName: {
    color: '#AAA',
    fontSize: 14,
  },
  previewPercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewMoreRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 15,
    gap: 6,
  },
  viewMoreText: {
    color: '#00BCD4',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    height: '85%',
    padding: 25,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 54,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    marginLeft: 10,
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  studentName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  studentRoll: {
    color: '#555',
    fontSize: 12,
    marginTop: 2,
  },
  studentStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  studentPercent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});