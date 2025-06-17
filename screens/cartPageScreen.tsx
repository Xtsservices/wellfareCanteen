import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Header from './header';
import DownNavbar from './downNavbar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CartData, CartItem } from './types/cartTypes';
import {
  fetchCartData,
  updateCartItemQuantity,
  removeCartItem,
  clearCart as clearCartHelper,
} from './services/cartHelpers';

// Constants
const API_BASE_URL = 'https://server.welfarecanteen.in/api';
const COLORS = {
  PRIMARY: '#0014A8',
  ERROR: '#ff4d4d',
  TEXT_SECONDARY: '#666',
  TEXT_DARK: '#222',
  TEXT_LIGHT: '#888',
  BACKGROUND: '#F4F6FB',
  CARD: '#fff',
  CLEAR_BUTTON: '#ffeded',
  BORDER: '#e6eaf2',
};

// Type Definitions
type NavigationProp = {
  navigate: (screen: string) => void;
  goBack: () => void;
};

// Cart Item Component
const CartItemComponent = memo(({ item, onUpdateQuantity, onRemove, updatingItems }: {
  item: CartItem;
  onUpdateQuantity: (newQuantity: number) => void;
  onRemove: () => void;
  updatingItems: number[];
}) => (
  <View style={styles.cartItemCard}>
    <Image
      source={{
        uri: item.item.image
          ? `data:image/png;base64,${item.item.image}`
          : 'https://via.placeholder.com/80',
      }}
      style={styles.itemImage}
    />
    <View style={styles.itemInfo}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.item.name}
        </Text>
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeIconButton}
          hitSlop={{ top: wp('2%'), bottom: wp('2%'), left: wp('2%'), right: wp('2%') }}
        >
          <Text style={styles.removeIconText}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.typeRow}>
        <Image
          source={{
            uri: item.item.type?.toLowerCase() === 'veg'
              ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Veg_symbol.svg/1200px-Veg_symbol.svg.png'
              : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Non_veg_symbol.svg/1200px-Non_veg_symbol.svg.png',
          }}
          style={styles.typeIcon}
        />
        <Text style={styles.typeText}>{item.item.type?.toUpperCase() || 'N/A'}</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
        <Text style={styles.itemTotal}>Total: ₹{item.total.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityRow}>
        {updatingItems.includes(item.id) ? (
          <ActivityIndicator size="small" color={COLORS.PRIMARY} />
        ) : (
          <>
            <TouchableOpacity
              style={[styles.qtyBtn, { opacity: item.quantity === 1 ? 0.5 : 1 }]}
              onPress={() => item.quantity > 1 && onUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity === 1}
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => onUpdateQuantity(item.quantity + 1)}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  </View>
));

// Bill Summary Component
const BillSummary = memo(({ subtotal, totalAmount, onPay, onClear }: {
  subtotal: number;
  totalAmount: number;
  onPay: () => void;
  onClear: () => void;
}) => (
  <View style={styles.billCard}>
    <View style={styles.billRow}>
      <Text style={styles.billLabel}>Subtotal</Text>
      <Text style={styles.billValue}>₹{subtotal.toFixed(2)}</Text>
    </View>
    <View style={[styles.billRow, styles.billTotalRow]}>
      <Text style={styles.billTotalLabel}>Total</Text>
      <Text style={styles.billTotalValue}>₹{totalAmount.toFixed(2)}</Text>
    </View>
    <TouchableOpacity style={styles.payBtn} onPress={onPay}>
      <Text style={styles.payBtnText}>Proceed to Payment</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.clearCartBtn} onPress={onClear}>
      <Text style={styles.clearCartBtnText}>Clear Cart</Text>
    </TouchableOpacity>
  </View>
));

// Empty Cart Component
const EmptyCart = memo(({ onContinueShopping }: { onContinueShopping: () => void }) => (
  <View style={styles.emptyCartContainer}>
    <Image
      source={{ uri: 'https://img.icons8.com/ios/100/000000/empty-cart.png' }}
      style={styles.emptyCartIcon}
    />
    <Text style={styles.emptyCartText}>Your cart is empty</Text>
    <TouchableOpacity
      style={styles.continueShoppingButton}
      onPress={onContinueShopping}
    >
      <Text style={styles.continueShoppingText}>Continue Shopping</Text>
    </TouchableOpacity>
  </View>
));

const CartPage = () => {
  const navigation = useNavigation<NavigationProp>();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItems, setUpdatingItems] = useState<number[]>([]);

  const loadCartData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCartData();
      setCartData(data);
    } catch (err) {
      setError('Failed to fetch cart data');
      console.error('Error fetching cart data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCartData();
  }, [loadCartData, updatingItems]);

  const updateItemQuantity = useCallback(async (cartItem: CartItem, newQuantity: number) => {
    try {
      setUpdatingItems(prev => [...prev, cartItem.id]);
      const body = {
        cartItemId: cartItem.item?.id,
        quantity: newQuantity,
        cartId: cartData?.id,
      };
      const token = await AsyncStorage.getItem('authorization');
      await axios.post(`${API_BASE_URL}/cart/updateCartItem`, body, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token || '',
        },
      });
      await loadCartData();
    } catch (err) {
      setError('Failed to update cart item');
      console.error('Error updating cart item:', err);
    } finally {
      setUpdatingItems(prev => prev.filter(id => id !== cartItem.id));
    }
  }, [cartData?.id, loadCartData]);

  const handleRemoveItem = useCallback(async (item: CartItem) => {
    try {
      if (!cartData) return;
      setUpdatingItems(prev => [...prev, Number(item.item?.id)]);
      await removeCartItem(Number(item.cartId), Number(item.item?.id));
      await loadCartData();
    } catch (err) {
      setError('Failed to remove cart item');
      console.error('Error removing cart item:', err);
    } finally {
      setUpdatingItems(prev => prev.filter(id => id !== item.item?.id));
    }
  }, [cartData, loadCartData]);

  const handleClearCart = useCallback(async () => {
    try {
      setLoading(true);
      await clearCartHelper();
      setCartData({ id: 0, cartItems: [], totalAmount: 0, menuConfiguration: { name: '' } });
    } catch (err) {
      setError('Failed to clear cart');
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmClearCart = useCallback(() => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: handleClearCart, style: 'destructive' },
      ],
      { cancelable: true },
    );
  }, [handleClearCart]);

  const handlePayment = useCallback(() => {
    navigation.navigate('PaymentMethod');
  }, [navigation]);

  const calculateTotal = useCallback(() => {
    if (!cartData?.cartItems?.length) return { subtotal: 0, totalAmount: 0 };
    const subtotal = cartData.cartItems.reduce((sum, item) => sum + item.total, 0);
    const gstAndCharges = subtotal * 0.0; // 0% GST
    const platformFee = 0; // Fixed platform fee
    const totalAmount = subtotal + gstAndCharges + platformFee;
    return { subtotal, totalAmount };
  }, [cartData]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <DownNavbar />
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
        <DownNavbar />
      </View>
    );
  }

  const { subtotal, totalAmount } = calculateTotal();

  return (
    <View style={styles.container}>
      <Header text="My Cart" />
      {cartData?.cartItems?.length ? (
        <>
          <ScrollView style={styles.cartItems}>
            {cartData.cartItems.map(item => (
              <CartItemComponent
                key={item.id}
                item={item}
                onUpdateQuantity={(newQuantity) => updateItemQuantity(item, newQuantity)}
                onRemove={() => handleRemoveItem(item)}
                updatingItems={updatingItems}
              />
            ))}
          </ScrollView>
          <BillSummary
            subtotal={subtotal}
            totalAmount={totalAmount}
            onPay={handlePayment}
            onClear={confirmClearCart}
          />
        </>
      ) : (
        <EmptyCart onContinueShopping={() => navigation.goBack()} />
      )}
      <DownNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff0f0',
    paddingHorizontal: wp('6%'),
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: wp('2%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('6%'),
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  refreshButtonText: {
    color: COLORS.CARD,
    fontSize: wp('3.8%'),
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
  },
  emptyCartIcon: {
    width: wp('20%'),
    height: wp('20%'),
    marginBottom: hp('2%'),
    tintColor: COLORS.TEXT_LIGHT,
  },
  emptyCartText: {
    fontSize: wp('4.5%'),
    color: COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  continueShoppingButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: wp('2%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('6%'),
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  continueShoppingText: {
    color: COLORS.CARD,
    fontSize: wp('3.8%'),
    fontWeight: 'bold',
  },
  cartItems: {
    flex: 1,
    paddingHorizontal: wp('2.5%'),
    marginTop: hp('1%'),
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.CARD,
    borderRadius: wp('3%'),
    marginBottom: hp('1.8%'),
    padding: wp('3%'),
    elevation: 2,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: hp('0.2%') },
    shadowOpacity: 0.07,
    shadowRadius: wp('1%'),
  },
  itemImage: {
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('2.5%'),
    backgroundColor: COLORS.BORDER,
  },
  itemInfo: {
    flex: 1,
    marginLeft: wp('3.5%'),
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    flex: 1,
    flexWrap: 'wrap',
  },
  removeIconButton: {
    marginLeft: wp('2.5%'),
    backgroundColor: COLORS.CLEAR_BUTTON,
    borderRadius: wp('3%'),
    padding: wp('1%'),
  },
  removeIconText: {
    color: COLORS.ERROR,
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.2%'),
    marginBottom: hp('0.5%'),
  },
  typeIcon: {
    width: wp('4%'),
    height: wp('4%'),
    marginRight: wp('1%'),
  },
  typeText: {
    fontSize: wp('3%'),
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('0.5%'),
  },
  itemPrice: {
    fontSize: wp('3.5%'),
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  itemTotal: {
    fontSize: wp('3.2%'),
    color: '#444',
    fontWeight: '500',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.8%'),
  },
  qtyBtn: {
    backgroundColor: COLORS.PRIMARY,
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('3.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    color: COLORS.CARD,
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: wp('4%'),
    fontSize: wp('4%'),
    minWidth: wp('5%'),
    textAlign: 'center',
    color: COLORS.TEXT_DARK,
    fontWeight: 'bold',
  },
  billCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: wp('3.5%'),
    marginHorizontal: wp('3%'),
    marginBottom: hp('1.2%'),
    padding: wp('4%'),
    elevation: 2,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: hp('0.2%') },
    shadowOpacity: 0.08,
    shadowRadius: wp('1%'),
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  billLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: wp('3.8%'),
  },
  billValue: {
    color: COLORS.TEXT_DARK,
    fontSize: wp('3.8%'),
    fontWeight: '500',
  },
  billTotalRow: {
    borderTopWidth: wp('0.2%'),
    borderTopColor: COLORS.BORDER,
    marginTop: hp('1%'),
    paddingTop: hp('1%'),
  },
  billTotalLabel: {
    fontWeight: 'bold',
    fontSize: wp('4.2%'),
    color: COLORS.PRIMARY,
  },
  billTotalValue: {
    fontWeight: 'bold',
    fontSize: wp('4.2%'),
    color: COLORS.PRIMARY,
  },
  payBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: wp('2%'),
    marginTop: hp('1.8%'),
    paddingVertical: hp('1.6%'),
    alignItems: 'center',
    elevation: 2,
  },
  payBtnText: {
    color: COLORS.CARD,
    fontSize: wp('4%'),
    fontWeight: 'bold',
    letterSpacing: wp('0.1%'),
  },
  clearCartBtn: {
    marginTop: hp('1%'),
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  clearCartBtnText: {
    color: COLORS.ERROR,
    fontSize: wp('3.8%'),
    fontWeight: '500',
  },
});

export default CartPage;