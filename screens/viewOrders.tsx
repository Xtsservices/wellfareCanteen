import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator
} from 'react-native';
import DownNavbar from './downNavbar';
import Header from './header';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { API_BASE_URL } from './services/restApi';

// Note: Ensure required dependencies are installed:
// 1. Run `npm install react-native-responsive-screen react-native-view-shot @react-native-camera-roll/camera-roll axios @react-native-async-storage/async-storage`
// 2. Ensure Header.tsx uses PNGs (wallet.png, profile.png) in src/assets/ with correct paths
// 3. For iOS, add to Podfile: pod 'RNCameraRoll', :path => '../node_modules/@react-native-camera-roll/camera-roll'
// 4. Run `cd ios && pod install`
// 5. Rebuild: `npx react-native run-android` or `npx react-native run-ios`
// 6. If images don't render, verify paths and clear cache: `npx react-native start --reset-cache`

const ViewOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [cancellingOrders, setCancellingOrders] = useState<Set<number>>(new Set());
  const qrCodeRef = useRef<ViewShot>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('authorization');
        const response = await axios.get(
          `${API_BASE_URL}/order/listOrders`,
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: token || '',
            },
          },
        );
        setOrders(response.data.data || []);
        setLoading(false);
      } catch (error: any) {
        console.error('Failed to fetch orders', error);
      }
    };
    fetchOrders();
  }, []);

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const isRecentOrder = (timestamp: number) => {
    const orderDate = new Date(timestamp * 1000);
    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    return orderDate > fortyEightHoursAgo;
  };

  const canCancelOrder = (status: string) => {
    return status.toLowerCase() !== 'cancelled';
  };

  const cancelOrder = async (orderId: number, currentStatus: string) => {
    if (currentStatus.toLowerCase() === 'cancelled') {
      Alert.alert('Info', 'This order has already been cancelled.');
      return;
    }

    Alert.alert(
      'Cancel Order',
      `Are you sure you want to cancel this order?\n\nOrder Status: ${currentStatus.toUpperCase()}\n\nNote: Cancelled orders cannot be undone.`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancellingOrders(prev => new Set(prev).add(orderId));
              const token = await AsyncStorage.getItem('authorization');

              const response = await axios.post(
                `${API_BASE_URL}/order/cancelOrder`,
                { orderId },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    authorization: token || '',
                  },
                },
              );

              setOrders(prevOrders =>
                prevOrders.map(order =>
                  order.id === orderId ? { ...order, status: 'cancelled' } : order,
                ),
              );

              Alert.alert('Success', 'Order cancelled successfully');
            } catch (error: any) {
              let errorMessage = 'Failed to cancel order';
              if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              } else if (error.message) {
                errorMessage = error.message;
              }
              Alert.alert('Error', errorMessage);
            } finally {
              setCancellingOrders(prev => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
              });
            }
          },
        },
      ],
    );
  };

  const SaveQrToGallery = async () => {
    try {
      if (Platform.OS === 'android') {
        let permission;
        if (Platform.Version >= 33) {
          permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
        } else {
          permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        }
        const granted = await PermissionsAndroid.request(permission, {
          title: 'Storage Permission',
          message: 'App needs access to storage to save QR code',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission denied', 'Cannot save QR code without permission');
          return;
        }
      }
      if (qrCodeRef.current) {
        const uri = await qrCodeRef.current.capture?.();
        if (uri) {
          await CameraRoll.save(uri, { type: 'photo' });
          Alert.alert('Success', 'QR code saved to gallery!');
        } else {
          Alert.alert('Error', 'Failed to capture QR code');
        }
      } else {
        Alert.alert('Error', 'QR code reference not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save QR code to gallery');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      case 'pending':
        return '#FF9800';
      case 'confirmed':
        return '#2196F3';
      default:
        return '#FF9800';
    }
  };

  const renderOrder = ({ item }: { item: any }) => {
    const isCancelled = item.status.toLowerCase() === 'cancelled';
    const strikeThroughStyle = isCancelled
      ? { textDecorationLine: 'line-through' as 'line-through', color: '#888' }
      : {};

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={[styles.orderId, strikeThroughStyle]}>Order #{item.id}</Text>
          <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.date, strikeThroughStyle]}>
          {formatDateTime(item.createdAt)}
        </Text>
        <View style={styles.amountRow}>
          <Text style={[styles.amountLabel, strikeThroughStyle]}>Total:</Text>
          <Text style={[styles.amountValue, strikeThroughStyle]}>₹{item.totalAmount}</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={[styles.paymentLabel, strikeThroughStyle]}>Payment:</Text>
          <Text style={[styles.paymentValue, strikeThroughStyle]}>
            {item.payment?.status} via {item.payment?.paymentMethod}
          </Text>
        </View>
        <Text style={[styles.itemsTitle, strikeThroughStyle]}>Items:</Text>
        <View style={styles.itemsList}>
          {item.orderItems.map((orderItem: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <Text style={[styles.itemName, strikeThroughStyle]}>
                {orderItem.menuItemItem.name}
              </Text>
              <Text style={[styles.itemQty, strikeThroughStyle]}>× {orderItem.quantity}</Text>
            </View>
          ))}
        </View>
        {canCancelOrder(item.status) && !isCancelled && item.status.toUpperCase() !== 'CANCELED' && (
          <TouchableOpacity
            style={[styles.cancelButton, cancellingOrders.has(item.id) && styles.cancelButtonDisabled]}
            onPress={() => cancelOrder(item.id, item.status)}
            disabled={cancellingOrders.has(item.id)}
          >
            <Text style={styles.cancelButtonText}>
              {cancellingOrders.has(item.id) ? 'Cancelling...' : 'Cancel Order'}
            </Text>
          </TouchableOpacity>
        )}
        {isCancelled && (
          <View style={styles.cancelledContainer}>
            <Text style={styles.cancelledText}>This order has been cancelled</Text>
          </View>
        )}
        {item.qrCode && isRecentOrder(item.createdAt) && !isCancelled && item.status.toUpperCase() !== 'CANCELED' && (
          <TouchableOpacity style={styles.qrContainer} activeOpacity={0.8} onPress={SaveQrToGallery}>
            <ViewShot ref={qrCodeRef} options={{ format: 'png', quality: 1 }}>
              <Image source={{ uri: item.qrCode }} style={styles.qrImage} resizeMode="contain" />
            </ViewShot>
            <Text style={styles.qrDownloadText}>Tap QR to Download</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

   if (loading) {
        return (
          <View style={[styles.container, styles.loadingContainer]}>
            <ActivityIndicator size="large" color="#0014A8" />
          </View>
        );
      }

  return (
    <View style={styles.container}>
      <Header text="Orders History" />
      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No orders found.</Text>}
      />
      <DownNavbar style={styles.stckyNavbar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
  },
  listContainer: {
    padding: wp('4%'),
    paddingBottom: hp('12%'),
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: wp('4%'),
    padding: wp('4.5%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: wp('2%'),
    shadowOffset: { width: 0, height: hp('0.2%') },
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.8%'),
  },
  orderId: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#0014A8',
  },
  status: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
  },
  date: {
    fontSize: wp('3.2%'),
    color: '#888',
    marginBottom: hp('1%'),
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('0.2%'),
  },
  amountLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  amountValue: {
    fontWeight: 'bold',
    color: '#0014A8',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  paymentLabel: {
    color: '#555',
  },
  paymentValue: {
    color: '#555',
  },
  itemsTitle: {
    fontWeight: 'bold',
    marginTop: hp('1%'),
    marginBottom: hp('0.2%'),
    color: '#0014A8',
  },
  itemsList: {
    marginBottom: hp('1.2%'),
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('0.2%'),
  },
  itemName: {
    flex: 2,
    color: '#222',
  },
  itemQty: {
    flex: 1,
    textAlign: 'center',
    color: '#555',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: hp('1.2%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  cancelButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  cancelButtonText: {
    fontSize: wp('3.8%'),
    color: '#fff',
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: hp('1.5%'),
  },
  qrImage: {
    width: wp('45%'),
    height: wp('45%'),
    borderRadius: wp('3%'),
    borderWidth: wp('0.2%'),
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  qrDownloadText: {
    marginTop: hp('0.8%'),
    color: '#0014A8',
    fontWeight: 'bold',
    fontSize: wp('3.2%'),
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: hp('5%'),
    fontSize: wp('4%'),
  },
  cancelledContainer: {
    backgroundColor: '#FFEBEE',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('1%'),
    borderWidth: wp('0.2%'),
    borderColor: '#FFCDD2',
  },
  cancelledText: {
    fontSize: wp('3.5%'),
    color: '#D32F2F',
    fontWeight: '600',
  },
  stckyNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: hp('1.2%'),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: wp('0.2%'),
    borderTopColor: '#ccc',
  },
});

export default ViewOrders;