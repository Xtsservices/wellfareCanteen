import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import DownNavbar from './downNavbar';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  id: number;
  quantity: number;
  price: number;
  total: number;
  item: {
    id: number;
    name: string;
    description: string;
    type: string;
    image: string;
    quantity: number;
    quantityUnit: string;
  };
}

interface CartData {
  id: number;
  totalAmount: number;
  cartItems: CartItem[];
  menuConfiguration: {
    name: string;
  };
}

const CartPage = () => {
  const navigation = useNavigation();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = await AsyncStorage.getItem('authorization');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await axios.get(
          'http://10.0.2.2:3002/api/cart/getCart',
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          },
        );

        if (response.data && response.data.data) {
          setCartData(response.data.data);
        } else {
          setError('No cart data found');
        }
      } catch (err) {
        setError('Failed to fetch cart data');
        console.error('Error fetching cart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handlePayment = () => {
    navigation.navigate('PaymentMethod' as never);
  };

  const calculateGSTAndCharges = (subtotal: number) => {
    // Assuming 5% GST and 2% restaurant charges (7% total)
    return subtotal * 0.07;
  };

  const calculatePlatformFee = () => {
    // Fixed platform fee
    return 10;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0014A8" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!cartData) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Your cart is empty</Text>
      </View>
    );
  }

  const subtotal = cartData.cartItems.reduce(
    (sum, item) => sum + item.total,
    0,
  );
  const gstAndCharges = calculateGSTAndCharges(subtotal);
  const platformFee = calculatePlatformFee();
  const totalAmount = subtotal + gstAndCharges + platformFee;

  return (
    <View style={styles.container}>
      {/* Cart Header */}
      <View style={styles.header}>
        <Image style={styles.backButton} />
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconborder}>
            <Image
              source={{
                uri: 'data:image/png;base64,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',
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconborder}>
            <Image
              source={{
                uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX///8WFhgAAAD8/PwYGBoUFBYaGhwWFRn5+fkXFxgXFhrz8/MNDRDo6OgAAAQXFhvc3NwlJSfNzc6VlZWNjY1wcHDi4uLQ0NGhoaNKSkxVVVUTExPu7u+7u7uwsLH///yBgYNCQkR1dXfBwcEtLS9eXl6ZmZloaGg1NTdFRUWpqas9PTxQUE8rKy2Dg4VxcXOWoZakAAAP80lEQVR4nO1diWKjug4Fgyk0hhLShKRtMmnI1nX+/++e5AWysWUwTe/zubfTBYJ9sCzJsmxbloGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBQdf4H/6S2ivGU8GYAAAAAElFTkSuQmCC',
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Cart Items */}
      <ScrollView style={styles.cartItems}>
        {cartData.cartItems.map(item => (
          <View key={item.id} style={styles.cartItem}>
            <Image
              style={styles.itemImage}
              source={{
                uri: item.item.image
                  ? `data:image/png;base64,${item.item.image}`
                  : 'https://via.placeholder.com/150',
              }}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.item.name}</Text>
              <Text style={styles.itemPrice}>
                ₹{item.price.toFixed(2)} each
              </Text>
              <View style={styles.quantityControl}>
                <TouchableOpacity style={styles.quantityButton}>
                  <Text style={styles.quantityText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity style={styles.quantityButton}>
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.itemTotal}>
                Total: ₹{item.total.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bill Summary */}
      <View style={styles.billSummary}>
        <Text style={styles.billTitle}>Bill Summary</Text>
        <View style={styles.billRow}>
          <Text>Item Total</Text>
          <Text>₹{subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.billRow}>
          <Text>GST And Restaurant Charges</Text>
          <Text>₹{gstAndCharges.toFixed(2)}</Text>
        </View>
        <View style={styles.billRow}>
          <Text>Platform Fee</Text>
          <Text>₹{platformFee.toFixed(2)}</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.totalAmount}>Total Amount</Text>
          <Text style={styles.totalAmount}>₹{totalAmount.toFixed(2)}</Text>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
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
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0014A8',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
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
