import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from './header'; // Adjust path to your Header component
import DownNavbar from './downNavbar'; // Adjust path to your DownNavbar component

// Define interface for component props (if any are added later)
interface PrivacyPolicyProps {}

// Constants (aligned with ViewOrders.js)
const COLORS = {
  PRIMARY: '#0014A8',
  TEXT_DARK: '#333',
  TEXT_SECONDARY: '#888',
  BACKGROUND: '#F3F6FB',
  BORDER: '#e0e0e0',
};

// Define styles with StyleSheet.create for TypeScript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContainer: {
    padding: wp('4%'),
    paddingBottom: hp('12%'),
  },
  policyCard: {
    backgroundColor: '#fff',
    borderRadius: wp('4%'),
    padding: wp('4.5%'),
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: wp('2%'),
    shadowOffset: {width: 0, height: hp('0.2%')},
    elevation: 3,
  },
  title: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    marginBottom: hp('2%'),
  },
  description: {
    fontSize: wp('3.8%'),
    color: COLORS.TEXT_DARK,
    marginBottom: hp('2%'),
    lineHeight: hp('2.5%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  sectionText: {
    fontSize: wp('3.8%'),
    color: COLORS.TEXT_DARK,
    marginBottom: hp('1%'),
    lineHeight: hp('2.5%'),
  },
  bulletPoint: {
    fontSize: wp('3.8%'),
    color: COLORS.TEXT_DARK,
    marginLeft: wp('4%'),
    marginBottom: hp('0.5%'),
    lineHeight: hp('2.5%'),
  },
  bold: {
    fontWeight: 'bold',
  },
  stickyNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: hp('1.2%'),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: wp('0.2%'),
    borderTopColor: COLORS.BORDER,
  },
});

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = () => {
  return (
    <View style={styles.container}>
      <Header text="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.policyCard}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.subtitle}>
            Industrial Wet Canteen - Welfare Canteen Program
          </Text>
          <Text style={styles.description}>
            The Industrial Wet Canteen under the Welfare Canteen Program is
            committed to protecting the privacy of users of our mobile
            application. This Privacy Policy explains how we collect, use,
            protect, and handle your personal information, as well as your
            rights regarding your data. This policy applies to our app, which
            uses mobile number login and allows saving QR codes to your device’s
            gallery.
          </Text>

          <Text style={styles.sectionTitle}>1. Data We Collect</Text>
          <Text style={styles.sectionText}>
            We collect the following information:
          </Text>
          <Text style={styles.bulletPoint}>
            • <Text style={styles.bold}>Mobile Number</Text>: Used for login
            authentication.
          </Text>
          <Text style={styles.bulletPoint}>
            • <Text style={styles.bold}>Employee/Service ID</Text>: Used for
            user verification during booking or food collection.
          </Text>
          <Text style={styles.bulletPoint}>
            • <Text style={styles.bold}>Order History</Text>: Details of your
            food orders, including items, quantities, and timestamps.
          </Text>
          <Text style={styles.bulletPoint}>
            • <Text style={styles.bold}>QR Code Images</Text>: Generated for
            order verification and optionally saved to your device’s gallery.
          </Text>

          <Text style={styles.sectionTitle}>2. Purpose of Data Collection</Text>
          <Text style={styles.sectionText}>
            We collect and use your data to:
          </Text>
          <Text style={styles.bulletPoint}>
            • Authenticate users via mobile number for secure login.
          </Text>
          <Text style={styles.bulletPoint}>
            • Process, confirm, and manage food orders.
          </Text>
          <Text style={styles.bulletPoint}>
            • Maintain order history and enforce booking limits.
          </Text>
          <Text style={styles.bulletPoint}>
            • Generate QR codes for order verification and allow saving them to
            your device’s gallery.
          </Text>
          <Text style={styles.bulletPoint}>
            • Ensure compliance with canteen policies and prevent misuse.
          </Text>

          <Text style={styles.sectionTitle}>3. Data Sharing</Text>
          <Text style={styles.sectionText}>
            We do not share your personal data with anyone, including third
            parties, government entities, or internal teams, under any
            circumstances.
          </Text>

          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.sectionText}>
            We use robust technical and administrative measures to protect your
            data, including:
          </Text>
          <Text style={styles.bulletPoint}>
            • Encryption of data in transit (e.g., during API calls for order
            management).
          </Text>
          <Text style={styles.bulletPoint}>
            • Secure storage of mobile numbers, order history, and QR code data
            on servers in India.
          </Text>
          <Text style={styles.bulletPoint}>
            • Handling of QR code images saved to your device only with your
            explicit permission.
          </Text>

          <Text style={styles.sectionTitle}>5. User Rights</Text>
          <Text style={styles.sectionText}>You have the right to:</Text>
          <Text style={styles.bulletPoint}>
            • Request access to your personal information stored by the app.
          </Text>
          <Text style={styles.bulletPoint}>
            • Correct inaccurate or outdated information.
          </Text>
          <Text style={styles.bulletPoint}>
            • Request deletion of your data, subject to service limitations
            (e.g., inability to use the app without a mobile number).
          </Text>

          <Text style={styles.sectionTitle}>6. Android Permissions</Text>
          <Text style={styles.sectionText}>
            Our app requires the following permissions to function:
          </Text>
          <Text style={styles.bulletPoint}>
            • <Text style={styles.bold}>Internet</Text>: Required to connect to
            our booking platform, fetch order details, and generate QR codes.
          </Text>

          <Text style={styles.sectionText}>
            This permission is used solely for the purposes described above and
            is not used to collect any unnecessary data. Disabling Internet
            access may prevent the app from functioning properly.
          </Text>
        </View>
      </ScrollView>
      <DownNavbar style={styles.stickyNavbar} />
    </View>
  );
};

export default PrivacyPolicy;
