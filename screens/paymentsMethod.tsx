import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation
import DownNavbar from './downNavbar';

const PaymentMethod = () => {
  const navigation = useNavigation(); // Initialize navigation

  const handlePayment = () => {
    navigation.navigate('OrderPlaced' as never); // Replace "OrderPlaced" with your screen name
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4d/Indian_Navy_crest.svg/1200px-Indian_Navy_crest.svg.png',
          }}
          style={styles.logo}
        />
        <Text style={styles.title}>Payment Method</Text>
      </View>

      <View style={styles.paymentOptions}>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/PhonePe_Logo.png',
          }}
          style={styles.icon}
        />
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Google_Pay_Logo_%282020%29.svg/1200px-Google_Pay_Logo_%282020%29.svg.png',
          }}
          style={styles.icon}
        />
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Paytm_logo.svg/1200px-Paytm_logo.svg.png',
          }}
          style={styles.icon}
        />
      </View>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>UPI</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Wallet</Text>
      </TouchableOpacity>

      <View style={styles.cardDetails}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>PAY</Text>
        </TouchableOpacity>
      </View>

      <DownNavbar style={styles.stickyNavbar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000080',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  orText: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
  },
  cardDetails: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  payButton: {
    backgroundColor: '#000080',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  option: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionText: {
    color: '#000080',
    fontWeight: 'bold',
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

export default PaymentMethod;
