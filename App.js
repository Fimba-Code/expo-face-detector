import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
// import Animated, { useCode } from 'react-native-reanimated';



export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const transX = useRef(new Animated.Value(0)).current;
  const transY = useRef(new Animated.Value(0)).current;

  const [boxSize, setBoxSize] = useState({
    height: 0,
    width: 0
  })
  const [hasFaceInFrame, setHasFaceInFrame] = useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }



  const handleFacesDetected = (faces) => {

    setHasFaceInFrame(() => faces.faces.length >= 1)
    if (faces.faces.length < 1) return

    Animated.timing(transX, {
      useNativeDriver: true,
      toValue: faces.faces[0].bounds.origin.x,
    }).start();

    Animated.timing(transY, {
      useNativeDriver: true,
      toValue: faces.faces[0].bounds.origin.y,
    }).start()

    setBoxSize({
      height: faces.faces[0].bounds.size.height,
      width: faces.faces[0].bounds.size.width
    })
  }


  return (
    <Camera style={{ flex: 1 }} zoom={0} type={type}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.Constants.Mode.accurate,
        detectLandmarks: FaceDetector.Constants.Landmarks.none,
        runClassifications: FaceDetector.Constants.Classifications.none,
        minDetectionInterval: 100,
        tracking: true,
      }}
    >
      {hasFaceInFrame && <Animated.View style={{
        position: 'absolute',
        width: boxSize.width,
        height: boxSize.height,
        borderWidth: 2,
        borderRadius: 6,
        borderColor: 'green',
        transform: [
          {
            translateX: transX,
          },
          {
            translateY: transY,
          }
        ],

      }} />}


      <SafeAreaView style={{ flex: 1 }}>
        {hasFaceInFrame && <Text style={{ position: 'absolute', bottom: '20%', left: '30%', fontSize: 20, color: 'red' }}>Face Detected</Text>}
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-start',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'red', marginLeft: 10, fontWeight: 'bold' }}> Flip Camera </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Camera>
  );
}