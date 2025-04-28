import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigationTypes'; 

type AddUserNavigationProp = StackNavigationProp<RootStackParamList, 'AddUser'>; 
const AddUser = () => {
  const navigation = useNavigation<AddUserNavigationProp>(); 

  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    mobile: '',
    email: '',
    aadhaar: '',
    adminName: '',
    adminId: '',
    otp: ['', '', '', ''],
  });

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });
  };

  const sendOtp = () => {
    setOtpSent(true);
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backArrow}>&#8592;</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.imageUpload}>
          <Text style={styles.plusSign}>+</Text>
        </View>

        <TextInput
          placeholder="Enter worker full name"
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
          style={styles.input}
        />
        {/* Other form fields... */}

        <TouchableOpacity onPress={sendOtp} style={styles.sendOtpButton}>
          <Text style={styles.sendOtpText}>Send OTP</Text>
        </TouchableOpacity>

        <View style={styles.otpContainer}>
          {formData.otp.map((digit, index) => (
            <TextInput
              key={index}
              value={digit}
              onChangeText={(text) => handleOtpChange(index, text)}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="numeric"
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          proposed by <Text style={styles.footerBold}>WovVtech</Text>
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { backgroundColor: '#1e3a8a', height: 50, justifyContent: 'center', paddingLeft: 10 },
  backArrow: { color: 'white', fontSize: 24 },
  form: { alignItems: 'center', padding: 16 },
  imageUpload: { width: '30%', height: '15%', borderRadius: 48, backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  plusSign: { fontSize: 40, color: '#9ca3af' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, width: '90%', padding: 12, marginBottom: 10 },
  sendOtpButton: { alignSelf: 'flex-end', marginBottom: 10 },
  sendOtpText: { color: '#2563eb', fontSize: 14 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '60%', marginBottom: 20 },
  otpInput: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, width: '20%', height: 40, textAlign: 'center', fontSize: 18 },
  submitButton: { backgroundColor: '#1e3a8a', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, width: '90%', alignItems: 'center' },
  submitButtonText: { color: 'white', fontSize: 16 },
  footerText: { textAlign: 'center', marginTop: 20 },
  footerBold: { fontWeight: 'bold' },
});

export default AddUser;
