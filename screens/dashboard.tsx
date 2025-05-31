import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './navigationTypes';
import axios from 'axios';
import {GetMenuItemsbyCanteenId} from './services/restApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DownNavbar from './downNavbar';

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Dashboard',
  'MenubyMenuId'
>;

interface DashboardProps {
  navigation: DashboardScreenNavigationProp;
  route: {
    params: {
      canteenId: string;
    };
  };
}

const Dashboard: React.FC<DashboardProps> = ({navigation, route}) => {
  const [menuData, setMenuData] = useState<any>(null);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const {canteenId} = route.params;

  useEffect(() => {
    console.log('Canteen ID:', canteenId);
    const fetchMenuData = async () => {
      try {
        let validCanteenId = canteenId;
        if (!validCanteenId) {
          validCanteenId = (await AsyncStorage.getItem('canteenId')) || '';
        }
        if (!validCanteenId) {
          console.error('No canteenId available');
          return;
        }
        await AsyncStorage.setItem('canteenId', validCanteenId);

        const token = await AsyncStorage.getItem('authorization');
        if (!token) {
          console.error('No token found');
          return;
        }

        console.log('Token:', token);
        console.log('Valid Canteen ID:', validCanteenId);
        

        const response = await axios.get(
           
          GetMenuItemsbyCanteenId(validCanteenId),
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          },
        );

        setMenuData(response.data.data);

        console.log('Menu data:', response.data.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 500) {
          Alert.alert(
            'Error',
            'Failed to load menu data. Please try again later.',
          );
        }
      }
    };

    fetchMenuData();
  }, [canteenId]);

  const renderMenuItems = (date: string, menu: any) => (
    <View key={date} style={styles.menuSection}>
      <Text style={styles.menuDate}>{date}</Text>
      <View style={styles.menuRow}>
        {Object.keys(menu).map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuCard}
            onPress={async () => {
              const menuItem = menu[category][0];
              if (menuItem) {
                // Store the selected date in state before navigating
                setSelectedDate(date);
                // Store the selected date in AsyncStorage before navigating
                await AsyncStorage.setItem('selectedDate', date);
                navigation.navigate('MenubyMenuId', {
                  menuId: menuItem.id,
                  date: date, // pass date as prop
                });
                console.log('Selected date:', date);
              }
            }}>
            <Image
              source={{
                uri:
                  category === 'Breakfast'
                    ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
                    : category === 'Lunch'
                    ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'
                    : category === 'Snack'
                    ? 'https://wallpapers.com/images/high/assorted-snack-products-display-jq5cfglivdr8d6t6-jq5cfglivdr8d6t6.png'
                    : 'https://via.placeholder.com/150',
              }}
              style={styles.menuImage}
            />
            <Text style={styles.menuCategory}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0014A8',
          paddingVertical: 18,
          paddingHorizontal: 18,
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 18,
          marginBottom: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{uri: 'https://welfarecanteen.in/public/Naval.jpg'}}
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>Welfare Canteen</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconborder}>
            <Image
              source={{
                uri: 'https://creazilla-store.fra1.digitaloceanspaces.com/icons/3235242/wallet-icon-sm.png',
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconborder}
            onPress={() => navigation.navigate('SettingsScreen')}>
            <Image
              source={{
                uri: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Image
          source={{
            uri: 'https://img.icons8.com/ios-filled/50/000000/search--v1.png',
          }}
          style={styles.searchIcon}
        />
        <TextInput placeholder="Search..." style={styles.searchInput} />
        <TouchableOpacity>
          <Image
            source={{
              uri: 'https://img.icons8.com/ios-filled/50/000000/microphone.png',
            }}
            style={styles.micIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Menu List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {menuData &&
          Object.keys(menuData).map(date => {
            // Store the key (date) in state if needed
            // Example: setSelectedDate(date); (define selectedDate state if required)
            return renderMenuItems(date, menuData[date]);
          })}
      </ScrollView>
      <DownNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0014A8',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 38,
    height: 38,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    width: 26,
    height: 26,
  },
  iconborder: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 7,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 18,
    marginBottom: 10,
    paddingHorizontal: 12,
    elevation: 2,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#0014A8',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#222',
  },
  micIcon: {
    width: 22,
    height: 22,
    tintColor: '#0014A8',
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  menuSection: {
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    elevation: 2,
  },
  menuDate: {
    color: '#0014A8',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: 100,
    alignItems: 'center',
    backgroundColor: '#F6F8FB',
    borderRadius: 10,
    padding: 8,
    marginHorizontal: 4,
    elevation: 1,
  },
  menuImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  menuCategory: {
    color: '#0014A8',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Dashboard;
function setSelectedDate(date: string) {
  throw new Error('Function not implemented.');
}
