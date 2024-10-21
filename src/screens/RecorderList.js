import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  PermissionsAndroid,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import styles from '../styles';
import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import SoundPlayer from 'react-native-sound-player';
import {getStorage, setStarage} from '../untility/util';
import { vioceRecorderKey} from '../constants';

const RecorderList = () => {
  const navigation = useNavigation();
  const [files, setFiles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const fetchFiles = async () => {
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) return;
      }
      const path = RNFS.DocumentDirectoryPath;
      const result = await RNFS.readDir(path);
      // setFiles(result);
    } catch (err) {
      Alert.alert('Error', 'Failed to read files: ' + err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getItem();
    });

    return unsubscribe;
  }, [navigation]);

  const getItem = async () => {
    const exitingArr = await getStorage(vioceRecorderKey);
    setFiles(exitingArr);
  };

  const requestStoragePermission = async () => {
    try {
      if (Platform.constants['Release'] < 11) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your storage to display files',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  useEffect(() => {
    const onFinishedPlaying = () => {
      setPlayingAudioId(null);
    };
    const subscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      onFinishedPlaying,
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const playSound = name => {
    const fileName = name.replace('.mp3', '');
    try {
      if (playingAudioId === fileName) {
        SoundPlayer.stop();
        setPlayingAudioId(null);
      } else {
        SoundPlayer.stop();
        SoundPlayer.playSoundFile(fileName, 'mp3');
        setPlayingAudioId(fileName);
      }
    } catch (e) {
      Alert.alert('Error', 'Unable to play sound: ' + e.message);
    }
  };

  console.log(isPlaying);

  const deleteFile = async item => {
    console.log(item);

    Alert.alert('Delete file', 'You want to delete file', [
      {
        text: 'Yes',
        onPress: async () => {
          removeRecordingById(files, item.id);
          getItem();
        },
      },
      {
        text: 'No',
      },
    ]);
  };

  const removeRecordingById = async (recordings, idToRemove) => {
    const newRecordings = recordings.filter(
      recording => recording.id !== idToRemove,
    );
    console.log('Updated recordings:', newRecordings);
    await setStarage(vioceRecorderKey, newRecordings);
    return;
  };

  const renderItem = ({item}) => {
    const fileName = item.name.replace('.mp3', '');
    return (
      <View
        style={[
          styles.flatListView,
          {
            width: files.length == 1 ? '66%' : '46%',
            backgroundColor: item.color,
          },
        ]}>
        <Text style={{color: '#000'}}>{item.name}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <TouchableOpacity onPress={() => playSound(item.name)}>
            <Image
              source={
                playingAudioId === fileName
                  ? require('../assets/stop.png')
                  : require('../assets/play.png')
              }
              style={{height: 35, width: 35, marginHorizontal: 10}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteFile(item)}>
            <Image source={require('../assets/delete.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFiles().then(() => setRefreshing(false));
  }, []);

  const onClickRecorderPage = () => {
    navigation.navigate('SoundRecodre');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={files}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // eslint-disable-next-line react/no-unstable-nested-components
        ListEmptyComponent={() => {
          return (
            <View style={styles.EmptyContainer}>
              <Image
                source={require('../assets/Search.png')}
                style={styles.image}
              />
              <Text style={styles.title}>No Recording Found!!</Text>
              <Text style={styles.subtitle}>
                There's nothing here yet. Hit the record button to capture
                something amazing!
              </Text>
            </View>
          );
        }}
      />
      <TouchableOpacity
        style={styles.RecordingView}
        onPress={onClickRecorderPage}>
        <Image
          source={require('../assets/Record.png')}
          style={styles.Recording}
        />
      </TouchableOpacity>
    </View>
  );
};

export default RecorderList;
