import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './navigationTypes';
import axios from 'axios';
import {GetMenuItemsbyCanteenId} from './services/restApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const {canteenId} = route.params;
  const date = new Date();
  const today = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const tomorrow = new Date(
    date.setDate(date.getDate() + 1),
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  useEffect(() => {
    const fetchMenuData = async () => {
      const token = await AsyncStorage.getItem('authorization');
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const response = await axios.get(GetMenuItemsbyCanteenId(canteenId), {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        });
        setMenuData(response.data.data);
        console.log('Menu data:', response.data.data);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    fetchMenuData();
  }, [canteenId]);

  const renderMenuItems = (date: string, menu: any) => {
    return (
      <View key={date} style={{paddingHorizontal: 10, marginVertical: 10}}>
        <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
          {date === today ? 'Today' : 'Tomorrow'}
        </Text>
        <Text style={{color: 'white', fontSize: 14, marginBottom: 10}}>
          Date: {date}
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          {Object.keys(menu).map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.foodCard}
              onPress={() => {
                const menuItem = menu[category][0]; // Assuming the first item in the category
                if (menuItem) {
                  navigation.navigate('MenubyMenuId', {
                    menuId: menuItem.id,
                  });
                }
              }}>
              <Image
                source={{uri: 'https://via.placeholder.com/150'}}
                style={styles.foodImage}
              />
              <View
                style={{
                  backgroundColor: '#001F92',
                  width: '100%',
                  alignItems: 'center',
                  paddingVertical: 5,
                }}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>
                  {category}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={styles.headerIcons}>
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

        <View style={styles.searchBar}>
          <Image
            source={{
              uri: 'data:image/png;base64,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',
            }}
            style={{height: 20, width: 20}}
          />
          <TextInput placeholder="Search..." style={styles.searchInput} />
          <TouchableOpacity>
            <Image style={styles.micIcon} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginVertical: 10,
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#0014A8',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Industrial WET Canteen
          </Text>
          <Text style={styles.canteenName}>Canteen Name</Text>
        </View>

        <ScrollView>
          {menuData &&
            Object.keys(menuData).map(date =>
              renderMenuItems(date, menuData[date]),
            )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0014A8',
    marginTop: 50,
  },
  canteenName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 50,
    height: 50,
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  micIcon: {
    width: 25,
    height: 25,
  },
  banner: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  categories: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  categoryButton: {
    backgroundColor: '#0014A8',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
  },
  foodItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
    paddingBottom: 60, // Add padding to avoid overlap with the sticky navbar
  },
  foodCard: {
    width: 120,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 5,
    elevation: 5, // for shadow on Android
    shadowColor: '#000', // for shadow on iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  foodImage: {
    width: '100%',
    height: '75%', // 75% image, 25% text section
    resizeMode: 'cover',
  },
  stickyNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default Dashboard;
