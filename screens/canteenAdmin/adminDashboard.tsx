import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  useWindowDimensions,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigationTypes';

type AdminDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminDashboard'
>;

const AdminDashboard = () => {
  const navigation = useNavigation<AdminDashboardNavigationProp>();
  const { width } = useWindowDimensions();

  // Calculate square size with proper spacing
  const cardMargin = 16;
  const squareSize = width < 768 ? 
    (width - (3 * cardMargin)) / 2 : // 2 cards in row with margins
    Math.min((width - (5 * cardMargin)) / 4, 200); // Max width 200 on larger screens

  return (
    <View style={styles.container}>
      {/* Header */}
      
      <View style={styles.header}>
        
        <Text style={styles.headerTitle}>Restaurant Dashboard</Text>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.contentContainer,
          { paddingHorizontal: cardMargin }
        ]}
      >
        <View style={styles.gridContainer}>
          {/* Row 1 */}
          <View style={styles.row}>
            <TouchableOpacity 
              style={[
                styles.squareCard, 
                { 
                  width: squareSize, 
                  height: squareSize,
                  marginRight: cardMargin,
                  marginBottom: cardMargin
                }
              ]}
              onPress={() => navigation.navigate('Menu')}
            >
              <Image
                source={{ uri: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Menu</Text>
                <Text style={styles.cardDescription}>Manage menu items</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.squareCard, 
                { 
                  width: squareSize, 
                  height: squareSize,
                  marginBottom: cardMargin
                }
              ]}
              onPress={() => navigation.navigate('Users')}
            >
              <Image
                source={{ uri: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Users</Text>
                <Text style={styles.cardDescription}>Manage staff</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            <TouchableOpacity 
              style={[
                styles.squareCard, 
                { 
                  width: squareSize, 
                  height: squareSize,
                  marginRight: cardMargin
                }
              ]}
              // onPress={() => navigation.navigate('Orders')}
            >
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Orders</Text>
                <Text style={styles.cardDescription}>Track orders</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.squareCard, 
                { 
                  width: squareSize, 
                  height: squareSize
                }
              ]}
              onPress={() => navigation.navigate('breakfast')}
            >
              <Image
                source={{ uri: 'https://images.pexels.com/photos/4253320/pexels-photo-4253320.jpeg' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Walk-ins</Text>
                <Text style={styles.cardDescription}>Manage customers</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <TouchableOpacity 
        style={styles.footer}
        onPress={() => navigation.navigate('BluetoothControl')}
      >
        <View style={styles.footerGradient}>
          <Text style={styles.footerTitle}>Quick Scan</Text>
          <Text style={styles.footerText}>Scan QR Code or Enter Token Number</Text>
        </View>
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
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e8eaf6',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  gridContainer: {
    width: '100%',
    maxWidth: 500, // Limits the maximum width of the grid
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
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
        ':hover': {
          transform: 'translateY(-4px)',
        },
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
  footer: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#1a237e',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
      default: {
        elevation: 5,
      },
    }),
  },
  footerGradient: {
    padding: 20,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  footerText: {
    fontSize: 16,
    color: '#e8eaf6',
    opacity: 0.9,
  },
});

export default AdminDashboard;