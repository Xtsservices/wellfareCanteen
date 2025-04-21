import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';

const ProfileScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={require('../assets/images/profilescreenImage.png')} style={styles.image} />
            </View>
            <View style={styles.formContainer}>
                <View style={styles.row}>
                    <TextInput style={styles.input} placeholder="First Name" />
                    <TextInput style={styles.input} placeholder="Last Name" />
                </View>
                <View style={styles.row}>
                    <TextInput style={styles.input} placeholder="Date Of Birth" />
                    <TextInput style={styles.input} placeholder="Gender" />
                </View>
                <TextInput style={styles.inputFull} placeholder="Enter your Email" />
                <TextInput style={styles.inputFull} placeholder="Create Password" secureTextEntry />
                <TextInput style={styles.inputFull} placeholder="Enter your ID" />
                <TouchableOpacity style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        padding: 20,
    },
    imageContainer: {
        marginBottom: 20,

    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    formContainer: {
        backgroundColor: '#000080',
        borderRadius: 10,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        flex: 1,
        marginHorizontal: 5,
    },
    inputFull: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    submitButton: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#000080',
        fontWeight: 'bold',
    },
});

export default ProfileScreen;