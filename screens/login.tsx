import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  SelectCanteen: undefined;
};
type NavigationProp = StackNavigationProp<RootStackParamList, 'SelectCanteen'>;

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigation = useNavigation<NavigationProp>();

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:3002/api/login', {
        mobile: phoneNumber,
      });
      if (response.status === 200) {
        console.log('OTP sent successfully');
        Alert.alert('OTP Sent');
      } else {
        console.error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:3002/api/verifyOtp', {
        mobile: phoneNumber,
        otp: otp.join(''),
      });
      if (response.status === 200 && response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        console.log('OTP verified and token stored', response.data.token);
        navigation.navigate('SelectCanteen');
      } else {
        console.error('Failed to verify OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: 'https://www.joinindiannavy.gov.in/images/octaginal-crest.png',
          }}
          style={styles.logo}
        />
      </View>
      <Text style={styles.title}>Login or Sign up</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.flag}>🇮🇳</Text>
        <TextInput
          style={styles.phoneInput}
          placeholder="+91 | Enter your phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={sendOtp}>
        <Text style={styles.confirmText}>Get OTP</Text>
      </TouchableOpacity>
      <Text style={styles.otpLabel}>Enter OTP</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={value => handleOtpChange(value, index)}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={verifyOtp}>
        <Text style={styles.confirmText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    backgroundColor: '#010080',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 100,
    borderRadius: 20,
    marginBottom: 20,
    width: '100%',
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#010080',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
    height: 50,
  },
  flag: {
    fontSize: 18,
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
  },
  otpLabel: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#010080',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    width: 50,
    height: 50,
  },
  confirmButton: {
    backgroundColor: '#010080',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
