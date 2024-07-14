import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { CodeContext } from '../components/CodeConfirmContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Rating from 'react-native-vector-icons/Entypo';
import Wifi from 'react-native-vector-icons/AntDesign';

import firestore from '@react-native-firebase/firestore';
import Heart from 'react-native-vector-icons/AntDesign';
import Fastfood from 'react-native-vector-icons/MaterialIcons';
import Air from 'react-native-vector-icons/MaterialIcons';
import Hours_24 from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

const OfficeDetail = ({ navigation }) => {
    const { officeData } = useContext(CodeContext);
    const [isLiked, setIsLiked] = useState(false);
    const [userData, setUserData] = useState('');
    const [favoriteOffices, setFavoriteOffices] = useState([]);

    useEffect(() => {
      const currentUser = auth().currentUser;
      if (currentUser) {
          setUserData(currentUser.uid);
          const unsubscribe = firestore()
              .collection('UserFavourite')
              .doc(currentUser.uid)
              .onSnapshot(documentSnapshot => {
                  if (documentSnapshot.exists) {
                      const offices = documentSnapshot.data().offices || [];
                      setFavoriteOffices(offices);
                      setIsLiked(offices.some(office => office.name === officeData.name));
                  }
              });
  
          return () => unsubscribe();
      }
  }, [officeData]);
  

    const handleHeartClick = () => {
        const updatedFavorites = isLiked 
            ? favoriteOffices.filter(office => office.name !== officeData.name)
            : [...favoriteOffices, officeData];

        setIsLiked(!isLiked);
        setFavoriteOffices(updatedFavorites);

        firestore()
            .collection('UserFavourite')
            .doc(userData)
            .set({
                offices: updatedFavorites
            })
           
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                <TouchableOpacity style={{ padding: 4 }} onPress={() => navigation.goBack()}>
                    <Icon name='arrow-back' size={35} />
                </TouchableOpacity>
                <View>
                    <Text style={{ textAlign: 'center', fontFamily: 'Outfit-Bold', fontSize: 19 }}>Office Detail</Text>
                    <Text style={{ textAlign: 'center', fontFamily: 'Outfit-Light', color: '#8395a7' }}>Space available for today</Text>
                </View>
                <TouchableOpacity onPress={handleHeartClick}>
                    {isLiked ? (
                        <Heart name='heart' size={25} color='#EE5A24' />
                    ) : (
                        <Heart name='hearto' size={25} />
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <Image
                    source={{ uri: officeData.images[0] }}
                    style={styles.image}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.name}>{officeData.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="place" size={20} color="#ff9f43" />
                                <Text style={styles.location}>{officeData.location.city}</Text>
                            </View>
                            <Text>{<Rating name="star" size={18} color="#ff9f43" />} {officeData.rating} ({officeData.reviews})</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 20 }}>Overview</Text>
                    <Text style={{ fontFamily: 'Outfit-Regular' }}>
                        {officeData.owner}, the owner, ensures a professional and modern workspace in the heart of {officeData.location.city}. His dedication to quality and customer satisfaction has earned the office high praise and ratings.
                    </Text>
                </View>
                <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 20 }}>Common Facilities</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center', gap: 6 }}>
                        <View style={styles.iconContainer}>
                            <Air name="air" size={24} color="#b2bec3" />
                        </View>
                        <Text style={{ fontFamily: 'Outfit-Light', fontSize: 12, color: '#a4b0be' }}>AC</Text>
                    </View>
                    <View style={{ alignItems: 'center', gap: 6 }}>
                        <View style={styles.iconContainer}>
                            <Wifi name="wifi" size={24} color="#b2bec3" />
                        </View>
                        <Text style={{ fontFamily: 'Outfit-Light', fontSize: 12, color: '#a4b0be' }}>Wifi</Text>
                    </View>
                    <View style={{ alignItems: 'center', gap: 6 }}>
                        <View style={styles.iconContainer}>
                            <Fastfood name="fastfood" size={24} color="#b2bec3" />
                        </View>
                        <Text style={{ fontFamily: 'Outfit-Light', fontSize: 12, color: '#a4b0be' }}>Restaurant</Text>
                    </View>
                    <View style={{ alignItems: 'center', gap: 6 }}>
                        <View style={styles.iconContainer}>
                            <Hours_24 name="hours-24" size={24} color="#b2bec3" />
                        </View>
                        <Text style={{ fontFamily: 'Outfit-Light', fontSize: 12, color: '#a4b0be' }}>Open 24/7</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 26 }}>
                    <Text style={{ fontFamily: 'Outfit-Bold', color: '#10ac84' }}>{officeData.price}</Text>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#EE5A24', padding: 4, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.navigate('Booking')}>
                        <Text style={{ color: 'white', alignSelf: 'center', fontSize: 16, fontWeight: 500, fontFamily: 'Outfit-SemiBold' }}>Book Office</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    headerTitle: {
        textAlign: 'center',
        fontFamily: 'Outfit-Bold',
        fontSize: 19,
    },
    headerSubtitle: {
        textAlign: 'center',
        fontFamily: 'Outfit-Light',
        color: '#8395a7',
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        gap: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontFamily: 'Outfit-SemiBold',
    },
    owner: {
        fontSize: 18,
        color: '#555',
    },
    price: {
        fontSize: 18,
        color: '#555',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    rating: {
        fontSize: 16,
        color: '#555',
    },
    reviews: {
        marginLeft: 10,
        fontSize: 16,
        color: '#555',
    },
    location: {
        marginLeft: 5,
        fontSize: 16,
        color: '#555',
        fontFamily: 'Outfit-Light',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#dfe6e9',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default OfficeDetail;
