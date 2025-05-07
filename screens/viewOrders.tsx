import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import DownNavbar from './downNavbar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('authorization');
        const response = await axios.get('http://10.0.2.2:3002/api/order/listOrders', {
          headers: {
            'Content-Type': 'application/json',
            authorization: token || '',
          },
        });
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

  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderDetails}>
        <Text style={styles.orderNumber}>Order ID: {item.id}</Text>
        <Text style={styles.session}>Status: {item.status}</Text>
        <Text style={styles.dateTime}>Date: {formatDateTime(item.createdAt)}</Text>
        <Text>Total: ₹{item.totalAmount}</Text>
        <Text>Payment: {item.payment?.status} via {item.payment?.paymentMethod}</Text>

        <Text style={{ marginTop: 8, fontWeight: 'bold' }}>Items:</Text>
        {item.orderItems.map((orderItem: any, index: number) => (
          <Text key={index}>
            {orderItem.menuItemItem.name} × {orderItem.quantity} = ₹{orderItem.total}
          </Text>
        ))}
      </View>

      {item.qrCode && (
        <Image
          source={{ uri: item.qrCode }}
          style={{ width: 60, height: 60, marginTop: 10 }}
        />
      )}

      <TouchableOpacity style={styles.reorderButton}>
        <Text style={styles.reorderText}>Re-Order</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Image
            source={{
              uri: 'https://www.joinindiannavy.gov.in/images/octaginal-crest.png',
            }}
            style={styles.logo}
          />
        </Text>
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
      />

      {/* Bottom Navbar */}
      <DownNavbar style={styles.stckyNavbar} />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... [same as your current styles with optional fine-tuning] ...
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 50,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  orderDetails: {
    marginBottom: 8,
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
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  reorderText: {
    fontSize: 14,
    color: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0014A8',
    paddingVertical: 20,
    padding: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    width: 30,
    height: 30,
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
    paddingVertical: 20,
    padding: 30,
  },
  headerTitle1: {
    color: '#0014A8',
    fontSize: 18,
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
});

export default ViewOrders;
