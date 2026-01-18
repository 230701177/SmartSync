import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const initialTimetable = {
  Tuesday: [
    { id: '1', time: "08:00 - 09:00 AM", subject: "MA23435 PSS", code: "MA23435", faculty: "Dr. Sathish", room: "A 308", type: "class" },
    { id: '2', time: "09:00 - 09:20 AM", subject: "BREAK", code: "-", faculty: "-", room: "Cafeteria", type: "break" },
    { id: '3', time: "09:20 - 10:10 AM", subject: "CS23432 SC", code: "CS23432", faculty: "Prof. Priya", room: "A 308", type: "class" },
  ],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TimetableScreen({ navigation }) {
  const [selectedDay, setSelectedDay] = useState("");
  const [currentDateString, setCurrentDateString] = useState("");
  const [timetableData, setTimetableData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    subject: '',
    code: '',
    room: '',
    faculty: '',
    time: '',
    type: 'class'
  });

  useEffect(() => {
    const dateObj = new Date();
    const fullDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayName = fullDays[dateObj.getDay()];
    const displayDay = days.includes(dayName) ? dayName : "Tuesday";

    setSelectedDay(displayDay);
    setCurrentDateString(`${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`);
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    try {
      const saved = await AsyncStorage.getItem('user_timetable');
      if (saved) {
        setTimetableData(JSON.parse(saved));
      } else {
        setTimetableData(initialTimetable);
      }
    } catch (e) {
      setTimetableData(initialTimetable);
    }
  };

  const saveTimetable = async (newData) => {
    try {
      await AsyncStorage.setItem('user_timetable', JSON.stringify(newData));
      setTimetableData(newData);
    } catch (e) {
      Alert.alert("Error", "Failed to save timetable changes");
    }
  };

  const handleAddEdit = () => {
    if (!formData.subject || !formData.time) {
      Alert.alert("Required Fields", "Subject and Time are mandatory.");
      return;
    }

    const newData = { ...timetableData };
    if (!newData[selectedDay]) newData[selectedDay] = [];

    if (editingSlot) {
      // Edit existing
      newData[selectedDay] = newData[selectedDay].map(slot =>
        slot.id === editingSlot.id ? { ...formData, id: slot.id } : slot
      );
    } else {
      // Add new
      const newSlot = {
        ...formData,
        id: Date.now().toString()
      };
      newData[selectedDay].push(newSlot);
    }

    saveTimetable(newData);
    setIsModalVisible(false);
    resetForm();
  };

  const deleteSlot = (id) => {
    Alert.alert("Delete Class", "Are you sure you want to remove this slot?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: () => {
          const newData = { ...timetableData };
          newData[selectedDay] = newData[selectedDay].filter(slot => slot.id !== id);
          saveTimetable(newData);
        }
      }
    ]);
  };

  const openForm = (slot = null) => {
    if (slot) {
      setEditingSlot(slot);
      setFormData(slot);
    } else {
      resetForm();
    }
    setIsModalVisible(true);
  };

  const resetForm = () => {
    setEditingSlot(null);
    setFormData({
      subject: '',
      code: '',
      room: '',
      faculty: '',
      time: '',
      type: 'class'
    });
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'break': return { color: '#FF9800', icon: 'coffee-outline' };
      case 'lunch': return { color: '#E91E63', icon: 'food-outline' };
      case 'lab': return { color: '#4CAF50', icon: 'flask-outline' };
      default: return { color: '#00BCD4', icon: 'school-outline' };
    }
  };

  const renderTimetableItem = ({ item }) => {
    const { color, icon } = getTypeStyles(item.type);
    return (
      <View style={styles.cardWrapper}>
        <LinearGradient colors={['#1F2A44', '#161E2E']} style={styles.cardGradient}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
              <MaterialCommunityIcons name={icon} size={24} color={color} />
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={[styles.timeText, { color }]}>{item.time}</Text>
              <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => openForm(item)}>
                  <Ionicons name="pencil" size={18} color="#888" style={{ marginRight: 15 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteSlot(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.subjectText}>{item.subject} <Text style={styles.codeText}>({item.code})</Text></Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.metaText}>{item.room}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="person-outline" size={14} color="#666" />
                <Text style={styles.metaText}>{item.faculty}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#0A0E21', '#121212']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Timetable Master</Text>
            <Text style={styles.headerSubtitle}>{selectedDay}, {currentDateString}</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => openForm()}>
            <Ionicons name="add" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.daySelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {days.map(day => (
              <TouchableOpacity
                key={day}
                onPress={() => setSelectedDay(day)}
                style={[styles.dayChip, selectedDay === day && styles.activeDayChip]}
              >
                <Text style={[styles.dayChipText, selectedDay === day && styles.activeDayChipText]}>{day.substring(0, 3)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={timetableData[selectedDay] || []}
          keyExtractor={(item) => item.id}
          renderItem={renderTimetableItem}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={80} color="rgba(255,255,255,0.05)" />
              <Text style={styles.emptyText}>No classes for {selectedDay}</Text>
              <TouchableOpacity style={styles.emptyAddBtn} onPress={() => openForm()}>
                <Text style={styles.emptyAddText}>Schedule Now</Text>
              </TouchableOpacity>
            </View>
          }
        />

        {/* Add/Edit Modal */}
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{editingSlot ? 'Update Class' : 'New Schedule'}</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.formScroll}>
                <InputField label="Course Name" value={formData.subject} onChange={(v) => setFormData({ ...formData, subject: v })} placeholder="e.g. Operating Systems" />
                <InputField label="Course Code" value={formData.code} onChange={(v) => setFormData({ ...formData, code: v })} placeholder="e.g. CS23431" />
                <InputField label="Faculty Name" value={formData.faculty} onChange={(v) => setFormData({ ...formData, faculty: v })} placeholder="e.g. Dr. Rajesh Kumar" />
                <InputField label="Venue / Room" value={formData.room} onChange={(v) => setFormData({ ...formData, room: v })} placeholder="e.g. A-308 / TLGL1" />
                <InputField label="Timings" value={formData.time} onChange={(v) => setFormData({ ...formData, time: v })} placeholder="e.g. 08:00 - 09:00 AM" />

                <Text style={styles.label}>Category</Text>
                <View style={styles.typeRow}>
                  {['class', 'lab', 'break', 'lunch'].map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeChip, formData.type === type && { backgroundColor: getTypeStyles(type).color }]}
                      onPress={() => setFormData({ ...formData, type })}
                    >
                      <Text style={[styles.typeChipText, formData.type === type && { color: '#FFF' }]}>{type.toUpperCase()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={handleAddEdit}>
                  <LinearGradient colors={['#00BCD4', '#0097A7']} style={styles.submitGradient}>
                    <Text style={styles.submitBtnText}>{editingSlot ? 'UPDATE SLOT' : 'CREATE SLOT'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const InputField = ({ label, value, onChange, placeholder }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#444"
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 45 : 55,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  backButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, marginRight: 15 },
  headerInfo: { flex: 1 },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: '#666', fontSize: 13, marginTop: 2 },
  addButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#00BCD4', justifyContent: 'center', alignItems: 'center' },
  daySelector: { marginBottom: 10 },
  dayChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.03)', marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  activeDayChip: { backgroundColor: 'rgba(0,188,212,0.1)', borderColor: '#00BCD4' },
  dayChipText: { color: '#666', fontWeight: 'bold' },
  activeDayChipText: { color: '#00BCD4' },
  cardWrapper: { marginBottom: 15, borderRadius: 20, overflow: 'hidden' },
  cardGradient: { flexDirection: 'row', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardLeft: { marginRight: 15, alignItems: 'center' },
  iconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  timeText: { fontSize: 13, fontWeight: 'bold' },
  actionIcons: { flexDirection: 'row' },
  subjectText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  codeText: { color: '#444', fontSize: 12 },
  metaRow: { flexDirection: 'row', gap: 15 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: '#888', fontSize: 12 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#333', fontSize: 16, marginTop: 20 },
  emptyAddBtn: { marginTop: 20, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#00BCD4' },
  emptyAddText: { color: '#00BCD4', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#121212', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  formScroll: { marginBottom: 20 },
  inputContainer: { marginBottom: 15 },
  label: { color: '#888', fontSize: 12, marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#1A1A1A', borderRadius: 12, height: 50, color: '#FFF', paddingHorizontal: 15, borderWidth: 1, borderColor: '#333' },
  typeRow: { flexDirection: 'row', gap: 10, marginTop: 10, marginBottom: 20 },
  typeChip: { flex: 1, height: 36, borderRadius: 8, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  typeChipText: { color: '#666', fontSize: 10, fontWeight: 'bold' },
  submitBtn: { borderRadius: 15, overflow: 'hidden', marginTop: 10 },
  submitGradient: { height: 56, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontWeight: 'bold', letterSpacing: 1 }
});