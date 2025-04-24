import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  SelectCanteen: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'SelectCanteen'>;

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [showResend, setShowResend] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const otpInputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpSent) {
      setShowResend(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const sendOtp = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit number');
      return;
    }
    try {
      const response = await fetch('http://10.0.2.2:3002/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: phoneNumber }),
      });

      if (response.ok) {
        Alert.alert('OTP Sent');
        setOtpSent(true);
        setTimer(60);
        setShowResend(false);
      } else {
        Alert.alert('Error', 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      Alert.alert('Network Error', 'Could not connect to server');
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      Alert.alert('Enter full 6-digit OTP');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3002/api/verifyOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: phoneNumber, otp: enteredOtp }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        Alert.alert('OTP Verified');
        navigation.navigate('SelectCanteen');
      } else {
        Alert.alert('Invalid OTP', data.message || 'Try again');
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      Alert.alert('Network Error', 'Could not verify OTP');
    }
  };

  const resendOtp = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3002/api/resendOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: phoneNumber }),
      });

      if (response.ok) {
        Alert.alert('OTP Resent');
        setTimer(60);
        setShowResend(false);
      } else {
        Alert.alert('Error', 'Could not resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      Alert.alert('Network Error', 'Could not resend OTP');
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
          maxLength={10}
        />
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={sendOtp}>
        <Text style={styles.confirmText}>Get OTP</Text>
      </TouchableOpacity>

      {otpSent && (
        <>
          <Text style={styles.otpLabel}>Enter OTP</Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  otpInputs.current[index] = ref;
                }}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={verifyOtp}>
            <Text style={styles.confirmText}>Verify OTP</Text>
          </TouchableOpacity>

          {showResend ? (
            <TouchableOpacity style={styles.smallButton} onPress={resendOtp}>
              <Text style={styles.smallButtonText}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ marginBottom: 10, color: 'gray' }}>
              Resend in {timer}s
            </Text>
          )}
        </>
      )}
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
  smallButton: {
    backgroundColor: '#010080',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
