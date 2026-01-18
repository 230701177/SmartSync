import React, { Component } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';

const screenWidth = Dimensions.get("window").width;

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAttendanceSummary: false,
      showSubjectWise: false,
      showAttendanceProgress: false
    };
  }

  render() {
    const { navigation, route } = this.props;
    const { role } = route.params || { role: 'student' };
    const { showAttendanceSummary, showSubjectWise, showAttendanceProgress } = this.state;

    // Student Data
    const studentInfo = {
      name: "Manoharan",
      department: "CSE",
      regNo: "230701177"
    };

    // Faculty Data
    const facultyInfo = {
      name: "Dr. Smith",
      department: "Computer Science"
    };

    // Common Data
    const overallAttendance = 75;
    const totalClasses = 100;
    const lowAttendanceSubjects = [
      { name: "Operating Systems", attendance: 60 },
      { name: "Internet Of Things", attendance: 65 },
      { name: "Design Thinking", attendance: 70 }
    ];

    const attendanceData = [
      { name: "Attended", population: overallAttendance, color: "#4CAF50", legendFontColor: "#FFF" },
      { name: "Missed", population: totalClasses - overallAttendance, color: "#F44336", legendFontColor: "#FFF" }
    ];

    const getAttendanceColor = (percentage) => {
      if (percentage >= 75) return '#4CAF50';
      if (percentage >= 50) return '#FFC107';
      return '#F44336';
    };

    // Faculty-Specific Components
    const renderFacultyContent = () => (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.heading}>Faculty Dashboard</Text>
        </View>

        <View style={styles.studentInfoCard}>
          <Text style={styles.studentName}>{facultyInfo.name}</Text>
          <Text style={styles.studentDetails}>{facultyInfo.department}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate("HeadcountVerification")}
          >
            <LinearGradient colors={["#FF7043", "#F4511E"]} style={styles.buttonIcon}>
              <Ionicons name="people" size={24} color="#FFF" />
            </LinearGradient>
            <Text style={styles.buttonText}>Take Attendance</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate("Analytics")}
          >
            <LinearGradient colors={["#5C6BC0", "#3949AB"]} style={styles.buttonIcon}>
              <Ionicons name="analytics" size={24} color="#FFF" />
            </LinearGradient>
            <Text style={styles.buttonText}>View Reports</Text>
          </TouchableOpacity>
        </View>
      </>
    );

    // Student-Specific Components
    const renderStudentContent = () => (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.heading}>Attendance Dashboard</Text>
        </View>

        <View style={styles.studentInfoCard}>
          <Text style={styles.studentName}>{studentInfo.name}</Text>
          <Text style={styles.studentDetails}>{studentInfo.department} | {studentInfo.regNo}</Text>
        </View>

        <View style={styles.attendanceRingCard}>
          <View style={styles.progressRingContainer}>
            <ProgressCircle
              style={styles.progressRing}
              progress={overallAttendance / 100}
              progressColor={getAttendanceColor(overallAttendance)}
              startAngle={-Math.PI * 0.8}
              endAngle={Math.PI * 0.8}
              strokeWidth={10}
            />
            <View style={styles.attendancePercentageContainer}>
              <Text style={styles.attendancePercentage}>{overallAttendance}%</Text>
              <Text style={styles.attendanceLabel}>Overall Attendance</Text>
            </View>
          </View>
        </View>
      </>
    );

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#121212" barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {role === 'faculty' ? renderFacultyContent() : renderStudentContent()}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              {role === 'faculty' ? 'Classes Needing Attention' : 'Subjects Needing Attention'}
            </Text>
            {lowAttendanceSubjects.map((subject, index) => (
              <View key={index} style={styles.subjectRow}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={[styles.subjectAttendance, 
                            { color: getAttendanceColor(subject.attendance) }]}>
                  {subject.attendance}%
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate("Timetable")}
            >
              <LinearGradient colors={["#26a69a", "#00796b"]} style={styles.buttonIcon}>
                <Ionicons name="calendar" size={24} color="#FFF" />
              </LinearGradient>
              <Text style={styles.buttonText}>Timetable</Text>
            </TouchableOpacity>
            
            {role === 'student' && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate("QRScanner")}
              >
                <LinearGradient colors={["#5C6BC0", "#3949AB"]} style={styles.buttonIcon}>
                  <Ionicons name="qr-code" size={24} color="#FFF" />
                </LinearGradient>
                <Text style={styles.buttonText}>Scan QR</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

// Keep all your existing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 44,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  menuButton: {
    marginRight: 15,
  },
  heading: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  studentInfoCard: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  studentName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  studentDetails: {
    color: "#BBB",
    fontSize: 14,
  },
  attendanceRingCard: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  progressRingContainer: {
    width: 180,
    height: 180,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    height: 180,
    width: 180,
  },
  attendancePercentageContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  attendancePercentage: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  attendanceLabel: {
    color: "#BBB",
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  subjectName: {
    color: "#FFF",
    fontSize: 14,
    flex: 1,
  },
  subjectAttendance: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    minWidth: '48%',
  },
  buttonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
});