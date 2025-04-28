import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigationTypes';

type BreakfastScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'breakfast'
>;

interface BreakfastProps {
  navigation: BreakfastScreenNavigationProp;
}

const Breakfast: React.FC<BreakfastProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');

  const menuItems = {
    breakfast: [
      { id: 1, name: 'Idli Sambar', price: 40, image: '' },
      { id: 2, name: 'Dosa', price: 50, image: '' },
      { id: 3, name: 'Poha', price: 30, image: '' },
      { id: 4, name: 'Upma', price: 35, image: '' },
      { id: 5, name: 'Sandwich', price: 45, image: '' },
      { id: 6, name: 'Tea/Coffee', price: 15, image: '' },
    ],
    lunch: [
      { id: 7, name: 'Veg Thali', price: 100, image: '' },
      { id: 8, name: 'Paneer Butter Masala', price: 120, image: '' },
      { id: 9, name: 'Dal Tadka', price: 80, image: '' },
      { id: 10, name: 'Jeera Rice', price: 70, image: '' },
    ],
    dinner: [
      { id: 11, name: 'Chapati Curry', price: 60, image: '' },
      { id: 12, name: 'Veg Biryani', price: 110, image: '' },
      { id: 13, name: 'Curd Rice', price: 50, image: '' },
    ],
  };

  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const increaseQuantity = (id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decreaseQuantity = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🍽️ Menu</Text>

      {/* Category Selection */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'breakfast' && styles.selectedCategory,
          ]}
          onPress={() => setSelectedCategory('breakfast')}
        >
          <Text style={styles.categoryText}>Breakfast</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'lunch' && styles.selectedCategory,
          ]}
          onPress={() => setSelectedCategory('lunch')}
        >
          <Text style={styles.categoryText}>Lunch</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'dinner' && styles.selectedCategory,
          ]}
          onPress={() => setSelectedCategory('dinner')}
        >
          <Text style={styles.categoryText}>Dinner</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems[selectedCategory].map((item) => (
          <View key={item.id} style={styles.menuItem}>
            <Image
              source={{
                uri: item.image || 'https://via.placeholder.com/150',
              }}
              style={styles.itemImage}
            />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>₹{item.price}</Text>

            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => decreaseQuantity(item.id)}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantityText}>
                {quantities[item.id] || 0}
              </Text>

              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => increaseQuantity(item.id)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  selectedCategory: {
    backgroundColor: 'blue',
  },
  categoryText: {
    color: '#333',
    fontWeight: 'bold',
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  counterButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  counterButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default Breakfast;
