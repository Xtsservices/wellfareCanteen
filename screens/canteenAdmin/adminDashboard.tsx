import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AdminDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminDashboard'
>;

const AdminDashboard = () => {
  const navigation = useNavigation<AdminDashboardNavigationProp>();
  const { width, height } = useWindowDimensions();

  const orderCount = 5; // Example data — replace with API or Redux state
  const cardSize = Math.min(width * 0.6, height * 0.6);
  const isPortrait = height >= width;
  console.log(AsyncStorage.getItem('authorization'),"tokennn");
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Restaurant Dashboard</Text>
        <TouchableOpacity
          style={styles.usersButton}
          onPress={() => navigation.navigate('Users', { newUser: undefined })}
        >
          <Text style={styles.usersButtonText}>Users</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.centerContainer}>
        <View style={[styles.middleRow, isPortrait && styles.middleColumn]}>
          {/* QR Scan Card */}
          <TouchableOpacity
            style={[
              styles.squareCard,
              {
                width: cardSize,
                height: cardSize,
                marginRight: isPortrait ? 0 : 20,
                marginBottom: isPortrait ? 20 : 0,
              },
            ]}
            onPress={() => navigation.navigate('BluetoothControl')}
          >
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/1122528/pexels-photo-1122528.jpeg',
              }}
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Quick Scan</Text>
              <Text style={styles.cardDescription}>Scan QR Code</Text>
            </View>
          </TouchableOpacity>

          {/* Walk-ins Card */}
          <TouchableOpacity
            style={[
              styles.squareCard,
              {
                width: cardSize,
                height: cardSize,
              },
            ]}
            onPress={() => navigation.navigate('breakfast')}
          >
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/4253320/pexels-photo-4253320.jpeg',
              }}
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Walk-ins</Text>
              <Text style={styles.cardDescription}>Manage customers</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Orders Counter */}
      <TouchableOpacity
        style={styles.ordersCounter}
        onPress={() => navigation.navigate('Orders')}
      >
        <Text style={styles.ordersCounterText}>Orders: {orderCount}</Text>
        <Text style={styles.ordersCounterSubtext}>Tap to view details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1a237e',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 5,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  usersButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  usersButtonText: {
    color: '#1a237e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  squareCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    overflow: 'hidden',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease-in-out',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  cardImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: '30%',
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  ordersCounter: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1a237e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
      default: {
        elevation: 5,
      },
    }),
  },
  ordersCounterText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ordersCounterSubtext: {
    color: '#e8eaf6',
    fontSize: 14,
    marginTop: 5,
  },
});

export default AdminDashboard;
