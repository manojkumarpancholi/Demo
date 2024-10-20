import {
  View,
  Text,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import styles from '../styles';
import RNFS from 'react-native-fs';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import SaveRecordingModal from './SaveRecordingModal';
import {useNavigation} from '@react-navigation/native';
import {getStorage, setStarage} from '../untility/util';
import {vioceRecorderKey} from '../constants';
import SaveModal from './SaveModal';

const SoundRecodre = () => {
  const navigation = useNavigation();
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [filePath, setFilePath] = useState('');
  const [files, setFiles] = useState([]);
  const [recordingName, setRecordingName] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaveModalVisible, setSaveModalVisible] = useState(false);

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  const formatTime = millis => {
    const totalSeconds = Math.floor(millis / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      '0',
    );
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const requestPermissions = async () => {
    if (Platform.constants['Release'] < 11) {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          ]);

          if (
            granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              'never_ask_again' ||
            granted['android.permission.READ_EXTERNAL_STORAGE'] ===
              'never_ask_again'
          ) {
            Alert.alert(
              'Storage Permission Required',
              'Please enable storage permissions from Settings to save audio files.',
              [
                {
                  text: 'Go to Settings',
                  onPress: () => Linking.openSettings(),
                },
                {text: 'Cancel', style: 'cancel'},
              ],
            );
            return false;
          }

          return (
            granted['android.permission.RECORD_AUDIO'] === 'granted' &&
            granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              'granted' &&
            granted['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'
          );
        } catch (err) {
          console.warn(err);
          return false;
        }
      }
      return true;
    } else {
      const granted = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
      return granted;
    }
  };
  useEffect(() => {
    const fetchFiles = async () => {
      const exitingArr = await getStorage(vioceRecorderKey);
      setFiles(exitingArr);
    };

    fetchFiles();
  }, []);
  const startRecording = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permissions required',
        'Please grant audio and storage permissions.',
      );
      return;
    }
    const path = `${RNFS.DocumentDirectoryPath}/Recording ${
      files?.length + 1
    }.mp3`;
    setRecordingName(path);
    try {
      await audioRecorderPlayer.startRecorder(path);
      setRecording(true);
      audioRecorderPlayer.addRecordBackListener(e => {
        const formattedTime = formatTime(e.currentPosition);
        setRecordTime(formattedTime);
        return;
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setRecording(false);
      audioRecorderPlayer.removeRecordBackListener();
      setFilePath(result);
      setSaveModalVisible(true);
      console.log(result);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };
  const fetchFiles = async () => {
    try {
      const path = RNFS.DocumentDirectoryPath;
      const result = await RNFS.readDir(path);
      setFiles(result);
    } catch (err) {
      Alert.alert('Error', 'Failed to read files: ' + err.message);
    }
  };
  const deleteFile = async () => {
    if (filePath) {
      Alert.alert('delete file', 'you want to delete file', [
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await RNFS.unlink(filePath);
              fetchFiles();
              setRecordTime('00.00.00');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete file: ' + error.message);
            }
          },
        },
        {
          text: 'No',
        },
      ]);
    } else {
      navigation.goBack();
    }
  };
  const handleFormSubmit = async (name, color) => {
    const newRecording = {
      name,
      path: filePath,
      color,
      id: new Date().getTime(),
    };
    console.log(newRecording);
    setRecordingName(name);
    setModalVisible(false);
    const exitingArr = await getStorage(vioceRecorderKey);
    const newStorage = [...exitingArr, newRecording];
    console.log('newStorage -> ', newStorage);
    await setStarage(vioceRecorderKey, newStorage);
    navigation.goBack();
  };
  const onSubmit = () => {
    setModalVisible(true);
    setSaveModalVisible(false);
  };
  const handleCloseModal = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/RecordingMic.png')}
        style={{height: 150, width: 150}}
      />
      <Text
        style={[
          styles.recordTime,
          {color: recordTime > 0 ? '#113C6D' : 'gray'},
        ]}>
        {recordTime}
      </Text>
      <View style={styles.recordingButton}>
        <TouchableOpacity onPress={deleteFile}>
          <Image source={require('../assets/cross.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
          <Image
            source={
              recording
                ? require('../assets/stop.png')
                : require('../assets/start.png')
            }
            style={{marginHorizontal: 20}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            stopRecording();
            setModalVisible(true);
          }}>
          <Image source={require('../assets/right.png')} />
        </TouchableOpacity>
      </View>
      <SaveRecordingModal
        visible={modalVisible}
        placeholder={filePath}
        onSubmit={handleFormSubmit}
        onClose={handleCloseModal}
      />
      <SaveModal
        visible={isSaveModalVisible}
        onClose={() => setSaveModalVisible(false)}
        name={recordingName}
        onSubmit={onSubmit}
      />
    </View>
  );
};

export default SoundRecodre;
