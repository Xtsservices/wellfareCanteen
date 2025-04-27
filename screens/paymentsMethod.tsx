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
            uri: 'data:image/jpeg;base64,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',
          }}
          style={styles.icon}
        />
        <Image
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-k5A7NrhXDNY-gs5ZCnOIqe5yuUWotjF-eA&s',
          }}
          style={styles.icon}
        />
        <Image
          source={{
            uri: 'data:image/png;base64,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',
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
