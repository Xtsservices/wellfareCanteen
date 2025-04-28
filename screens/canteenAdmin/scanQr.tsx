import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

const BluetoothControlScreen = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then(permissionGranted => {
        if (!permissionGranted) {
          setIsActive(false);
        }
      });
    }
  }, [hasPermission]);

  if (!hasPermission) {
    return <Text>Camera permission not granted</Text>;
  }

  if (device == null) {
    return <Text>Camera not available</Text>;
  }

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

      {/* Overlay Content */}
      <View style={styles.overlay}>
        <Text style={styles.title}>V</Text>
        
        <View style={styles.tokenContainer}>
          <Text style={styles.verifyText}>Verify</Text>
          <Text style={styles.instructionText}>Enter token number</Text>
          <TextInput
            style={styles.tokenInput}
            placeholder=""
            keyboardType="numeric"
          />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  section: {
    alignItems: 'center',
    marginTop: 30,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: 'white',
    fontSize: 16,
  },
  deviceInfo: {
    alignItems: 'center',
    marginVertical: 30,
  },
  deviceName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tokenContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  verifyText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  tokenInput: {
    backgroundColor: 'white',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    textAlign: 'center',
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