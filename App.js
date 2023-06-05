import React, { useState } from "react";
import { View, Button, Image, Alert, StyleSheet, Text } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
//import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from "expo-image-picker";

//Declares a functional component named SubmitPhotoScreen that takes a navigation prop as input.
const SubmitPhotoScreen = ({ navigation }) => {
  const photoUri = navigation.getParam("photoUri", null); //Retrieves the value of the 'photoUri' parameter from the navigation prop.
console.log('photoUri',photoUri)

  const handleDeletePhoto = () => {
    navigation.goBack();
  };

  const handleSubmitPhoto = () => {
    // Photo submission logic here
  };

  //UI and layout elements for the Photo Submit Screen
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={{ uri: photoUri }}
        style={{ width: 200, height: 200, marginBottom: 10 }}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.spacing}>
          <Button title="Delete Photo" onPress={handleDeletePhoto} />
        </View>
        <Button title="Submit" onPress={handleSubmitPhoto} />
      </View>
    </View>
  );
};

//Declares a functional component named App that takes a navigation prop as input.
const App = ({ navigation }) => {
  const [photo, setPhoto] = useState(null); //Uses the useState hook to declare a state variable named photo and a function named setPhoto to update its value. The initial value of photo is null.

  const [uri, setUri] = useState(null);
  //Declares an asynchronous function named handleCapturePhoto that requests camera permissions using ImagePicker.requestCameraPermissionsAsync
  const openCamera = () => {
    ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    })
      .then((image) => {
        console.log(image)
        setUri(image.path);
        navigation.navigate("SubmitPhoto", { photoUri: image.assets[0].uri });
      })
      .finally((res) => {
        console.log('photo clicked');
      });
  };

  //Declares an asynchronous function named handleBrowsePhoto that requests media library permissions using ImagePicker.requestMediaLibraryPermissionsAsync
  const handleBrowsePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
        navigation.navigate("SubmitPhoto", { photoUri: result.assets[0].uri });
      }
    }
  };

  //Declares an asynchronous function named handleSubmitPhoto that checks if a photo is selected (photo state variable) and then calls MediaLibrary.createAssetAsync to create an asset from the photo.
  const handleSubmitPhoto = async () => {
    if (photo) {
      const asset = await MediaLibrary.createAssetAsync(photo);
      Alert.alert("Submitted", "Photo has been submitted!");
    } else {
      Alert.alert("Error", "No photo selected.");
    }
  };

  //UI and layout elements for main app screen
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {photo && (
        <Image
          source={{ uri: photo }}
          style={{ width: 200, height: 200, marginBottom: 10 }}
        />
      )}
      <Text style={styles.sectionTitle}>Welcome!</Text>
      <View style={styles.spacing} />
      <View style={styles.buttonContainer}>
        <Button
          title="Capture Photo"
          onPress={openCamera}
          style={styles.button}
        />
        <View style={styles.spacing} />
        <Button
          title="Browse Photo"
          onPress={handleBrowsePhoto}
          style={styles.button}
        />
        <View style={styles.spacing} />
      </View>
    </View>
  );
};

//Defines a style object using the StyleSheet.create function
const styles = StyleSheet.create({
  buttonContainer: {
    width: "50%",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginVertical: 10,
  },
  spacing: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

//Creates a stack navigator using createStackNavigator and defines two screens: 'Home' and 'SubmitPhoto'
const AppNavigator = createStackNavigator(
  {
    BottleApp: { screen: App },
    SubmitPhoto: { screen: SubmitPhotoScreen },
  },
  {
    initialRouteName: "BottleApp",
  }
);

//Creates a container component using createAppContainer and passes the AppNavigator as the argument.
const AppContainer = createAppContainer(AppNavigator);

//Exports the AppContainer component as the default export of the module.
export default AppContainer;
