import React, { useState } from "react";
import { View, Button, Image, Alert, StyleSheet, Text } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import { HeaderBackButton } from "react-navigation-stack";
import * as ImagePicker from "expo-image-picker";

const SubmitPhotoScreen = ({ navigation }) => {
  const photoUri = navigation.getParam("photoUri", null);

  //For the Delete Button
  const handleDeletePhoto = () => {
    Alert.alert(
      "Delete Photo?",
      "Are you sure you want to delete this photo?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Delete",
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSubmitPhoto = async () => {
    const formData = new FormData();
    formData.append('image', {
      uri: photoUri,
      name: 'image.jpg',
      type: 'image/jpg',
    });

    try {
      const response = await fetch('http://your-flask-app-url/process-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const bottleCount = result.count;
        // Navigate to the next screen and pass the bottle count as a parameter
        navigation.navigate('CountScreen', { bottleCount });
      } else {
        // Handle error response
        console.error('Image processing failed');
      }
    } catch (error) {
      // Handle network or fetch error
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image source={{ uri: photoUri }} style={styles.imageStyle} />
      <View style={styles.buttonContainer}>
        <View style={styles.spacing}>
          <Button
            color="#2C67B7"
            title="Delete Photo"
            onPress={handleDeletePhoto}
          />
        </View>
        <Button
          color="#2C67B7"
          title="Submit"
          onPress={handleSubmitPhoto}
        />
      </View>
    </View>
  );
};

//For navigating back to the previous screen
SubmitPhotoScreen.navigationOptions = ({ navigation }) => {
  return {
    headerLeft: () => (
      <HeaderBackButton
        onPress={() =>
          Alert.alert(
            "Stop Processing?",
            "Your photo is not processed yet, are you sure you want to go back? ",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => {},
              },
              {
                text: "Yes",
                onPress: () => navigation.goBack(),
              },
            ],
            { cancelable: true }
          )
        }
      />
    ),
  };
};

//For opening the camera and crop functionality
const App = ({ navigation }) => {
  const openCamera = () => {
    ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    })
      .then((image) => {
        if (!image.cancelled) {
          console.log(image);
          navigation.navigate("SubmitPhoto", { photoUri: image.uri });
        }
      })
      .finally(() => {
        console.log("photo clicked");
      });
  };

  //For Browsing for a photo
  const handleBrowsePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        navigation.navigate("SubmitPhoto", { photoUri: result.uri });
      }
    }
  };

  //For the submission of the photo
  const handleSubmitPhoto = async () => {
    const formData = new FormData();
    formData.append('image', {
      uri: photoUri,
      name: 'image.jpg',
      type: 'image/jpg',
    });
  
    try {
      const response = await fetch('http://192.168.29.5:5000/process-image', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        const bottleCount = result.count;
        // Navigate to the next screen and pass the bottle count as a parameter
        navigation.navigate('CountScreen', { bottleCount });
      } else {
        // Handle error response
        console.error('Image processing failed');
      }
    } catch (error) {
      // Handle network or fetch error
      console.error(error);
    }
  };
  

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={styles.sectionTitle}>Welcome to BottleApp!</Text>
      <Text style={styles.bodyText}>
        Let's work together to create a cleaner and more sustainable future.
        Start counting now and make a positive impact on the environment!
      </Text>
      <View style={styles.spacing} />
      <View style={styles.buttonContainer}>
        <Button
          color="#2C67B7"
          title="Capture Photo"
          onPress={openCamera}
          style={styles.button}
        />
        <Text style={styles.miniText}>
          Click this button to capture a new photo using your device's camera.
        </Text>
        <View style={styles.spacing} />
        <Button
          color="#2C67B7"
          title="Browse Photo"
          onPress={handleBrowsePhoto}
          style={styles.button}
        />
        <Text style={styles.miniText}>
          Click this button to choose an existing image from your device's
          gallery.
        </Text>
        <View style={styles.spacing} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "50%",
  },
  button: {
    flex: 1,
    marginVertical: 10,
    textAlign: "center",
  },
  spacing: {
    marginVertical: 35,
  },
  mtextSpacing: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 0,
    color: "#2C67B7",
  },
  bodyText: {
    width: "90%",
    fontSize: 16,
    textAlign: "center",
    paddingTop: 40,
  },
  miniText: {
    width: "90%",
    fontSize: 12,
    alignSelf: "center",
    textAlign: "center",
    paddingTop: 10,
  },
  imageStyle: {
    width: "80%",
    height: undefined,
    aspectRatio: 1,
    marginBottom: 10,
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2C67B7',
    marginTop: 20,
  },
});

const CountScreen = ({ navigation }) => {
  const bottleCount = navigation.getParam('bottleCount', 0);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>Bottle Count:</Text>
      <Text style={styles.count}>{bottleCount}</Text>
    </View>
  );
};

const AppNavigator = createStackNavigator(
  {
    BottleApp: { screen: App },
    SubmitPhoto: { screen: SubmitPhotoScreen },
    CountScreen: { screen: CountScreen },
  },
  {
    initialRouteName: 'BottleApp',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
