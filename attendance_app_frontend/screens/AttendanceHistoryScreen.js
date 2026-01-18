import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar,
    Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const mockHistory = [
    { id: '1', subject: 'Operating Systems', code: 'CS23431', time: '09:15 AM', date: 'Today, 25 Apr', type: 'Lecture', status: 'Success' },
    { id: '2', subject: 'Database Management', code: 'CS23432', time: '02:30 PM', date: 'Yesterday, 24 Apr', type: 'Lab', status: 'Success' },
];

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AttendanceHistoryScreen({ navigation }) {
    const [history, setHistory] = useState(mockHistory);

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const saved = await AsyncStorage.getItem('attendance_logs');
                if (saved) {
                    const logs = JSON.parse(saved);
                    setHistory([...logs, ...mockHistory]);
                }
            } catch (e) {
                console.error(e);
            }
        };
        loadLogs();
    }, []);

    const renderLogItem = ({ item }) => (
        <View style={styles.logCard}>
            <View style={styles.logHeader}>
                <View style={styles.logDateRow}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    <Text style={styles.logDateText}>{item.date} • {item.time}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'Success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 82, 82, 0.1)' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'Success' ? '#4CAF50' : '#FF5252' }]}>{item.status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.logBody}>
                <View style={styles.iconBg}>
                    <Ionicons
                        name={item.type === 'Lab' ? 'flask-outline' : item.type === 'Seminar' ? 'mic-outline' : 'school-outline'}
                        size={24}
                        color="#00BCD4"
                    />
                </View>
                <View style={styles.logInfo}>
                    <Text style={styles.subjectName}>{item.subject}</Text>
                    <Text style={styles.subjectCode}>{item.code} • {item.type}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <LinearGradient colors={['#0A0E21', '#121212']} style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Attendance History</Text>
                        <Text style={styles.headerSubtitle}>Logs of your scanned sessions</Text>
                    </View>
                </View>

                {/* Stats Summary */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>14</Text>
                        <Text style={styles.statLabel}>Total Scans</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>98%</Text>
                        <Text style={styles.statLabel}>Success Rate</Text>
                    </View>
                </View>

                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id}
                    renderItem={renderLogItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => (
                        <Text style={styles.listTitle}>Recent Activity</Text>
                    )}
                />
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 20 : 50,
        marginBottom: 25,
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
    headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
    headerSubtitle: { color: '#666', fontSize: 13, marginTop: 2 },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.02)',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 30,
        justifyContent: 'space-around',
    },
    statItem: { alignItems: 'center' },
    statValue: { color: '#00BCD4', fontSize: 20, fontWeight: 'bold' },
    statLabel: { color: '#555', fontSize: 11, marginTop: 4, textTransform: 'uppercase' },
    statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.05)' },
    listContent: { paddingHorizontal: 20, paddingBottom: 40 },
    listTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 20, opacity: 0.8 },
    logCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        padding: 18,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    logDateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    logDateText: { color: '#666', fontSize: 12 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusText: { fontSize: 10, fontWeight: 'bold' },
    logBody: { flexDirection: 'row', alignItems: 'center' },
    iconBg: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(0, 188, 212, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    logInfo: { flex: 1 },
    subjectName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    subjectCode: { color: '#555', fontSize: 12, marginTop: 2 },
});
