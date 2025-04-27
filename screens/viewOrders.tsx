import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import DownNavbar from './downNavbar';

export interface Order {
  id: string;
  orderNumber: string;
  dateTime: string;
  session: string;
}

const orders: Order[] = [
  {
    id: '1',
    orderNumber: '12345',
    dateTime: '2023-10-01 12:30 PM',
    session: 'Afternoon',
  },
  {
    id: '2',
    orderNumber: '12346',
    dateTime: '2023-10-02 01:00 PM',
    session: 'Afternoon',
  },
  {
    id: '3',
    orderNumber: '12347',
    dateTime: '2023-10-03 02:15 PM',
    session: 'Afternoon',
  },
];

const ViewOrders: React.FC = () => {
  const renderOrder = ({item}: {item: Order}) => (
    <View style={styles.orderItem}>
      <View style={styles.orderDetails}>
        <Text style={styles.orderNumber}>Order Number: {item.orderNumber}</Text>
        <Text style={styles.session}>{item.session}</Text>
        <Text style={styles.dateTime}>{item.dateTime}</Text>
      </View>
      <TouchableOpacity style={styles.reorderButton}>
        <Text style={styles.reorderText}>Re-Order</Text>
      </TouchableOpacity>
      {/* <Icon name="chevron-forward" size={24} color="#000" /> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Icon name="arrow-back" size={24} color="#fff" /> */}
        <Text style={styles.headerTitle}>Orders History</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContainer}
      />
      <DownNavbar style={styles.stckyNavbar} />
      {/* Footer or any additional content can go here */}
      {/* <Text style={styles.footer}>Powered by WorldTech.in</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginTop: 50,
  },
  header: {
    backgroundColor: '#000080',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  listContainer: {
    padding: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderDetails: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  session: {
    fontSize: 14,
    color: '#555',
  },
  dateTime: {
    fontSize: 14,
    color: '#555',
  },
  reorderButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  reorderText: {
    fontSize: 14,
    color: '#000',
  },
  footer: {
    textAlign: 'center',
    padding: 16,
    color: '#555',
  },
  stckyNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});

export default ViewOrders;
