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
    const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));
    return orderDate > fortyEightHoursAgo;
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

  const renderOrder = ({item}: {item: any}) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text
          style={[
            styles.status,
            {color: item.status === 'completed' ? '#4CAF50' : '#FF9800'},
          ]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.date}>{formatDateTime(item.createdAt)}</Text>
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Total:</Text>
        <Text style={styles.amountValue}>₹{item.totalAmount}</Text>
      </View>
      <View style={styles.paymentRow}>
        <Text style={styles.paymentLabel}>Payment:</Text>
        <Text style={styles.paymentValue}>
          {item.payment?.status} via {item.payment?.paymentMethod}
        </Text>
      </View>
      <Text style={styles.itemsTitle}>Items:</Text>
      <View style={styles.itemsList}>
        {item.orderItems.map((orderItem: any, index: number) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>{orderItem.menuItemItem.name}</Text>
            <Text style={styles.itemQty}>× {orderItem.quantity}</Text>
          </View>
        ))}
      </View>
      {item.qrCode && isRecentOrder(item.createdAt) && (
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
});

export default ViewOrders;