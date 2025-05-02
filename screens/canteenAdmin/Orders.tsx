import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type AdminStackParamList = {
  AdminDashboard: undefined;
};

const Orders = () => {
  const navigation = useNavigation<NavigationProp<AdminStackParamList>>();

  const orders = [
    { id: '1', customer: 'Ravi Kumar', item: 'idly', status: 'Preparing' },
    { id: '2', customer: 'Anjali Mehta', item: ' Dosa', status: 'Ready' },
    { id: '3', customer: 'Vikram Patel', item: 'Biryani', status: 'Pending' },
    { id: '4', customer: 'Neha Sharma', item: 'Tea', status: 'Delivered' },
    { id: '5', customer: 'Aman Joshi', item: 'Dosa', status: 'Cancelled' },
  ];

  const renderItem = ({ item }: { item: typeof orders[0] }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderText}>👤 {item.customer}</Text>
      <Text style={styles.orderText}>🍽️ {item.item}</Text>
      <Text style={styles.orderStatus}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with icons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <TouchableOpacity 
        onPress={() => navigation.navigate('AdminDashboard')}>
        <Text style={styles.headerIcon}>Home</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  header: {
    backgroundColor: '#010080',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcon: {
    color: '#fff',
    fontSize: 22,
  },
  
  listContent: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderColor: '#ffe0b2',
    borderWidth: 1,
    elevation: 2,
  },
  orderText: {
    fontSize: 16,
    color: '#3e2723',
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 14,
    color: '#6d4c41',
    fontStyle: 'italic',
  },
});

export default Orders;
