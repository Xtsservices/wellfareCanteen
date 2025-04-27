import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
// import {AllCanteens} from './services/restApi'; // Commented out API import
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Commented out AsyncStorage import

type RootStackParamList = {
  Dashboard: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

type Canteen = {
  id: string;
  canteenName: string;
  canteenImage: string;
};

const SelectCanteenScreen = () => {
  // Hardcoded canteen data instead of API fetch
  const hardcodedCanteens: Canteen[] = [
    {
      id: '1',
      canteenName: 'Main Canteen',
      canteenImage: 'https://example.com/canteen1.jpg', // Replace with actual image URL or local image
    },
    {
      id: '2',
      canteenName: 'North Campus Canteen',
      canteenImage: 'https://example.com/canteen2.jpg', // Replace with actual image URL or local image
    },
    {
      id: '3',
      canteenName: 'South Campus Canteen',
      canteenImage: 'https://example.com/canteen3.jpg', // Replace with actual image URL or local image
    },
  ];

  const [canteens, setCanteens] = useState<Canteen[]>(hardcodedCanteens);
  const [selectedCanteen, setSelectedCanteen] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Commented out the API fetch and replaced with hardcoded data
    /*
    const fetchCanteens = async () => {
      try {
        const token = await AsyncStorage.getItem('authorization');
        if (!token) {
          console.error('No token found');
          return;
        }
        const response = await fetch(AllCanteens(), {
          headers: {
            authorization: token,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (response.ok) {
          setCanteens(
            result.data.map((item: any) => ({
              id: item.id.toString(),
              canteenName: item.canteenName,
              canteenImage: item.canteenImage,
            })),
          );
          console.log('Canteens fetched successfully:', result.data);
        } else {
          console.error('Failed to fetch canteens:', result.message);
        }
      } catch (error) {
        console.error('Error fetching canteens:', error);
      }
    };

    fetchCanteens();
    */
    
    // Using hardcoded data instead
    setCanteens(hardcodedCanteens);
  }, []);

  const handleCanteenSelect = (canteenName: string) => {
    setSelectedCanteen(canteenName);
  };

  const handleConfirm = () => {
    if (selectedCanteen) {
      navigation.navigate('Dashboard');
    }
  };

  const renderCanteenItem = ({item}: {item: Canteen}) => (
    <TouchableOpacity
      style={[
        styles.canteenItem,
        selectedCanteen === item.canteenName && styles.selectedCanteenItem,
      ]}
      onPress={() => handleCanteenSelect(item.canteenName)}>
      <Image source={{uri: item.canteenImage}} style={styles.canteenImage} />
      <Text style={styles.canteenText}>{item.canteenName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Canteen</Text>
      <FlatList
        data={canteens}
        keyExtractor={item => item.id}
        renderItem={renderCanteenItem}
        contentContainerStyle={styles.listContainer}
      />
      {selectedCanteen && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#010080',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 16,
  },
  canteenItem: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    width: '90%',
    alignSelf: 'center',
  },
  selectedCanteenItem: {
    backgroundColor: '#cce5ff',
  },
  canteenImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  canteenText: {
    color: '#010080',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#010080',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SelectCanteenScreen;