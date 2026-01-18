import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MyAttendanceScreen = ({ navigation }) => {
  // Enhanced mock attendance data
  const attendanceData = [
    {
      id: '1',
      subject: 'Data Structures',
      code: 'CS1201',
      totalClasses: 30,
      attended: 25,
      percentage: 83.3,
      status: 'safe',
      trend: 'up'
    },
    {
      id: '2',
      subject: 'Algorithms',
      code: 'CS1202',
      totalClasses: 28,
      attended: 20,
      percentage: 71.4,
      status: 'warning',
      trend: 'stable'
    },
    {
      id: '3',
      subject: 'Database Systems',
      code: 'CS1203',
      totalClasses: 32,
      attended: 28,
      percentage: 87.5,
      status: 'safe',
      trend: 'up'
    },
    {
      id: '4',
      subject: 'Operating Systems',
      code: 'CS1204',
      totalClasses: 30,
      attended: 18,
      percentage: 60.0,
      status: 'danger',
      trend: 'down'
    },
    {
      id: '5',
      subject: 'Computer Networks',
      code: 'CS1205',
      totalClasses: 25,
      attended: 22,
      percentage: 88.0,
      status: 'safe',
      trend: 'up'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'danger': return '#FF5252';
      default: return '#00BCD4';
    }
  };

  const overallAttendance = useMemo(() => {
    const total = attendanceData.reduce((acc, curr) => acc + curr.percentage, 0);
    return (total / attendanceData.length).toFixed(1);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.subjectInfo}>
            <Text style={styles.subjectCode}>{item.code}</Text>
            <Text style={styles.subjectTitle}>{item.subject}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
            <Ionicons
              name={item.trend === 'up' ? 'trending-up' : item.trend === 'down' ? 'trending-down' : 'remove'}
              size={12}
              color={getStatusColor(item.status)}
            />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Presence</Text>
            <Text style={styles.statValue}>{item.attended}/{item.totalClasses}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Requirement</Text>
            <Text style={styles.statValue}>75%</Text>
          </View>
          <View style={styles.percentBox}>
            <Text style={[styles.percentageValue, { color: getStatusColor(item.status) }]}>{item.percentage}%</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${item.percentage}%`,
                  backgroundColor: getStatusColor(item.status)
                }
              ]}
            />
          </View>
          {item.percentage < 75 && (
            <Text style={styles.alertText}>
              Need {Math.ceil((0.75 * item.totalClasses) - item.attended)} more present classes
            </Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#0A0E21', '#121212']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>My Attendance</Text>
            <Text style={styles.headerSubtitle}>Semester V • Academic Logs</Text>
          </View>
        </View>

        {/* Overall Progress Widget */}
        <View style={styles.overallWidget}>
          <View style={styles.overallMain}>
            <View style={styles.circleContainer}>
              <View style={[styles.circleInner, { borderColor: getStatusColor(overallAttendance >= 75 ? 'safe' : 'warning') }]}>
                <Text style={styles.overallValue}>{overallAttendance}%</Text>
                <Text style={styles.overallLabel}>Aggregate</Text>
              </View>
            </View>
            <View style={styles.overallInfo}>
              <Text style={styles.statusMessage}>
                {overallAttendance >= 75 ? "You're doing great!" : "Focus on Algorithms"}
              </Text>
              <Text style={styles.statusDesc}>
                {overallAttendance >= 75
                  ? "Maintained above university standards."
                  : "Attendance is slightly below standard."}
              </Text>
              <View style={styles.summaryBadges}>
                <View style={styles.summaryBadge}>
                  <Text style={styles.summaryBadgeText}>5 Subjects</Text>
                </View>
                <View style={[styles.summaryBadge, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                  <Text style={[styles.summaryBadgeText, { color: '#4CAF50' }]}>3 Safe</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <FlatList
          data={attendanceData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

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
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
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
  overallWidget: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 25,
  },
  overallMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  circleInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overallValue: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  overallLabel: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  overallInfo: {
    flex: 1,
  },
  statusMessage: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusDesc: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  summaryBadges: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  summaryBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  summaryBadgeText: {
    color: '#AAA',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardGradient: {
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  subjectCode: {
    color: '#00BCD4',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subjectTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    color: '#666',
    fontSize: 11,
    marginBottom: 4,
  },
  statValue: {
    color: '#BBB',
    fontSize: 15,
    fontWeight: '600',
  },
  percentBox: {
    alignItems: 'flex-end',
  },
  percentageValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  alertText: {
    color: '#FF5252',
    fontSize: 11,
    fontWeight: '500',
    fontStyle: 'italic',
  },
});

export default MyAttendanceScreen;