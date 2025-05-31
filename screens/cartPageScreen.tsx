import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import DownNavbar from './downNavbar';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {uricart1} from './imageUris/uris';
import {CartData, CartItem} from './types/cartTypes';
import {
  fetchCartData,
  updateCartItemQuantity,
  removeCartItem,
  clearCart as clearCartHelper,
} from './services/cartHelpers';
import {StackNavigationProp} from '@react-navigation/stack';
import axios from 'axios';

const CartPage = () => {
  const navigation = useNavigation();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItems, setUpdatingItems] = useState<number[]>([]);

  const loadCartData = async () => {
    try {
      setLoading(true);
      const data = await fetchCartData();
      console.log('Fetched cart data:', data);
      setCartData(data);
    } catch (err) {
      // setError('Failed to fetch cart data');
      // console.error('Error fetching cart data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartData();
  }, [updatingItems]);

  const updateItemQuantity = async (
    cartItem: CartItem,
    newQuantity: number,
  ) => {
    console.log('Updating item quantity:', cartItem, newQuantity);

    try {
      // Add item ID to updating state
      setUpdatingItems(prev => [...prev, cartItem.id]);
      const body = {
        cartItemId: cartItem.item?.id,
        quantity: newQuantity,
        cartId: cartData?.id,
      };

      console.log('Request body:', body);
      const token = await AsyncStorage.getItem('authorization');
      const API_BASE_URL = 'https://server.welfarecanteen.in/api';
      await axios.post(`${API_BASE_URL}/cart/updateCartItem`, body, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });

      await loadCartData();
    } catch (err) {
      setError('Failed to update cart item');
      console.error('Error updating cart item:', err);
    } finally {
      // Remove item ID from updating state
      setUpdatingItems(prev => prev.filter(id => id !== cartItem.id));
    }
  };

  const handleRemoveItem = async (item: any) => {
    console.log(item, 'itemmm');

    try {
      if (!cartData) return;

      setUpdatingItems(prev => [...prev, item?.item?.id]);
      const body = {
        cartId: cartData?.id,
        cartItemId: item?.item?.id,
      };
      console.log('Request body:', body);

      await removeCartItem(item?.cartId, item?.item?.id);

      // Refresh cart data
      await loadCartData();
    } catch (err) {
      setError('Failed to remove cart item');
      console.error('Error removing cart item:', err);
    } finally {
      setUpdatingItems(prev => prev.filter(id => id !== item?.item?.id));
    }
  };

  const handleClearCart = async () => {
    try {
      setLoading(true);
      await clearCartHelper();
      setCartData({} as CartData);
    } catch (err) {
      setError('Failed to clear cart');
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: handleClearCart,
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const handlePayment = () => {
    navigation.navigate('PaymentMethod' as never);
  };

  const calculateGSTAndCharges = (subtotal: number) => {
    return subtotal * 0.0; // 7% GST
  };

  const calculatePlatformFee = () => {
    return 0; // Fixed platform fee
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
        <TouchableOpacity style={styles.refreshButton} onPress={loadCartData}>
          <Text style={styles.refreshButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!cartData || !cartData.cartItems || cartData.cartItems.length === 0) {
    return (
      <View style={[styles.container, styles.emptyCartContainer]}>
        <Image
          source={{
            uri: 'https://img.icons8.com/ios/100/000000/empty-cart.png',
          }}
          style={styles.emptyCartIcon}
        />
        <Text style={styles.emptyCartText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.continueShoppingButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.continueShoppingText}>Continue Shopping</Text>
        </TouchableOpacity>

        <DownNavbar />
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
      {/* Custom Header */}
      <View style={styles.headerContainer}>
        <Image
          source={{
            uri: 'https://welfarecanteen.in/public/Naval.jpg',
          }}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Image
              source={{
                uri: 'https://creazilla-store.fra1.digitaloceanspaces.com/icons/3235242/wallet-icon-sm.png',
              }}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Image
              source={{
                uri: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
              }}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Cart Items */}
      <ScrollView style={styles.cartItems}>
        {cartData?.cartItems?.map(item => (
          <View key={item.id} style={styles.cartItemCard}>
            <Image
              source={{
                uri: item.item.image
                  ? `data:image/png;base64,${item.item.image}`
                  : 'https://via.placeholder.com/80',
              }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              {/* Name & Remove Button Row */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.item.name}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveItem(item)}
                  style={styles.removeIconButton}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                  <Text style={styles.removeIconText}>✕</Text>
                </TouchableOpacity>
              </View>
              {/* Type Row */}
              <View style={styles.typeRow}>
                <Image
                  source={{
                    uri:
                      item.item.type && item.item.type.toLowerCase() === 'veg'
                        ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Veg_symbol.svg/1200px-Veg_symbol.svg.png'
                        : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Non_veg_symbol.svg/1200px-Non_veg_symbol.svg.png',
                  }}
                  style={styles.typeIcon}
                />
                <Text style={styles.typeText}>
                  {item.item.type ? item.item.type.toUpperCase() : 'N/A'}
                </Text>
              </View>
              {/* Price & Total Row */}
              <View style={styles.priceRow}>
                <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
                <Text style={styles.itemTotal}>
                  Total: ₹{item.total.toFixed(2)}
                </Text>
              </View>
              {/* Quantity Row */}
              <View style={styles.quantityRow}>
                {updatingItems.includes(item.id) ? (
                  <ActivityIndicator size="small" color="#0014A8" />
                ) : (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.qtyBtn,
                        {opacity: item.quantity === 1 ? 0.5 : 1},
                      ]}
                      onPress={() =>
                        item.quantity > 1 &&
                        updateItemQuantity(item, item.quantity - 1)
                      }
                      disabled={item.quantity === 1}>
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() =>
                        updateItemQuantity(item, item.quantity + 1)
                      }>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bill Summary */}
      <View style={styles.billCard}>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Subtotal</Text>
          <Text style={styles.billValue}>₹{subtotal.toFixed(2)}</Text>
        </View>
        {/* <View style={styles.billRow}>
          <Text style={styles.billLabel}>GST & Charges</Text>
          <Text style={styles.billValue}>₹{gstAndCharges.toFixed(2)}</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Platform Fee</Text>
          <Text style={styles.billValue}>₹{platformFee.toFixed(2)}</Text>
        </View> */}
        <View style={[styles.billRow, styles.billTotalRow]}>
          <Text style={styles.billTotalLabel}>Total</Text>
          <Text style={styles.billTotalValue}>₹{totalAmount.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
          <Text style={styles.payBtnText}>Proceed to Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.clearCartBtn}
          onPress={confirmClearCart}>
          <Text style={styles.clearCartBtnText}>Clear Cart</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <DownNavbar />
    </View>
  );
};

// --- Improved Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff0f0',
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#0014A8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 4,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
    paddingHorizontal: 24,
  },
  emptyCartIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
    tintColor: '#b0b0b0',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  continueShoppingButton: {
    backgroundColor: '#0014A8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  continueShoppingText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0014A8',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 4,
  },
  logo: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    elevation: 2,
  },
  headerIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  cartItems: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    padding: 12,
    elevation: 2,
    shadowColor: '#0014A8',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#e6eaf2',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    flex: 1,
    flexWrap: 'wrap',
  },
  removeIconButton: {
    marginLeft: 10,
    backgroundColor: '#ffeded',
    borderRadius: 12,
    padding: 4,
  },
  removeIconText: {
    color: '#ff4d4d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
  },
  typeIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  typeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#0014A8',
    fontWeight: 'bold',
  },
  itemTotal: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyBtn: {
    backgroundColor: '#0014A8',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
    minWidth: 20,
    textAlign: 'center',
    color: '#222',
    fontWeight: 'bold',
  },
  billCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 12,
    marginBottom: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#0014A8',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    color: '#666',
    fontSize: 15,
  },
  billValue: {
    color: '#222',
    fontSize: 15,
    fontWeight: '500',
  },
  billTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e6eaf2',
    marginTop: 8,
    paddingTop: 8,
  },
  billTotalLabel: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#0014A8',
  },
  billTotalValue: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#0014A8',
  },
  payBtn: {
    backgroundColor: '#0014A8',
    borderRadius: 8,
    marginTop: 14,
    paddingVertical: 13,
    alignItems: 'center',
    elevation: 2,
  },
  payBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  clearCartBtn: {
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 8,
  },
  clearCartBtnText: {
    color: '#ff4d4d',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default CartPage;
