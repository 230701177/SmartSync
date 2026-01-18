import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Sample data for CSE department sections with updated roll numbers
const initialSections = {
  'CSE A': [
    { id: '1', name: 'Lingeswaran', rollNo: '230701101', attendance: '85%' },
    { id: '2', name: 'Mokesh', rollNo: '230701102', attendance: '78%' },
    { id: '3', name: 'Karneesh', rollNo: '230701103', attendance: '92%' },
  ],
  'CSE B': [
    { id: '4', name: 'Monic Auditya', rollNo: '230701201', attendance: '88%' },
    { id: '5', name: 'Monish Dy', rollNo: '230701202', attendance: '75%' },
    { id: '6', name: 'Mithesh', rollNo: '230701203', attendance: '81%' },
  ],
  'CSE C': [
    { id: '7', name: 'Kumaran', rollNo: '230701301', attendance: '90%' },
    { id: '8', name: 'Balan', rollNo: '230701302', attendance: '82%' },
    { id: '9', name: 'Manoharan', rollNo: '230701303', attendance: '79%' },
  ],
  'CSE D': [
    { id: '10', name: 'Kabilesh', rollNo: '230701401', attendance: '85%' },
    { id: '11', name: 'Kasilingam', rollNo: '230701402', attendance: '91%' },
    { id: '12', name: 'Mathan', rollNo: '230701403', attendance: '76%' },
  ],
  'CSE E': [
    { id: '13', name: 'Mokesh', rollNo: '230701501', attendance: '89%' },
    { id: '14', name: 'Yuktha', rollNo: '230701502', attendance: '84%' },
    { id: '15', name: 'Hashik', rollNo: '230701503', attendance: '77%' },
  ],
  'CSE F': [
    { id: '16', name: 'Kamalesh', rollNo: '230701601', attendance: '93%' },
    { id: '17', name: 'Kaif', rollNo: '230701602', attendance: '80%' },
    { id: '18', name: 'Lokesh', rollNo: '230701603', attendance: '87%' },
  ]
};

export default function ClassManagement() {
  const navigation = useNavigation();
  const [sections, setSections] = useState(initialSections);
  const [expandedSection, setExpandedSection] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: '', rollNo: '' });
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const getFilteredSections = () => {
    if (!searchQuery.trim()) return sections;

    const query = searchQuery.toLowerCase();
    const filtered = {};

    Object.keys(sections).forEach(sectionName => {
      const sectionMatch = sectionName.toLowerCase().includes(query);
      const filteredStudents = sections[sectionName].filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.rollNo.toLowerCase().includes(query)
      );

      if (sectionMatch || filteredStudents.length > 0) {
        filtered[sectionName] = filteredStudents.length > 0 ? filteredStudents : sections[sectionName];
      }
    });

    return filtered;
  };

  const filteredSections = getFilteredSections();

  // Auto-expand sections when searching
  React.useEffect(() => {
    if (searchQuery.trim()) {
      const firstSection = Object.keys(filteredSections)[0];
      if (firstSection) setExpandedSection(firstSection);
    }
  }, [searchQuery]);

  const toggleSection = (sectionName) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

  const generateRollNo = (sectionName) => {
    const sectionCode = sectionName.split(' ')[1]; // Gets 'A', 'B', etc.
    const sectionNum = sectionCode.charCodeAt(0) - 64; // A=1, B=2, etc.
    const currentCount = sections[sectionName].length + 1;
    return `230701${sectionNum}0${currentCount}`;
  };

  const addStudent = (sectionName) => {
    if (!newStudent.name.trim()) {
      Alert.alert('Error', 'Please enter a student name');
      return;
    }
    const updatedSections = { ...sections };
    updatedSections[sectionName].push({
      id: Date.now().toString(),
      name: newStudent.name.trim(),
      rollNo: generateRollNo(sectionName),
      attendance: '0%'
    });
    setSections(updatedSections);
    setNewStudent({ name: '', rollNo: '' });
  };

  const updateStudent = (sectionName, studentId) => {
    if (!editingStudent.name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    const updatedSections = { ...sections };
    const sectionIndex = updatedSections[sectionName].findIndex(s => s.id === studentId);
    if (sectionIndex !== -1) {
      updatedSections[sectionName][sectionIndex] = {
        ...updatedSections[sectionName][sectionIndex],
        ...editingStudent
      };
      setSections(updatedSections);
      setEditingStudent(null);
    }
  };

  const deleteStudent = (sectionName, studentId) => {
    Alert.alert(
      "Confirm Removal",
      "Are you sure you want to remove this student?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const updatedSections = { ...sections };
            updatedSections[sectionName] = updatedSections[sectionName].filter(s => s.id !== studentId);
            setSections(updatedSections);
          }
        }
      ]
    );
  };

  const updateAttendance = (sectionName, studentId, value) => {
    let num = parseInt(value);
    if (isNaN(num)) num = 0;
    if (num > 100) num = 100;

    const updatedSections = { ...sections };
    const student = updatedSections[sectionName].find(s => s.id === studentId);
    if (student) {
      student.attendance = num + '%';
      setSections(updatedSections);
    }
  };

  const renderStudentItem = ({ item, sectionName }) => {
    const attendanceVal = parseInt(item.attendance);
    const getStatusColor = (val) => {
      if (val >= 85) return '#4CAF50';
      if (val >= 75) return '#FF9800';
      return '#FF5252';
    };

    return (
      <View style={styles.studentCardWrapper}>
        <View style={styles.studentCard}>
          {editingStudent?.id === item.id ? (
            <View style={styles.editFormContainer}>
              <View style={styles.editInputsArea}>
                <View style={styles.editInputWrapper}>
                  <Ionicons name="person-outline" size={14} color="#00BCD4" />
                  <TextInput
                    style={styles.editInput}
                    value={editingStudent.name}
                    onChangeText={(text) => setEditingStudent({ ...editingStudent, name: text })}
                    placeholder="Name"
                    placeholderTextColor="#666"
                  />
                </View>
                <View style={[styles.editInputWrapper, { marginTop: 8 }]}>
                  <Ionicons name="card-outline" size={14} color="#00BCD4" />
                  <TextInput
                    style={styles.editInput}
                    value={editingStudent.rollNo}
                    onChangeText={(text) => setEditingStudent({ ...editingStudent, rollNo: text })}
                    placeholder="Reg Num"
                    placeholderTextColor="#666"
                  />
                </View>
              </View>
              <View style={styles.editActionsVertical}>
                <TouchableOpacity
                  style={[styles.smallBtn, { backgroundColor: '#4CAF50' }]}
                  onPress={() => updateStudent(sectionName, item.id)}
                >
                  <Ionicons name="checkmark" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.smallBtn, { backgroundColor: '#444', marginTop: 8 }]}
                  onPress={() => setEditingStudent(null)}
                >
                  <Ionicons name="close" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.studentRow}>
              <View style={styles.studentMain}>
                <View style={[styles.avatarCircle, { backgroundColor: `${getStatusColor(attendanceVal)}15` }]}>
                  <Text style={[styles.avatarText, { color: getStatusColor(attendanceVal) }]}>
                    {item.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.studentMeta}>
                  <Text style={styles.studentNameText}>{item.name}</Text>
                  <Text style={styles.rollText}>{item.rollNo}</Text>
                </View>
              </View>

              <View style={styles.attendanceBlock}>
                <View style={styles.attendanceInputRow}>
                  <TextInput
                    style={[styles.attInput, { color: getStatusColor(attendanceVal) }]}
                    value={item.attendance.replace('%', '')}
                    onChangeText={(text) => updateAttendance(sectionName, item.id, text)}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  <Text style={styles.percentSign}>%</Text>
                </View>
                <View style={styles.miniProgressContainer}>
                  <View style={[styles.miniProgressFill, { width: `${attendanceVal}%`, backgroundColor: getStatusColor(attendanceVal) }]} />
                </View>
              </View>

              <View style={styles.actionColumn}>
                <TouchableOpacity onPress={() => setEditingStudent(item)} style={styles.toolIcon}>
                  <Feather name="edit-2" size={16} color="#AAA" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteStudent(sectionName, item.id)} style={styles.toolIcon}>
                  <Feather name="trash" size={16} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderSection = (sectionName) => (
    <View key={sectionName} style={styles.accordionContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.accordionHeader, expandedSection === sectionName && styles.accordionHeaderActive]}
        onPress={() => toggleSection(sectionName)}
      >
        <LinearGradient
          colors={expandedSection === sectionName ? ['rgba(0,188,212,0.15)', 'rgba(0,0,0,0.3)'] : ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}
          style={styles.accordionHeaderGradient}
        >
          <View style={styles.headerTitleRow}>
            <View style={[styles.statusIndicator, { backgroundColor: expandedSection === sectionName ? '#00BCD4' : '#444' }]} />
            <Text style={[styles.sectionTitleText, expandedSection === sectionName && { color: '#00BCD4' }]}>
              {sectionName}
            </Text>
            <View style={styles.studentCountBadge}>
              <Text style={styles.countText}>{filteredSections[sectionName].length}</Text>
            </View>
          </View>
          <Ionicons
            name={expandedSection === sectionName ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={expandedSection === sectionName ? '#00BCD4' : '#AAA'}
          />
        </LinearGradient>
      </TouchableOpacity>

      {expandedSection === sectionName && (
        <View style={styles.accordionContent}>
          <FlatList
            data={filteredSections[sectionName]}
            renderItem={({ item }) => renderStudentItem({ item, sectionName })}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 10 }}
          />

          <View style={styles.addStudentBox}>
            <LinearGradient
              colors={['rgba(255,255,255,0.03)', 'transparent']}
              style={styles.addStudentGradient}
            >
              <Text style={styles.addTitle}>QUICK ENROLL</Text>
              <View style={styles.addInputContainer}>
                <TextInput
                  style={styles.addInput}
                  value={newStudent.name}
                  onChangeText={(text) => setNewStudent({ ...newStudent, name: text })}
                  placeholder="Enter Student Name..."
                  placeholderTextColor="#444"
                />
                <TouchableOpacity
                  style={styles.addButtonCircle}
                  onPress={() => addStudent(sectionName)}
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <LinearGradient colors={['#0A0E21', '#121212']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.topHeader}>
            <TouchableOpacity
              style={styles.backButtonCircle}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="#FFF" />
            </TouchableOpacity>
            {!isSearchVisible ? (
              <>
                <View style={styles.titleArea}>
                  <Text style={styles.titleLabel}>ADMINISTRATION</Text>
                  <Text style={styles.mainTitleText}>Manage Classes</Text>
                </View>
                <TouchableOpacity
                  style={styles.actionIconButton}
                  onPress={() => setIsSearchVisible(true)}
                >
                  <Feather name="search" size={20} color="#00BCD4" />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.searchBarWrapper}>
                <TextInput
                  autoFocus
                  style={styles.searchInput}
                  placeholder="Search students, roll no..."
                  placeholderTextColor="#666"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity onPress={() => {
                  setIsSearchVisible(false);
                  setSearchQuery('');
                }}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Intro Section */}
          <View style={styles.introCard}>
            <View style={styles.introLeft}>
              <View style={styles.shieldIconBg}>
                <MaterialCommunityIcons name="security" size={24} color="#00BCD4" />
              </View>
            </View>
            <View style={styles.introRight}>
              <Text style={styles.introTitle}>Academic Integrity</Text>
              <Text style={styles.introSub}>Modify student rosters and verify base attendance records with AI sync.</Text>
            </View>
          </View>

          <View style={styles.listSection}>
            {Object.keys(filteredSections).length > 0 ? (
              Object.keys(filteredSections).map(sectionName => renderSection(sectionName))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={64} color="#222" />
                <Text style={styles.emptyStateText}>No matches found for "{searchQuery}"</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 50,
    marginBottom: 30,
  },
  backButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  titleArea: {
    flex: 1,
  },
  titleLabel: {
    color: '#00BCD4',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 4,
  },
  mainTitleText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionIconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,188,212,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginRight: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyStateText: {
    color: '#444',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
  introCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 30,
  },
  shieldIconBg: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: 'rgba(0,188,212,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  introRight: {
    flex: 1,
  },
  introTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  introSub: {
    color: '#666',
    fontSize: 12,
    lineHeight: 18,
  },
  accordionContainer: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  accordionHeaderGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
  },
  sectionTitleText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
  },
  accordionContent: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingTop: 10,
  },
  studentCardWrapper: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  studentCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  studentMeta: {
    flex: 1,
  },
  studentNameText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  rollText: {
    color: '#555',
    fontSize: 11,
    marginTop: 2,
  },
  attendanceBlock: {
    width: 80,
    alignItems: 'center',
    marginRight: 10,
  },
  attendanceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attInput: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 0,
    textAlign: 'right',
  },
  percentSign: {
    color: '#444',
    fontSize: 10,
    marginLeft: 2,
    marginTop: 4,
  },
  miniProgressContainer: {
    height: 3,
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 1.5,
    marginTop: 4,
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  actionColumn: {
    gap: 12,
  },
  toolIcon: {
    padding: 4,
  },
  editFormContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editInputsArea: {
    flex: 1,
  },
  editInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
    borderWidth: 1,
    borderColor: '#333',
  },
  editInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 13,
    marginLeft: 8,
  },
  editActionsVertical: {
    alignItems: 'center',
  },
  smallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStudentBox: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  addStudentGradient: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  addTitle: {
    color: '#444',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 12,
    textAlign: 'center',
  },
  addInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addInput: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    paddingHorizontal: 15,
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#333',
  },
  addButtonCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  }
});