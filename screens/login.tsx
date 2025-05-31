import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {Login, ResendOtp, VerifyOtp} from './services/restApi';

type RootStackParamList = {
  SelectCanteen: undefined;
  AdminDashboard: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'SelectCanteen'>;

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [showResend, setShowResend] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenn, setTokenn] = useState('');
  const navigation = useNavigation<NavigationProp>();

  const otpInputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
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

    if (value.length === 1 && index < otp.length - 1) {
      otpInputs.current[index + 1]?.focus();
    } else if (value === '' && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const validatePhoneNumber = (number: string) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    Toast.show({
      type,
      text1: message,
      position: 'top',
    });
  };

  const sendOtp = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      showToast(
        'error',
        'Invalid phone number. Enter a valid 10-digit number.',
      );
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(Login(), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mobile: phoneNumber}),
      });

      if (response.ok) {
        showToast('success', 'OTP sent successfully.');
        setOtpSent(true);
        setTimer(60);
        setShowResend(false);
      } else {
        showToast('error', 'Failed to send OTP. Try again.');
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      showToast('error', 'Network error. Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      showToast('error', 'Enter the full 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(VerifyOtp(), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mobile: phoneNumber, otp: enteredOtp}),
      });
      console.log('Response:', response);

      const data = await response.json();

      if (response.ok) {
        console.log('Token:', data.token);
        console.log('Phone Number:', phoneNumber);
        showToast('success', 'OTP verified successfully.');

        navigation.navigate('SelectCanteen');

        await AsyncStorage.setItem('authorization', data.token);
        console.log('Authorization Token:', data.token);
        await AsyncStorage.setItem('phoneNumber', phoneNumber);
        console.log("123456789", phoneNumber)
      } else {
        showToast('error', `Invalid OTP: ${data.message || 'Try again.'}`);
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      showToast('error', 'Network error. Could not verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(ResendOtp(), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mobile: phoneNumber}),
      });

      if (response.ok) {
        showToast('success', 'OTP resent successfully.');
        setTimer(60);
        setShowResend(false);
      } else {
        showToast('error', 'Failed to resend OTP. Try again.');
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      showToast('error', 'Network error. Could not resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Welfare Canteen</Text>
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

      {!otpSent && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={sendOtp}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Get OTP</Text>
          )}
        </TouchableOpacity>
      )}

      {otpSent && (
        <>
          <Text style={styles.otpLabel}>Enter OTP</Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => {
                  otpInputs.current[index] = ref;
                }}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={value => handleOtpChange(value, index)}
                onKeyPress={e => handleKeyPress(e, index)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={verifyOtp}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          {showResend ? (
            <TouchableOpacity
              style={styles.smallButton}
              onPress={resendOtp}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.smallButtonText}>Resend OTP</Text>
              )}
            </TouchableOpacity>
          ) : (
            <Text style={{marginBottom: 10, color: 'gray'}}>
              Resend in {timer}s                                                                      
            </Text>
          )}
        </>
      )}

      <Text style={styles.poweredBy}>Powered by 
        <Image
          source={{uri: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCACiAaUDASIAAhEBAxEB/8QAGgABAAMBAQEAAAAAAAAAAAAAAAMEBQECBv/EABkBAQADAQEAAAAAAAAAAAAAAAABAgMEBf/aAAwDAQACEAMQAAAC+qAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKNbXauRbz374uyFK5HTNl89r2paGmIAAAAAAAAAAAAAAAAAAAApVmvH3Yy6OdN+YADxi7qmlC/hatL2BtgAAAAAAAAAAAAAAAAAABzC1K/P0M2GPHs29P5L6XflsOVdea28+USMixnrcxtzIi2ujk2wCQAAAAAAAAAAAAAAAAAGbaqX+ffDq7uNz9Ud+p2l9DKl4i5exdzbDG9aVhM9KePo5vNyjaJGX6TpK1ea6PIPErXcnRiZWR6rbVRZtq655vn6Y9nPW+qRTGgyZ4m+y7cxZUojSQVEaTndKAAAAAULCvzbXsPdpyyUnPO7fCS9emb76ra9DXvdGN6rczOnns2vHvSmfP3mWsU9a+jP0avD35WLRQJcdbmfaq6Z6CvzSkGhm2stK2jFJrShoZ2jSaDs9LzU/Xm1fF6OqnQc7viEgAAAGXqQYaTKGhauRHtRcu1HU53pyz6m3Dhpm6zutPOf29S0g68QAHOoBIAAAAAAAAAAAAAAACtDfi5tJO0PcLiDutZleKs2qPq5lbxMdWYWgAAAAAAAAAAAAAAAAAAAAB49oQcsMrQS+l4C8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACAAMAAAAhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGlPTEAAAAAAAAAAAAAAAAAAAAADpAAAhuAAAAAAAAAAAAAAAAAAAA+usLLHRDAAAAAAAAAAAAAAAAAAAy9hf8SCqFPSqFKCJAIOFDIAAAAAPiGDR0DrYLLyYBFKEL0JECAAAAAGb3K2GXAAASAAAAAAAAAAAAAAAAAGDGI7AAAAAAAAAAAAAAAAAAAAAAARCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//aAAwDAQACAAMAAAAQ888888888888888888888888888888888888888888888888888888888886/Ssy8888888888888888888889/988If888888888888888888883Mx3/wAm9PPPPPPPPPPPPPPPPPPPHKWQ+TqffO6PIsP7Iq/GM/PPPPPBOdt+sbVx7uNcUfsecZ45P/PPPPDpUl1z9PPPPvPPPHPPPPPPPPPPPPOUNsanvPPPPPPPPPPPPPPPPPPPPPLLXfPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP/xAA7EQABAwIDBAcFBgYDAAAAAAABAgMEABEFITESQVGBEyJhcaGx8AYUMkCRIDNCQ9HhEBUjJFDBNKLx/9oACAECAQE/AP8ANvPIYTtuGwoTpEj/AIzeXE10OIHMuAcv2raxBnMgLHZr/qo2INvnYPVVwPyz76GGy4vQVFjKmq96k6fhTutVrfxlwm5Sc8lbjvFQJa9sxZHxp8R8riH91Lbibh1j69a1JxR5xw7KiBuAyrCMRMi7Th6w8RTj7bVukUBfiaceQ02XVmyRneouMxpS+jbJueIrGUFoJmI+JB8PXnSFhaQoaH5SJ1sUfJ3ADyrF2DFkqG45jnUWWY7qXU7qmzlSni6eXYKgPe/xV4epViR1fO3rdWGYJJZeSp2wAPGp6kuwnFDSx8Kw1ajBbUBc2oYgpUUyQjS9xfhrupclwNoWhIO1bfx5Z0uQorLTQuoa52A8/Ko8wuLUytOytO6+RHEH9qGJOdCp/o+qkkHPPLl/upEwtFvYTcLNhnbXkaN7ZU1OedaLqGwQL5bWeXDKkzelS2thO0Fcrd+Rpqe44NoN5bWyc9M7X00pEta3lshI6tt/HlTkxxphTykfDuvu4g2pclxKUbKLqVuvp26acft392xjPRxPiP8Azxr2hh9PG6RI6yM+W/8AXlXSVDiPTSpLI0F/XaaQ+ptQUk2IqJiE3E3UxVL6p1tYZb9Kxx5MeCpI32SPXdUJnoI6GzuArYUiU5Et1XLK5fi+trc6woLP9Ff5RI7+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"}}
          style={{width: 130, height: 40, marginLeft: 5}}
        />
      </Text>
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
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  notificationBar: {
    backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
    borderColor: 'green', // Green border
    borderWidth: 1,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationText: {
    color: 'green', // Green text color for better visibility
    fontSize: 14,
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
  poweredBy: {
    fontSize: 12,
    color: '#555',
    marginTop: 80,
    textAlign: 'center',
  },
});

export default LoginScreen;
