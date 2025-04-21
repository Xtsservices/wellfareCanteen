import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import DownNavbar from './downNavbar';

const Dashboard = () => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image  style={styles.logo} />
                <View style={styles.headerIcons}>
                    <TouchableOpacity>
                        <Image style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <TextInput placeholder="Search..." style={styles.searchInput} />
                <TouchableOpacity>
                    <Image style={styles.micIcon} />
                </TouchableOpacity>
            </View>

            {/* Banner */}
            <Image style={styles.banner} />

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
                {['All', 'Today Special', 'Tiffins', 'Veg', 'Non-Veg'].map((category, index) => (
                    <TouchableOpacity key={index} style={styles.categoryButton}>
                        <Text style={styles.categoryText}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Food Items */}
            <ScrollView contentContainerStyle={styles.foodItems}>
                {[1, 2, 3, 4, 5, 6].map((item, index) => (
                    <TouchableOpacity key={index} style={styles.foodCard}>
                        <Image style={styles.foodImage} />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Bottom Navigation */}
            <DownNavbar style={styles.stickyNavbar} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0014A8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    logo: {
        width: 50,
        height: 50,
    },
    headerIcons: {
        flexDirection: 'row',
    },
    icon: {
        width: 30,
        height: 30,
        marginLeft: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
    },
    micIcon: {
        width: 25,
        height: 25,
    },
    banner: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
    },
    categories: {
        flexDirection: 'row',
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    categoryButton: {
        backgroundColor: '#0014A8',
        padding: 10,
        borderRadius: 20,
        marginRight: 10,
    },
    categoryText: {
        color: '#fff',
        fontSize: 14,
    },
    foodItems: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 10,
        paddingBottom: 60, // Add padding to avoid overlap with the sticky navbar
    },
    foodCard: {
        width: '45%',
        backgroundColor: '#0014A8',
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
    },
    foodImage: {
        width: '100%',
        height: 100,
    },
    stickyNavbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default Dashboard;
