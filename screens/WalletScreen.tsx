import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './navigationTypes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type WalletScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'WalletScreen'
>;

interface WalletScreenProps {
  navigation: WalletScreenNavigationProp;
}

interface Transaction {
  id: number;
  userId: string;
  referenceId: string;
  type: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

const WalletScreen: React.FC<WalletScreenProps> = ({navigation}) => {
  const [showAll, setShowAll] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Fetching wallet data...');
    const fetchWalletData = async () => {
      const token = await AsyncStorage.getItem('authorization');
      setLoading(true);
      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: token ?? '', // Ensure it's always a string
        };

        const transRes = await fetch(
          'https://server.welfarecanteen.in/api/order/getWalletTransactions',
          {headers},
        );
        const transJson = await transRes.json();

        const balanceRes = await fetch(
          'https://server.welfarecanteen.in/api/order/getWalletBalance',
          {headers},
        );
        const balanceJson = await balanceRes.json();

        setTransactions(transJson.data.transactions || []);
        setWalletBalance(balanceJson.data.walletBalance || 0);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const displayedHistory = showAll ? transactions : transactions.slice(0, 4);

  return (
    <View style={styles.container}>
      {/* Top Blue Header */}
      <View style={styles.header}>
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center',
          }}>
          Wallet Amount
        </Text>
      </View>

      {/* Wallet Section */}
      <View style={styles.walletCard}>
        <Text style={styles.walletAmount}>₹ {walletBalance}</Text>
      </View>

      {/* History Section */}
      <ScrollView style={styles.historySection}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Transactions</Text>
          <TouchableOpacity onPress={() => setShowAll(!showAll)}>
            <Text style={styles.viewAllText}>
              {showAll ? 'View Less' : 'View All'}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0014A8" />
        ) : (
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.headerCell]}>Type</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Amount</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>
                Reference
              </Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Date</Text>
            </View>
            {displayedHistory.map(item => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.type}</Text>
                <Text style={styles.tableCell}>₹{item.amount}</Text>
                <Text style={styles.tableCell}>{item.referenceId}</Text>
                <Text style={styles.tableCell}>
                  {new Date(item.createdAt * 1000).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>proposed by</Text>
        <Image
          source={{uri: 'https://watabix.com/assets/logo.png'}}
          style={styles.footerLogo}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0014A8',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 35,
    fontSize: 14,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 5,
  },
  walletCard: {
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0014A8',
    alignItems: 'center',
  },
  walletAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0014A8',
    marginBottom: 10,
  },
  historySection: {
    flex: 1,
    marginHorizontal: 15,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: '#0014A8',
    fontSize: 14,
    fontWeight: '500',
  },
  table: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#0014A8',
  },
  footer: {
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  footerLogo: {
    width: 80,
    height: 20,
    resizeMode: 'contain',
    marginTop: 5,
  },
});

export default WalletScreen;
