import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './navigationTypes';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DownNavbar from './downNavbar';

type MenuItemsByMenuIdScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MenubyMenuId'
>;

import {RouteProp} from '@react-navigation/native';

type MenuItemsByMenuIdScreenRouteProp = RouteProp<
  RootStackParamList,
  'MenubyMenuId'
>;

interface MenuItem {
  id: string;
  item: {
    id: string;
    name: string;
    description: string;
    image: string;
    quantity: number;
    quantityUnit: string;
    type: string;
    status: string;
  };
  maxQuantity: number;
  minQuantity: number;
  status: string;
}

interface MenuData {
  id: string;
  name: string;
  description: string;
  menuItems: MenuItem[];
  startTime: number;
  endTime: number;
  status: string;
  menuConfiguration: {
    id: string;
    name: string;
    defaultStartTime: number;
    defaultEndTime: number;
    status: string;
  };
}

const MenuItemsByMenuIdScreen = () => {
  const navigation = useNavigation<MenuItemsByMenuIdScreenNavigationProp>();
  const route = useRoute<MenuItemsByMenuIdScreenRouteProp>();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const {menuId} = route.params;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = await AsyncStorage.getItem('authorization');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await axios.get(
          `http://10.0.2.2:3002/api/menu/getMenuById?id=${menuId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          },
        );

        if (response.data && response.data.data) {
          setMenuData(response.data.data);
          console.log('Menu data fetched successfully:', response.data.data);
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

  const incrementQuantity = async (item: MenuItem) => {
    try {
      const token = await AsyncStorage.getItem('authorization');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const newQuantity = item.item.quantity + 1;

      // Make the API call to add the quantity
      const response = await axios.post(
        'http://10.0.2.2:3002/api/cart/add',
        {
          itemId: item.item.id,
          quantity: newQuantity,
          menuId: menuData?.id,
          canteenId: (await AsyncStorage.getItem('canteenId')) || null, // Get canteenId from AsyncStorage
          menuConfigurationId: menuData?.menuConfiguration.id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        },
      );

      // Handle case where canteenId is not available
      if (!(await AsyncStorage.getItem('canteenId'))) {
        console.warn(
          'CanteenId not found. Please select a canteen from Dashboard first.',
        );
      }

      if (response.status === 200) {
        item.item.quantity = newQuantity;
        if (menuData) {
          setMenuData({...menuData});
        }
        Alert.alert('Success', 'Cart Added successfully!');
        console.log('Cart updated successfully:', response.data);
      } else {
        setError('Failed to update quantity');
      }
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Error updating quantity:', err);
    }
  };

  // Function to format timestamp to readable time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading menu items...</Text>
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

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{menuData.name}</Text>
        <View style={styles.headerIcon}>
          <TouchableOpacity style={styles.iconborder}>
            <Image
              source={{
                uri: 'data:image/png;base64,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',
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconborder}
            onPress={() => navigation.navigate('SettingsScreen')}>
            <Image
              source={{
                uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX///8WFhgAAAD8/PwYGBoUFBYaGhwWFRn5+fkXFxgXFhrz8/MNDRDo6OgAAAQXFhvc3NwlJSfNzc6VlZWNjY1wcHDi4uLQ0NGhoaNKSkxVVVUTExPu7u+7u7uwsLH///yBgYNCQkR1dXfBwcEtLS9eXl6ZmZloaGg1NTdFRUWpqas9PTxQUE8rKy2Dg4VxcXOWoZakAAAP80lEQVR4nO1diWKjug4Fgyk0hhLShKRtMmnI1nX+/++e5AWysWUwTe/zubfTBYJ9sCzJsmxbloGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBQdf4H/6S2ivGU8GYAAAAAElFTkSuQmCC',
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView>
          {menuData.menuItems.map(item => {
            return (
              <View key={item.id} style={styles.menuItemContainer}>
                <Image
                  source={{
                    uri: item.item.image
                      ? `data:image/png;base64,${item.item.image}`
                      : 'https://via.placeholder.com/150',
                  }}
                  style={styles.menuItemImage}
                />
                <View style={styles.menuItemDetails}>
                  <Text style={styles.menuItemName}>{item.item.name}</Text>
                  <Text style={styles.menuItemDescription}>
                    {item.item.description}
                  </Text>
                  <Text style={styles.menuItemType}>
                    Type: {item.item.type.toUpperCase()}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#0014A8',
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 5,
                        alignItems: 'center',
                      }}
                      onPress={() => incrementQuantity(item)}>
                      <Text style={{color: '#fff', fontWeight: 'bold'}}>
                        Add to Cart
                      </Text>
                    </TouchableOpacity>

                    <View style={{alignItems: 'center'}}>
                      <Text style={{fontWeight: 'bold', marginBottom: 5}}>
                        Cost: ₹150
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#ddd',
                            width: 25,
                            height: 25,
                            borderRadius: 12.5,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                            -
                          </Text>
                        </TouchableOpacity>

                        <Text
                          style={{marginHorizontal: 10, fontWeight: 'bold'}}>
                          1
                        </Text>

                        <TouchableOpacity
                          style={{
                            backgroundColor: '#ddd',
                            width: 25,
                            height: 25,
                            borderRadius: 12.5,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                            +
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <DownNavbar />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0014A8',
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0014A8',
    paddingVertical: 20,
    padding: 30,
    marginTop: 50,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  menuInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  menuDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  menuTiming: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  menuType: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  menuItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  menuItemImage: {
    width: 150,
    height: 150,
  },
  menuItemDetails: {
    flex: 1,
    padding: 10,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  menuItemType: {
    fontSize: 12,
    color: '#888',
    marginBottom: 3,
  },
  menuItemQuantity: {
    fontSize: 14,
    marginBottom: 3,
    color: '#0014A8',
    marginTop: 5,
    marginLeft: -10,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0014A8',
  },
  headerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MenuItemsByMenuIdScreen;
