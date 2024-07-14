import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const UserBookings = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const unsubscribe = firestore()
        .collection('Bookings')
        .doc(currentUser.uid)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot.exists) {
            const userBookings = documentSnapshot.data().bookings || [];
            setBookings(userBookings);
          }
        });

      return () => unsubscribe();
    }
  }, []);


  const renderBookingItem = ({ item }) => (
      <View style={styles.spaceItem}>
        <Image source={{ uri: item.officeDetail.images[0] }} style={styles.image} />
        <View style={styles.spaceInfo}>
          <Text style={styles.spaceName}>{item.officeDetail.name}</Text>
          <Text style={styles.spaceRating}>Rating: {item.officeDetail.rating}
            <Text style={{ color: '#8395a7' }}> ({item.officeDetail.reviews})</Text>
          </Text>
          <Text style={styles.bookingPeriod}>From: {item.from.toDate().toDateString()}</Text>
          <Text style={styles.bookingPeriod}>To: {item.to.toDate().toDateString()}</Text>
          <Text style={styles.bookingRent}>Rent Paid: {item.rent}</Text>
        </View>
      </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
        <TouchableOpacity style={{ position: 'absolute', left: 4, padding: 10 }} onPress={() => navigation.goBack()}>
          <Icon name='arrow-back' size={35} />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'Outfit-Bold', fontSize: 21 }}>
          Your Bookings
        </Text>
      </View>
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    marginBottom: 60,
    gap: 12
  },
  list: {
    paddingBottom: 16,
  },
  spaceItem: {
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom:8
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  spaceInfo: {
    marginLeft: 16,
    justifyContent: 'center'
  },
  spaceName: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 16,
    // marginBottom: 4,
  },
  spaceOwner: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: '#576574',
    // marginBottom: 4,
  },
  spacePrice: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: '#10ac84',
    // marginBottom: 4,
  },
  spaceRating: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: '#ff9f43',
    // marginBottom: 4,
  },
  bookingPeriod: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: '#576574',
    // marginBottom: 4,
  },
  bookingRent: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: '#10ac84',
  },
});

export default UserBookings;
