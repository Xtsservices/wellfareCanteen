import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import DownNavbar from './downNavbar';

interface Order {
  id: string;
  itemName: string;
  quantity: number;
  price: number;
}

const orders: Order[] = [
  {id: '1', itemName: 'Burger', quantity: 2, price: 10},
  {id: '2', itemName: 'Pizza', quantity: 1, price: 15},
  {id: '3', itemName: 'Pasta', quantity: 3, price: 20},
];

const ViewOrders: React.FC = () => {
  const renderOrder = ({item}: {item: Order}) => (
    <View style={styles.orderItem}>
      <Text style={styles.itemName}>{item.itemName}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text>Price: ${item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={renderOrder}
      />
      <DownNavbar
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          paddingVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ViewOrders;
