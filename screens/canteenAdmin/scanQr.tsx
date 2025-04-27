// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, PermissionsAndroid, Alert } from 'react-native';
// import { RNCamera } from 'react-native-camera';

// const ScanQr = () => {
//     const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//     const [scanned, setScanned] = useState(false);

//     const requestCameraPermission = async () => {
//         try {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.CAMERA,
//                 {
//                     title: 'Camera Permission',
//                     message: 'This app needs access to your camera to scan QR codes.',
//                     buttonNeutral: 'Ask Me Later',
//                     buttonNegative: 'Cancel',
//                     buttonPositive: 'OK',
//                 }
//             );
//             setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
//         } catch (err) {
//             console.warn(err);
//         }
//     };

//     useEffect(() => {
//         requestCameraPermission();
//     }, []);

//     const handleBarCodeScanned = (event: { data: string; type: string }) => {
//         setScanned(true);
//         Alert.alert('Scanned!', `Bar code with type ${event.type} and data ${event.data} has been scanned!`);
//     };

//     if (hasPermission === null) {
//         return <Text>Requesting for camera permission...</Text>;
//     }
//     if (hasPermission === false) {
//         return <Text>No access to camera</Text>;
//     }

//     return (
//         <View style={styles.container}>
//             <ImageBackground
//                 source={{ uri: 'https://via.placeholder.com/300x600' }} // Replace with your background image URL
//                 style={styles.backgroundImage}
//             >
//                 <View style={styles.scannerContainer}>
//                     <RNCamera
//                         style={StyleSheet.absoluteFillObject}
//                         onBarCodeRead={scanned ? undefined : handleBarCodeScanned}
//                         captureAudio={false}
//                     />
//                 </View>
//                 <TouchableOpacity
//                     style={styles.button}
//                     onPress={() => setScanned(false)}
//                 >
//                     <Text style={styles.buttonText}>Verify</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.button}>
//                     <Text style={styles.buttonText}>Enter token number</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.footerText}>proposed by</Text>
//             </ImageBackground>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     backgroundImage: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     scannerContainer: {
//         width: '80%',
//         height: '50%',
//         borderWidth: 2,
//         borderColor: 'white',
//     },
//     button: {
//         backgroundColor: 'blue',
//         padding: 15,
//         marginVertical: 10,
//         borderRadius: 5,
//         width: '80%',
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 16,
//     },
//     footerText: {
//         marginTop: 20,
//         color: 'white',
//     },
// });

// export default ScanQr;
