import React, {useEffect, useState, useRef} from 'react';
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
} from 'react-native';
import DownNavbar from './downNavbar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import ViewShot, {captureRef} from 'react-native-view-shot';

const ViewOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [cancellingOrders, setCancellingOrders] = useState<Set<number>>(
    new Set(),
  );
  const qrCodeRef = useRef<ViewShot>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('authorization');
        const response = await axios.get(
          'https://server.welfarecanteen.in/api/order/listOrders',
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: token || '',
            },
          },
        );
        setOrders(response.data.data || []);
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
    // Allow cancellation for all statuses except already cancelled
    return status.toLowerCase() !== 'cancelled';
  };

  const cancelOrder = async (orderId: number, currentStatus: string) => {
    // Additional check for already cancelled orders
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
                'https://server.welfarecanteen.in/api/order/cancelOrder',
                {orderId},
                {
                  headers: {
                    'Content-Type': 'application/json',
                    authorization: token || '',
                  },
                },
              );

              // Update the order status locally
              setOrders(prevOrders =>
                prevOrders.map(order =>
                  order.id === orderId
                    ? {...order, status: 'cancelled'}
                    : order,
                ),
              );

              Alert.alert('Success', 'Order cancelled successfully');
            } catch (error: any) {
              console.error('Failed to cancel order', error);

              // More detailed error handling
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
          Alert.alert(
            'Permission denied',
            'Cannot save QR code without permission',
          );
          return;
        }
      }
      if (qrCodeRef.current) {
        const uri = await qrCodeRef.current.capture?.();
        if (uri) {
          await CameraRoll.save(uri, {type: 'photo'});
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

  const renderOrder = ({item}: {item: any}) => {
    const isCancelled = item.status.toLowerCase() === 'cancelled';

    // Style for strike-through
    const strikeThroughStyle = isCancelled
      ? {textDecorationLine: 'line-through' as 'line-through', color: '#888'}
      : {};

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={[styles.orderId, strikeThroughStyle]}>
            Order #{item.id}
          </Text>
          <Text style={[styles.status, {color: getStatusColor(item.status)}]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.date, strikeThroughStyle]}>
          {formatDateTime(item.createdAt)}
        </Text>
        <View style={styles.amountRow}>
          <Text style={[styles.amountLabel, strikeThroughStyle]}>Total:</Text>
          <Text style={[styles.amountValue, strikeThroughStyle]}>
            ₹{item.totalAmount}
          </Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={[styles.paymentLabel, strikeThroughStyle]}>
            Payment:
          </Text>
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
              <Text style={[styles.itemQty, strikeThroughStyle]}>
                × {orderItem.quantity}
              </Text>
            </View>
          ))}
        </View>
        /* Cancel Button */ /* Cancel Button */
        {canCancelOrder(item.status) &&
          !isCancelled &&
          item.status.toUpperCase() !== 'CANCELED' && (
            <TouchableOpacity
              style={[
                styles.cancelButton,
                cancellingOrders.has(item.id) && styles.cancelButtonDisabled,
              ]}
              onPress={() => cancelOrder(item.id, item.status)}
              disabled={cancellingOrders.has(item.id)}>
              <Text style={styles.cancelButtonText}>
                {cancellingOrders.has(item.id)
                  ? 'Cancelling...'
                  : 'Cancel Order'}
              </Text>
            </TouchableOpacity>
          )}
        {isCancelled && (
          <View style={styles.cancelledContainer}>
            <Text style={styles.cancelledText}>
              This order has been cancelled
            </Text>
          </View>
        )}
        {/* QR code only if NOT cancelled and NOT CANCELED */}
        {item.qrCode &&
          isRecentOrder(item.createdAt) &&
          !isCancelled &&
          item.status.toUpperCase() !== 'CANCELED' && (
            <TouchableOpacity
              style={styles.qrContainer}
              activeOpacity={0.8}
              onPress={SaveQrToGallery}>
              <ViewShot ref={qrCodeRef} options={{format: 'png', quality: 1}}>
                <Image
                  source={{uri: item.qrCode}}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              </ViewShot>
              <Text style={styles.qrDownloadText}>Tap QR to Download</Text>
            </TouchableOpacity>
          )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://welfarecanteen.in/public/Naval.jpg',
          }}
          style={styles.logo}
        />
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconborder}>
            <Image
              source={{
                uri: 'https://creazilla-store.fra1.digitaloceanspaces.com/icons/3235242/wallet-icon-sm.png',
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconborder}>
            <Image
              source={{
                uri: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.header1}>
        <Text style={styles.headerTitle1}>Orders History</Text>
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders found.</Text>
        }
      />

      {/* Bottom Navbar */}
      <DownNavbar style={styles.stckyNavbar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
    marginTop: 0,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0014A8',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
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
    marginBottom: 8,
  },
  paymentLabel: {
    color: '#555',
  },
  paymentValue: {
    color: '#555',
  },
  itemsTitle: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 2,
    color: '#0014A8',
  },
  itemsList: {
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
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
  itemTotal: {
    flex: 1,
    textAlign: 'right',
    color: '#0014A8',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  cancelButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  cancelButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  qrImage: {
    width: 180,
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  qrDownloadText: {
    marginTop: 6,
    color: '#0014A8',
    fontWeight: 'bold',
    fontSize: 13,
  },
  reorderButton: {
    backgroundColor: '#0014A8',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  reorderText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0014A8',
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    width: 28,
    height: 28,
  },
  iconborder: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 7,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header1: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle1: {
    color: '#0014A8',
    fontSize: 20,
    fontWeight: 'bold',
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
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
  cancelledContainer: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  cancelledText: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '600',
  },
});

export default ViewOrders;
