import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [language, setLanguage] = useState<'en' | 'hi'>('en'); // State to manage language

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };

    const handleConfirm = () => {
        console.log('Phone Number:', phoneNumber);
        console.log('OTP:', otp.join(''));
    };

    const translations = {
        en: {
            loginOrSignUp: 'Login or Sign up',
            enterPhoneNumber: '+91 | Enter your phone number',
            otp: 'OTP',
            confirm: 'Confirm',
            or: 'OR',
            poweredBy: 'powered by',
        },
        hi: {
            loginOrSignUp: 'लॉगिन या साइन अप करें',
            enterPhoneNumber: '+91 | अपना फोन नंबर दर्ज करें',
            otp: 'ओटीपी',
            confirm: 'पुष्टि करें',
            or: 'या',
            poweredBy: 'द्वारा संचालित',
        },
    };

    const currentText = translations[language];

    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: "#010080", justifyContent: 'center', padding: 100, width: '100%', borderRadius: 20 }}>
                <Image
                    source={{
                        uri: 'https://www.joinindiannavy.gov.in/images/octaginal-crest.png',
                    }}
                    style={styles.logo}
                />
            </View>
            <View style={styles.languageSwitchContainer}>
                <TouchableOpacity onPress={() => setLanguage(language === 'en' ? 'hi' : 'en')} style={{ marginBottom: 20, borderColor: '#010080' }}>
                    <Text style={[styles.languageSwitch, { fontSize: 16 }]}>
                        {language === 'en' ? 'हिंदी' : 'English'}
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>{currentText.loginOrSignUp}</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.flag}>🇮🇳</Text>
                <TextInput
                    style={styles.phoneInput}
                    placeholder={currentText.enterPhoneNumber}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
            </View>
            <Text style={styles.otpLabel}>{currentText.otp}</Text>
            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={styles.otpInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                    />
                ))}
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmText}>{currentText.confirm}</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>{currentText.or}</Text>
            <View style={styles.socialContainer}>
                <TouchableOpacity>
                    {/* Add social icons here */}
                </TouchableOpacity>
                <TouchableOpacity>
                    {/* Add social icons here */}
                </TouchableOpacity>
            </View>
            <Text style={styles.footerText}>{currentText.poweredBy}</Text>
            {/* Add footer logo here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    languageSwitchContainer: {
        alignItems: 'flex-end',
        width: '100%',
        paddingHorizontal: 20,
    },
    logo: {
        width: 200,
        height: 200,
    },
    languageSwitch: {
        alignSelf: 'flex-end',
        color: '#010080',
        fontSize: 20,
        marginBottom: 20,
        marginRight: 20,
        marginTop: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#010080',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: '90%',
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
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '80%',
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
        width: '80%',
        alignItems: 'center',
        marginBottom: 20,
    },
    confirmText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    orText: {
        fontSize: 16,
        marginBottom: 20,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        marginBottom: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 5,
    },
    footerLogo: {
        width: 100,
        height: 30,
    },
});

export default LoginScreen;