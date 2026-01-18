import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { CameraView, useCameraPermissions, Camera } from 'expo-camera';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function HeadcountVerification({ onCountComplete }) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isUploading, setIsUploading] = useState(false);
  const [headcount, setHeadcount] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission, requestPermission]);

  const uploadVideo = async (videoUri) => {
    const formData = new FormData();
    formData.append('video', {
      uri: videoUri,
      type: 'video/mp4',
      name: 'upload.mp4',
    });

    setIsUploading(true);
    try {
      const response = await fetch('http://172.16.11.49:5000/upload-video', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('Invalid JSON from server:', err, text);
        Alert.alert('Error', 'Invalid server response');
        return;
      }

      if (data.headcount !== undefined) {
        setHeadcount(data.headcount);
        if (onCountComplete) onCountComplete(data.headcount);
      } else {
        Alert.alert('Error', 'Failed to get headcount');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const recordVideo = async () => {
    if (!cameraRef.current) return;
    try {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync({
        quality: '480p',
        maxDuration: 15,
      });

      setIsRecording(false);
      if (video?.uri) {
        await uploadVideo(video.uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Video recording failed');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  const pickVideoAndUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'video/*' });

    if (result.canceled || !result.assets?.length) return;
    await uploadVideo(result.assets[0].uri);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer} pointerEvents="box-none">
        <LinearGradient colors={['#0A0E21', '#121212']} style={StyleSheet.absoluteFill} />
        <View style={styles.permissionContent}>
          <View style={styles.permissionIconBg}>
            <Ionicons name="camera-outline" size={50} color="#00BCD4" />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera permission to perform AI-based headcount verification for this session.
          </Text>
          <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
            <LinearGradient
              colors={['#00BCD4', '#0097A7']}
              style={styles.permissionGradient}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        videoStabilizationMode="auto"
        enableZoomGesture
      >
        {/* Header Overlay */}
        <SafeAreaView style={styles.safeHeader}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Headcount AI</Text>
              <View style={styles.liveBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.liveText}>READY</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.iconCircle} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
              <Ionicons name="camera-reverse-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Viewfinder corners */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.viewfinderFrame} />
        </View>

        {/* Bottom Controls Overlay */}
        <View style={styles.bottomOverlay}>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.bottomGradient}
          />

          <View style={styles.controlsContent}>
            {isUploading ? (
              <View style={styles.processingCard}>
                <ActivityIndicator size="large" color="#00BCD4" />
                <Text style={styles.processingText}>Analyzing Video Stream...</Text>
                <Text style={styles.processingSubtext}>AI Verifier is counting participants</Text>
              </View>
            ) : headcount !== null ? (
              <View style={styles.resultCard}>
                <LinearGradient
                  colors={['rgba(0,188,212,0.2)', 'rgba(0,0,0,0.4)']}
                  style={styles.resultGradient}
                >
                  <Text style={styles.resultLabel}>DETECTED HEADCOUNT</Text>
                  <Text style={styles.resultValue}>{headcount}</Text>
                  <Text style={styles.resultSubtext}>People identified in frame</Text>
                  <TouchableOpacity
                    style={styles.reverifyButton}
                    onPress={() => setHeadcount(null)}
                  >
                    <Text style={styles.reverifyText}>RE-VERIFY</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            ) : (
              <View style={styles.actionSection}>
                <Text style={styles.instructionText}>Position camera to cover all students</Text>

                <View style={styles.mainControlsRow}>
                  <TouchableOpacity style={styles.secondaryControl} onPress={pickVideoAndUpload}>
                    <View style={styles.secondaryIconBg}>
                      <Ionicons name="cloud-upload-outline" size={24} color="white" />
                    </View>
                    <Text style={styles.secondaryLabel}>Import</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.recordButtonContainer}
                    onPress={isRecording ? stopRecording : recordVideo}
                  >
                    <View style={[styles.recordOuterCircle, isRecording && styles.recordingOuter]}>
                      <View style={[styles.recordInnerCircle, isRecording ? styles.recordingInner : { backgroundColor: '#FF5252' }]} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.secondaryControl} onPress={() => { }}>
                    <View style={styles.secondaryIconBg}>
                      <Ionicons name="flash-outline" size={24} color="white" />
                    </View>
                    <Text style={styles.secondaryLabel}>Flash</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.timerText}>{isRecording ? 'RECORDING • 0:15 MAX' : 'Tap to start 15s verification'}</Text>
              </View>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  safeHeader: {
    paddingTop: Platform.OS === 'android' ? 60 : 25,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,188,212,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    gap: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00BCD4',
  },
  liveText: {
    color: '#00BCD4',
    fontSize: 10,
    fontWeight: '800',
  },
  viewfinderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinderFrame: {
    width: width * 0.8,
    height: height * 0.4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 350,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  controlsContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  actionSection: {
    alignItems: 'center',
    width: '100%',
  },
  instructionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 20,
    fontWeight: '500',
  },
  mainControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    width: '100%',
  },
  secondaryControl: {
    alignItems: 'center',
    gap: 6,
  },
  secondaryIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  secondaryLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  recordButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordOuterCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: 'white',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordInnerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  recordingOuter: {
    borderColor: '#FF5252',
  },
  recordingInner: {
    backgroundColor: '#FF5252',
    width: '50%',
    height: '50%',
    borderRadius: 4,
  },
  timerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 20,
    letterSpacing: 1,
  },
  processingCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(0,188,212,0.3)',
    marginBottom: 40,
  },
  processingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  processingSubtext: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginTop: 8,
  },
  resultCard: {
    width: width * 0.85,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,188,212,0.4)',
    marginBottom: 40,
  },
  resultGradient: {
    padding: 30,
    alignItems: 'center',
  },
  resultLabel: {
    color: '#00BCD4',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  resultValue: {
    color: 'white',
    fontSize: 64,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  resultSubtext: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginBottom: 20,
  },
  reverifyButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  reverifyText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContent: {
    alignItems: 'center',
    padding: 40,
  },
  permissionIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,188,212,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  permissionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  permissionText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  permissionButton: {
    width: '100%',
    height: 55,
    borderRadius: 16,
    overflow: 'hidden',
  },
  permissionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});