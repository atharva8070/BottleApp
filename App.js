import React, { useState } from 'react';
import { View, Button, Image, Alert, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

const App = () => {
  const [photo, setPhoto] = useState(null);

  const handleCapturePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.cancelled) {
        setPhoto(result.uri);
      }
    }
  };

  const handleBrowsePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.cancelled) {
        setPhoto(result.uri);
      }
    }
  };

  const handleSubmitPhoto = async () => {
    if (photo) {
      const asset = await MediaLibrary.createAssetAsync(photo);
      Alert.alert('Submitted', 'Photo has been submitted!');
    } else {
      Alert.alert('Error', 'No photo selected.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {photo && (
        <Image
          source={{ uri: photo }}
          style={{ width: 200, height: 200, marginBottom: 10 }}
        />
      )}
      <Text style={styles.sectionTitle}>Welcome!</Text><View style={styles.spacing} />
      <View style={styles.buttonContainer}>
        <Button title="Capture Photo" onPress={handleCapturePhoto} style={styles.button} /><View style={styles.spacing} />
        <Button title="Browse Photo" onPress={handleBrowsePhoto} style={styles.button} /><View style={styles.spacing} />
        <Button title="Submit Photo" onPress={handleSubmitPhoto} disabled={!photo} style={styles.button} />
      </View>
    </View>
    
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    width: '50%',
  },
  button: {
    flex: 1,
    marginVertical: 10,
  },
  spacing: {
    marginVertical: 15,
  },
  sectionTitle:{
    fontSize: 24,
    fontWeight: 'bold',
  },
});
export default App;