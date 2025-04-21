import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    // Add other screens here if needed
    Dashboard: undefined; // Define the Dashboard screen route
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

const SelectCanteenScreen = () => {
    const [selectedCanteen, setSelectedCanteen] = useState<string | null>(null);
    const navigation = useNavigation<NavigationProp>();

    const canteens = [
        { id: '1', name: 'Annapoorna Canteen' },
        { id: '2', name: 'Sachin Canteen' },
        { id: '3', name: 'Rahul Canteen' },
    ];

    const handleCanteenSelect = (canteenName: string) => {
        setSelectedCanteen(canteenName);
        console.log(`Selected: ${canteenName}`);
    };

    const handleConfirm = () => {
        if (selectedCanteen) {
            navigation.navigate('Dashboard'); // Navigate to the Dashboard screen
        }
    };

    const renderCanteenItem = ({ item }: { item: { id: string; name: string } }) => (
        <TouchableOpacity
            style={[
                styles.canteenItem,
                selectedCanteen === item.name && styles.selectedCanteenItem,
            ]}
            onPress={() => handleCanteenSelect(item.name)}
        >
            <Text style={styles.canteenText}>{item.name}</Text>
        </TouchableOpacity>
    );

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
            <Text style={styles.title}>Select a Canteen</Text>
            <FlatList
                data={canteens}
                keyExtractor={(item) => item.id}
                renderItem={renderCanteenItem}
                contentContainerStyle={styles.listContainer}
            />
            {selectedCanteen && (
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center',
        color: '#010080',
        marginTop: 20,
    },
    logo: {
        width: 200,
        height: 200,
    },
    listContainer: {
        paddingBottom: 16,
    },
    canteenItem: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        width: '90%',
        alignSelf: 'center',
    },
    selectedCanteenItem: {
        backgroundColor: '#cce5ff', // Highlight color for selected canteen
    },
    canteenText: {
        color: '#010080',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    confirmButton: {
        backgroundColor: '#010080',
        padding: 12,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 50,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SelectCanteenScreen;
