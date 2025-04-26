import React from 'react';
import {View, TouchableOpacity, StyleSheet, Image, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

// Define your stack's routes
type RootStackParamList = {
  Dashboard: undefined;
  //   Search: undefined;
  CartPage: undefined;
  //   Profile: undefined;
  ViewOrders: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const DownNavbar = ({style}: {style?: object}) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        <Text style={{fontSize: 20, color: '#010080'}}>Home</Text>
        <Image style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ViewOrders')}>
        <Text style={{fontSize: 20, color: '#010080'}}>Orders</Text>
        <Image style={styles.icon}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CartPage')}>
        <Text style={{fontSize: 20, color: '#010080'}}>Cart</Text>
        <Image  style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image style={styles.icon} />
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
