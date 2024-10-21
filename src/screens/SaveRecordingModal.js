import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';

const colorOptions = [
  '#fde2e2',
  '#e2e2fd',
  '#fad4d4',
  '#d4fad4',
  '#d4e8fa',
  '#fae8d4',
];

const SaveRecordingModal = ({ visible, onClose, onSubmit, placeholder }) => {
  const path = placeholder.split('/').pop();
  const fileName = path.replace('.mp3', '');

  const [recordingName, setRecordingName] = useState(fileName);
  const [selectedColor, setSelectedColor] = useState('#fde2e2');

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSubmit = () => {
    onSubmit(recordingName ? recordingName : fileName, selectedColor);
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Save Recording</Text>
          <TextInput
            style={styles.input}
            placeholder={fileName}
            value={recordingName}
            onChangeText={(text) => setRecordingName(text)}
            placeholderTextColor={'#000'}
          />
          <Text style={styles.subtitle}>Select Card Color</Text>
          <FlatList
            data={colorOptions}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.colorOption,
                  { backgroundColor: item },
                  selectedColor === item && styles.selectedColor,
                ]}
                onPress={() => handleColorSelect(item)}
              >
                {selectedColor === item && (
                  <Image
                    source={require('../assets/right.png')} 
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: '#113C6D' }]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderColor: '#000',
  },
  checkIcon: {
    width: 20,
    height: 20,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SaveRecordingModal;
