import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './navigationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DownNavbar from './downNavbar';
import {SettingsScreenuri, menuItemUri} from './imageUris/uris';
import {MenuData, MenuItem, CartData, CartItemsState} from './types/cartTypes';
import {
  fetchCartData,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  findCartItemByItemId,
} from './services/cartHelpers';

type MenuItemsByMenuIdScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MenubyMenuId'
>;

type MenuItemsByMenuIdScreenRouteProp = RouteProp<
  RootStackParamList,
  'MenubyMenuId'
>;

const MenuItemsByMenuIdScreenNew = () => {
  const navigation = useNavigation<MenuItemsByMenuIdScreenNavigationProp>();
  const route = useRoute<MenuItemsByMenuIdScreenRouteProp>();
  const [menuData, setMenuData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [cartItems, setCartItems] = useState<CartItemsState>({});
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [cartUpdated, setCartUpdated] = useState(false);
  const {menuId} = route.params;

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = await AsyncStorage.getItem('authorization');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await fetch(
          `https://server.welfarecanteen.in/api/menu/getMenuById?id=${menuId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          },
        );

        const data = await response.json();

        if (data && data.data) {
          if (data.data.menuItems && Array.isArray(data.data.menuItems)) {
            const updatedMenuItems = data.data.menuItems.map(
              (item: MenuItem) => ({
                ...item,
                minQuantity: item.minQuantity,
                maxQuantity: item.maxQuantity,
              }),
            );
            setMenuData({
              ...data.data,
              menuItems: updatedMenuItems,
            });
          } else {
            setMenuData(data.data);
          }
          console.log(data.data, 'menuData---menuItemsByMenuIdScreenNew');
        } else {
          setError('No menu data found');
        }
      } catch (err) {
        setError('Failed to fetch menu data');
        console.error('Error fetching menu data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [menuId]);

  // console.log(cartData, 'cartData---menuItemsByMenuIdScreenNew');

  useFocusEffect(
    React.useCallback(() => {
      const getCartData = async () => {
        try {
          const data = await fetchCartData();
          setCartData(data);

          // Initialize cartItems state from cart data
          const cartItemsMap: CartItemsState = {};

          if (data && data.cartItems && Array.isArray(data.cartItems)) {
            data.cartItems.forEach((cartItem: any) => {
              const itemIdKey = String(cartItem.itemId);
              cartItemsMap[itemIdKey] = {
                quantity: cartItem.quantity,
                cartItemId: cartItem.id,
              };
            });
          }

          console.log(
            cartItemsMap,
            'cartItemsMap---menuItemsByMenuIdScreenNew',
          );

          setCartItems(cartItemsMap);
        } catch (err) {
          // console.error('Error fetching cart data:', err);
        }
      };

      getCartData();
    }, [cartUpdated, route]),
  );

  const addToCart = async (item: any, menudata: any) => {
    console.log('Adding to cart:', item);
    console.log('menudata:', menudata);
    try {
      setUpdateLoading(item.id);
      const minQty = 1;

      const result = await addItemToCart(
        item.item.id,
        // menuData?.id || '',
        item?.menuId || '',
        menuData?.menuConfigurationId || '',
        minQty,
      );

      // Refresh cart data
      const updatedCartData = await fetchCartData();
      setCartData(updatedCartData);

      // Find the cart item that was just added
      const cartItem = findCartItemByItemId(updatedCartData, item.item.id);
      console.log(cartItem, 'cartItem---added-to-cart');

      if (cartItem) {
        // Update cart items state
        setCartItems(prev => ({
          ...prev,
          [item.item.id]: {
            quantity: cartItem.quantity,
            cartItemId: cartItem.id,
          },
        }));
      }

      setUpdateLoading(null);
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
      setUpdateLoading(null);
    }
  };

  // Increment quantity
  const increaseQuantity = async (item: MenuItem) => {
    setCartUpdated(true);
    try {
      setUpdateLoading(item.id);
      console.log(item, 'itemm---------increasingg');
      const cartItemId22 = cartData?.cartItems.find(
        cartItem => cartItem.itemId === item.item.id,
      )?.item?.id;
      console.log(cartItemId22, 'cartItemId---increase-quantity');
      // we get cartItemId from cardData only ###

      const itemId = item.item.id;
      const itemKey = String(itemId);
      console.log(cartItems, 'cartItems---i');

      // Check if item exists in cart
      if (!cartItems[itemKey]) {
        await addToCart(item, menuData);
        return;
      }

      const currentQty = cartItems[itemKey]?.quantity;
      console.log(currentQty, 'currentQty---====');

      const maxQty = Number(item.maxQuantity) || 10;

      if (currentQty >= maxQty) {
        Alert.alert('Maximum quantity reached');
        setUpdateLoading(null);
        return;
      }

      const newQty = currentQty + 1;
      const cartItemId = cartItems[itemKey].cartItemId;
      const body = {
        cartId: cartData?.id,
        cartItemId: cartItemId22,
        quantity: newQty,
      };
      console.log(body, 'body---increase-quantity');

      //   {
      //     "cartId":3,"cartItemId":2,"quantity":5
      // }
      const cartId = cartData?.id ? cartData?.id : '';
      await updateCartItemQuantity(
        cartId,
        parseInt(cartItemId22?.toString() || '0'),
        newQty,
      );

      // Refresh cart data
      const updatedCartData = await fetchCartData();
      setCartData(updatedCartData);

      // Update cart items state
      setCartItems(prev => ({
        ...prev,
        [itemKey]: {
          ...prev[itemKey],
          quantity: newQty,
        },
      }));

      setUpdateLoading(null);
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Error updating quantity:', err);
      setUpdateLoading(null);
    }
  };

  // console.log(cartUpdated, 'cartUpdated---menuItemsByMenuIdScreenNew');

  // Decrement quantity
  const decreaseQuantity = async (item: MenuItem) => {
    try {
      setUpdateLoading(item.id);

      const itemId = item.item.id;
      const itemKey = String(itemId);

      // Check if item exists in cart
      if (!cartItems[itemKey]) {
        setUpdateLoading(null);
        return;
      }

      const currentQty = cartItems[itemKey].quantity;
      const minQty = Number(item.minQuantity) || 1;
      const cartItemId = cartItems[itemKey].cartItemId;

      if (currentQty <= minQty) {
        // Remove item from cart
        await removeCartItem(cartData?.id || 0, cartItemId);

        // Refresh cart data
        const updatedCartData = await fetchCartData();
        setCartData(updatedCartData);

        // Update cart items state
        setCartItems(prev => {
          const updated = {...prev};
          delete updated[itemKey];
          return updated;
        });
      } else {
        // Decrease quantity
        const newQty = currentQty - 1;

        await updateCartItemQuantity(cartData?.id || 0, cartItemId, newQty);

        // Refresh cart data
        const updatedCartData = await fetchCartData();
        setCartData(updatedCartData);

        // Update cart items state
        setCartItems(prev => ({
          ...prev,
          [itemKey]: {
            ...prev[itemKey],
            quantity: newQty,
          },
        }));
      }

      setUpdateLoading(null);
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Error updating quantity:', err);
      setUpdateLoading(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading menu items...</Text>
        <ActivityIndicator size="large" color="#0014A8" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!menuData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No menu data available</Text>
      </View>
    );
  }
  // console.log(menuData, 'menuData-mapping--menuItemsByMenuIdScreenNew');

  return (
    <>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image
          source={{
            uri: 'https://welfarecanteen.in/public/Naval.jpg',
          }}
          style={styles.headerLogo}
        />
        <Text style={styles.headerTitleText}>{menuData?.name || 'Menu'}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Image
              source={{
                uri: 'https://creazilla-store.fra1.digitaloceanspaces.com/icons/3235242/wallet-icon-sm.png',
              }}
              style={styles.headerIconImg}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => navigation.navigate('SettingsScreen')}>
            <Image
              source={{
                uri: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
              }}
              style={styles.headerIconImg}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.menuListContainer}>
        {menuData?.menuItems?.map((item: any) => (
          <View key={item.id} style={styles.menuCard}>
            <Image
              source={{
                uri: item?.item?.image
                  ? `data:image/png;base64,${item?.item?.image}`
                  : 'https://via.placeholder.com/120',
              }}
              style={styles.menuCardImage}
            />
            <View style={styles.menuCardContent}>
              <View style={styles.menuCardHeader}>
                <Text style={styles.menuCardName}>{item?.item?.name}</Text>
                <Text style={styles.menuCardPrice}>₹{item.item.pricing.price}</Text>
              </View>
              <View style={styles.menuCardTypeRow}>
                <Image
                  source={{
                    uri:
                      item?.item?.type?.toLowerCase() === 'veg'
                        ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Veg_symbol.svg/1200px-Veg_symbol.svg.png'
                        : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Non_veg_symbol.svg/1200px-Non_veg_symbol.svg.png',
                  }}
                  style={styles.menuCardTypeIcon}
                />
                <Text style={styles.menuCardTypeText}>
                  {item?.item?.type?.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.menuCardDesc} numberOfLines={2}>
                {item.item.description}
              </Text>
              <View style={styles.menuCardActionRow}>
                {updateLoading === item.id ? (
                  <ActivityIndicator size="small" color="#0014A8" />
                ) : !cartItems[item.item.id] ? (
                  <TouchableOpacity
                    style={styles.menuCardAddBtn}
                    onPress={() => addToCart(item, menuData)}>
                    <Text style={styles.menuCardAddBtnText}>ADD</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.menuCardQtyRow}>
                    <TouchableOpacity
                      style={styles.menuCardQtyBtn}
                      onPress={() => decreaseQuantity(item)}>
                      <Text style={styles.menuCardQtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.menuCardQtyText}>
                      {cartItems[item.item.id]?.quantity || 0}
                    </Text>
                    <TouchableOpacity
                      style={styles.menuCardQtyBtn}
                      onPress={() => increaseQuantity(item)}>
                      <Text style={styles.menuCardQtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Go to Cart Button */}
      {Object.keys(cartItems).length > 0 && (
        <TouchableOpacity
          style={styles.goToCartButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CartPage' as never)}>
          <Text style={styles.goToCartButtonText}>Go to Cart</Text>
        </TouchableOpacity>
      )}
      <DownNavbar />
    </>
  );
};

// Improved styles for a modern, clean look
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0014A8',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 4,
  },
  headerLogo: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
    marginRight: 8,
  },
  headerTitleText: {
    flex: 1,
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  headerIconImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },

  menuListContainer: {
    padding: 16,
    paddingBottom: 120,
    backgroundColor: '#f7f8fa',
  },
  menuCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#0014A8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    padding: 12,
    alignItems: 'flex-start',
  },
  menuCardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: '#eaeaea',
  },
  menuCardContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  menuCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  menuCardName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    flex: 1,
    marginRight: 8,
  },
  menuCardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0014A8',
    marginLeft: 8,
  },
  menuCardTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  menuCardTypeIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  menuCardTypeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  menuCardDesc: {
    fontSize: 13,
    color: '#666',
    marginVertical: 4,
    lineHeight: 18,
  },
  menuCardActionRow: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  menuCardAddBtn: {
    backgroundColor: '#0014A8',
    paddingVertical: 7,
    paddingHorizontal: 28,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 1,
  },
  menuCardAddBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  menuCardQtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  menuCardQtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginHorizontal: 2,
  },
  menuCardQtyBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0014A8',
  },
  menuCardQtyText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },

  goToCartButton: {
    position: 'absolute',
    bottom: 70,
    left: 30,
    right: 30,
    backgroundColor: '#0014A8',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    zIndex: 10,
    elevation: 6,
    shadowColor: '#0014A8',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  goToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  loadingText: {
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MenuItemsByMenuIdScreenNew;
