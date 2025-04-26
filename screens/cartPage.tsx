import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import DownNavbar from './downNavbar';
import {useNavigation} from '@react-navigation/native';

const CartPage = () => {
  const navigation = useNavigation();
  
  const handlePayment = () => {
    navigation.navigate('PaymentMethod' as never);
  };

  return (
    <View style={styles.container}>
      {/* Cart Header */}
      <View style={styles.header}>
        <Image style={styles.backButton} />
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconborder}>
            <Image style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconborder}>
            <Image style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Cart Items */}
      <ScrollView style={styles.cartItems}>
        {[1, 2].map((item, index) => (
          <View key={index} style={styles.cartItem}>
            <Image style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>Masala Dosa</Text>
              <View style={styles.quantityControl}>
                <TouchableOpacity style={styles.quantityButton}>
                  <Text style={styles.quantityText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>4</Text>
                <TouchableOpacity style={styles.quantityButton}>
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bill Summary */}
      <View style={styles.billSummary}>
        <Text style={styles.billTitle}>Bill Summary</Text>
        <View style={styles.billRow}>
          <Text>Item Total</Text>
          <Text>399</Text>
        </View>
        <View style={styles.billRow}>
          <Text>GST And Restaurant Charges</Text>
          <Text>29</Text>
        </View>
        <View style={styles.billRow}>
          <Text>Platform Fee</Text>
          <Text>10</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.totalAmount}>Total Amount</Text>
          <Text style={styles.totalAmount}>438</Text>
        </View>
      </View>

      {/* Proceed to Pay Button */}
      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Proceed To Pay</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <DownNavbar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0014A8',
    paddingVertical: 20,
    padding: 30,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    color: '#fff',
  },
  iconborder: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItems: {
    flex: 1,
    padding: 10,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#0014A8',
    width: 25,
    padding: 5,
    borderRadius: 4,
  },
  quantityText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  billSummary: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    margin: 10,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalAmount: {
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#0014A8',
    height: 50,
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    height: 60,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

export default CartPage;
