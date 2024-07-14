import { PlatformPay, PlatformPayButton, StripeProvider, usePlatformPay } from '@stripe/stripe-react-native';
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View,Modal } from 'react-native';
import { CodeContext } from '../components/CodeConfirmContext';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

function PaymentScreen() {
  const {officeData,daysBook, setDaysBook,dateSelected, setDateSelected}=useContext(CodeContext)
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
 
  const {
    isPlatformPaySupported,
    confirmPlatformPayPayment,
  } = usePlatformPay();

  React.useEffect(() => {
    (async function () {
      if (!(await isPlatformPaySupported({ googlePay: { testEnv: true } }))) {
        Alert.alert('Google Pay is not supported.');
        return;
      }
    })();
  }, []);

  const API_URL = 'https://collabnestbackend.onrender.com/';

  const fetchPaymentIntentClientSecret = async (priceInCents) => {
    try {
      const response = await fetch(`${API_URL}create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(priceInCents), 
          currency: 'usd'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const { client_secret } = await response.json();
      return client_secret;
    } catch (error) {
      
      setErrorMessage(error.message)
      setModalVisible(true)
    }
  };

  const pay = async () => {

    if (!daysBook && !dateSelected || daysBook <=0) {
      setErrorMessage('Fill correct days and date values first')
      setModalVisible(true)
      return;
  }
 
  const days = parseInt(daysBook, 10);
  const [datePart, timePart] = dateSelected.split(' ');
  const [day, month, year] = datePart.split('/');
  const [hour, minute] = timePart.split(':');
  const startDate = new Date(year, month - 1, day, hour, minute); // Include time
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);
  const priceMatch = officeData.price.match(/(\d+)/);
  const daysInMonth = new Date(year, month, 0).getDate();

  const monthlyRent = parseFloat(priceMatch[0]);
  const dailyRent = monthlyRent / daysInMonth;

  const totalRent = dailyRent * days;
  const priceInUSD = totalRent / 280; 
  const priceInCents = priceInUSD * 100; 
 
    const clientSecret = await fetchPaymentIntentClientSecret(priceInCents);

    if (!clientSecret) {
      return;
    }


    try {
      const user = auth().currentUser;
      const bookingRef = firestore().collection('Bookings').doc(user.uid);
      const doc = await bookingRef.get();

      let bookings = doc.exists ? doc.data().bookings : [];
      let conflict = false;

      for (let booking of bookings) {
        const bookingStart = booking.from.toDate();
        const bookingEnd = booking.to.toDate();
        if ((startDate >= bookingStart && startDate <= bookingEnd) ||
          (endDate >= bookingStart && endDate <= bookingEnd) ||
          (startDate <= bookingStart && endDate >= bookingEnd)) {
          conflict = true;
          break;
        }
      }

      if (conflict) {
        setErrorMessage('The selected dates conflict with an existing booking.')
        setModalVisible(true)
        return;
      } else {
        bookings.push({
          officeDetail: officeData,
          from: firestore.Timestamp.fromDate(startDate),
          to: firestore.Timestamp.fromDate(endDate),
          rent: Math.round(totalRent),
        });
        await bookingRef.set({ bookings });

      }
    } catch (error) {
      
      setErrorMessage('An error occurred while processing your booking.')
      setModalVisible(true)
      return;
    }
    const { error } = await confirmPlatformPayPayment(
      clientSecret,
      {
        googlePay: {
          testEnv: true,
          merchantName: 'My merchant name',
          merchantCountryCode: 'US',
          currencyCode: 'USD',
          billingAddressConfig: {
            format: PlatformPay.BillingAddressFormat.Full,
            isPhoneNumberRequired: true,
            isRequired: true,
          },
        },
      }
    );

    if (error) {
      setErrorMessage(error.message)
      setModalVisible(true)
     
      return;
    }
    setDaysBook('')
    setDateSelected('')
    setErrorMessage(`Payment Succesfull,PKR ${Math.round(totalRent)} has been deducted from your account.`)
    setModalVisible(true)




  };

  return (<>
    <StripeProvider
      publishableKey='pk_test_51PMyw7D2O3UR1xcz4qfMadBogIrsXRxfYdEtf8yoxbWHTIez0URm3RkzuDkRb19SYqP1xKW4SYgh52C0KpS0daSD00nucUVdyJ'>
      <TouchableOpacity style={styles.customButton} onPress={pay}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Make Payment</Text>
          <PlatformPayButton
            type={PlatformPay.ButtonType.Pay}
            onPress={pay}
            style={styles.hiddenPayButton}
          />
        </View>
      </TouchableOpacity>
    </StripeProvider>
    <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={{padding:8,backgroundColor:'#EE5A24',borderRadius:6,paddingHorizontal:16}} onPress={() => setModalVisible(false)} >
              <Text style={{color:'white',fontFamily:'Outfit-Bold',fontSize:15}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  </>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 20,
    fontSize: 16,
    color: 'red',
    fontFamily:'Outfit-Bold'
  },
  customButton: {
    padding: 10,
    backgroundColor: '#EE5A24',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Outfit-Bold',
    fontSize: 15,
  },
  hiddenPayButton: {
    width: 1,
    height: 1,
    opacity: 0,
  },
});
export default PaymentScreen;
