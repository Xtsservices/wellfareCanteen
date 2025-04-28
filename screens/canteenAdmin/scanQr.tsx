import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  VerifyToken: undefined;
  AdminDashboard: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'VerifyToken'>;

const BluetoothControlScreen = () => {
  const device = useCameraDevice('back');
  const navigation = useNavigation<NavigationProp>();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animatedValue]);

  const handleVerifyPress = () => {
    navigation.navigate('VerifyToken'); // Navigate to the verifyToken screen
  };

  if (device == null) {
    return <Text>Camera not available</Text>;
  }

  const translateY = animatedValue.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0, 250 - 2], // Adjusted to stay within the block height (250px - redLine height)
  });

  return (
    <View style={styles.container}>
      {/* Camera Preview */}
      <View style={styles.cameraContainer}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
        />
      </View>

      {/* QR Code Overlay */}
      <View style={styles.overlay}>
        <View style={styles.qrBlock}>
          <Animated.View
            style={[
              styles.redLine,
              {
                transform: [{translateY}],
              },
            ]}
          />
        </View>
      </View>

      {/* Overlay Content */}
      <View style={styles.overlayContent}>
        <View style={styles.tokenContainer}>
          <TouchableOpacity
            style={{
              marginVertical: 30,
              alignItems: 'center',
              marginTop: 20,
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 10,
              width: '80%',
            }}>
            <Text style={{fontSize: 20, textAlign: 'center', color: '#010080'}}>
              Verify
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleVerifyPress}
            style={{
              marginVertical: 30,
              alignItems: 'center',
              marginTop: 20,
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 10,
              width: '80%',
            }}>
            <Text style={{fontSize: 20, textAlign: 'center', color: '#010080'}}>
              Enter token number
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>proposed by</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrBlock: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  redLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'red',
  },
  overlayContent: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    justifyContent: 'space-between',
  },
  tokenContainer: {
    marginTop: 500,
    alignItems: 'center',
    marginBottom: 40,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: 'white',
    fontSize: 14,
  },
});

export default BluetoothControlScreen;