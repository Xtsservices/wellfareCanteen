import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigationTypes';

const { width } = Dimensions.get('window');

type BreakfastScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'breakfast'
>;

interface BreakfastProps {
  navigation: BreakfastScreenNavigationProp;
}

const Breakfast: React.FC<BreakfastProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

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

  const increaseQuantity = (id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decreaseQuantity = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  // Calculate total items in cart
  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  // Calculate total price
  const totalPrice = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const item = [...menuItems.breakfast, ...menuItems.lunch, ...menuItems.dinner].find(i => i.id === parseInt(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  // Prepare cart items for checkout
  const prepareCartItems = () => {
    return Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = [...menuItems.breakfast, ...menuItems.lunch, ...menuItems.dinner].find(i => i.id === parseInt(id));
        return { ...item, quantity: qty };
      });
  };

  const handleContinue = () => {
    const cartItems = prepareCartItems();
  
    const checkoutCartItems = cartItems.map(item => ({
      code: `item-${item.id}`,  // or any logic you prefer for "code"
      item: item.name ?? 'Unknown Item',
      qty: item.quantity,
      total: (item.price ?? 0) * item.quantity,
    }));
  
    navigation.navigate('Checkout', { cart : checkoutCartItems, total: totalPrice });
  };
  

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🍽️ Explore the Menu</Text>

        {/* Category Selection */}
        <View style={styles.categoryContainer}>
          {['breakfast', 'lunch', 'dinner'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category as 'breakfast' | 'lunch' | 'dinner')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
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
                resizeMode="cover"
              />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>

              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => decreaseQuantity(item.id)}
                >
                  <Text style={styles.counterButtonText}>−</Text>
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

      {/* Cart Summary Bar */}
      {totalItems > 0 && (
        <View style={styles.cartSummary}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartText}>{totalItems} items in cart</Text>
            <Text style={styles.cartPrice}>₹{totalPrice}</Text>
          </View>
          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for cart summary
  },
  title: {
    marginTop: 50,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#E0E7FF',
    borderRadius: 20,
    marginHorizontal: 6,
  },
  selectedCategory: {
    backgroundColor: '#6366F1',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  itemImage: {
    width: '100%',
    height: 130,
    borderRadius: 14,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  counterButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  counterButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    minWidth: 24,
    textAlign: 'center',
  },
  cartSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 5,
  },
  cartInfo: {
    flex: 1,
  },
  cartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  cartPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  continueButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Breakfast;