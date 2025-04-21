import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DownNavbar = ({ style }: { style?: object }) => {
    
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Image
                    source={require('../assets/images/home.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>
            <TouchableOpacity>
                <Image
                    source={require('../assets/images/search.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>
            <TouchableOpacity>
                <Image
                    source={require('../assets/images/cart.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>
            <TouchableOpacity>
                <Image
                    source={require('../assets/images/profile.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 70,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    icon: {
        width: 25,
        height: 25,
        color: '#010080',
    },
});

export default DownNavbar;