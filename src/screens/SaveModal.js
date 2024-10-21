import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import SoundPlayer from 'react-native-sound-player';

const SaveModal = ({visible, onClose, name, onSubmit}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    const filename = name.split('/').pop();
    const file = filename.replace('.mp3', '');
    console.log(file);
    try {
      SoundPlayer.playSoundFile(file, 'mp3');
    } catch (e) {
      Alert.alert('Error', 'Unable to play sound: ' + e.message);
    }
  };

  const handleBoxSelect = index => {
    onSubmit();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Play Stop</Text>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={togglePlayPause}>
              <Image
                source={
                  isPlaying
                    ? require('../assets/stop.png')
                    : require('../assets/play.png')
                }
                style={styles.icon}
              />
            </TouchableOpacity>
            
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.box, styles.selectedBox]}
              onPress={() => handleBoxSelect()}>
              <Image
                source={require('../assets/right.png')}
                style={styles.checkIcon}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  section: {
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    width: 30,
    height: 30,
  },
  box: {
    width: 60,
    height: 60,
    backgroundColor: '#fde2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
  },
  selectedBox: {
    backgroundColor: '#fad4d4',
  },
  checkIcon: {
    width: 50,
    height: 50,
  },
  closeButton: {
    backgroundColor: '#113C6D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SaveModal;
