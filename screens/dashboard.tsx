import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import DownNavbar from './downNavbar';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigationTypes'

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectCanteen'>;

interface DashboardProps {
  navigation: DashboardScreenNavigationProp;
}

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
  return (
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
            onPress={() => navigation.navigate('SettingsScreen')}
          >
            <Image
              source={{
                uri: 'data:image/png;base64,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',
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Image style={{height: 20, width: 20}} />
        <TextInput placeholder="Search..." style={styles.searchInput} />
        <TouchableOpacity>
          <Image style={styles.micIcon} />
        </TouchableOpacity>
      </View>

      <Image style={styles.banner} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}>
        {['All', 'Today Special', 'Tiffins', 'Veg', 'Non-Veg'].map(
          (category, index) => (
            <TouchableOpacity key={index} style={styles.categoryButton}>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ),
        )}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.foodItems}>
        {[1, 2, 3, 4, 5, 6].map((item, index) => (
          <TouchableOpacity key={index} style={styles.foodCard}>
            <Image style={styles.foodImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <DownNavbar style={styles.stickyNavbar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0014A8',
    marginTop: 50,
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
    paddingBottom: 60,
  },
  foodCard: {
    width: '45%',
    backgroundColor: '#0014A8',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: 100,
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
