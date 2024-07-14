import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { CodeContext } from '../components/CodeConfirmContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const UserFavourite = ({navigation}) => {
  const [favorites, setFavorites] = useState([]);

const {setOfficeData}=useContext(CodeContext)
  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
        const unsubscribe = firestore()
            .collection('UserFavourite')
            .doc(currentUser.uid)
            .onSnapshot(documentSnapshot => {
                if (documentSnapshot.exists) {
                    const offices = documentSnapshot.data().offices || [];
                    setFavorites(offices);
                }
            });

        return () => unsubscribe();
    }
}, []);


const handleOfficeClick=(item)=>{
  setOfficeData(item)
  navigation.navigate('OfficeDetail')
}
  const renderFavouriteItem = ({item }) => (
    <TouchableOpacity  onPress={()=> handleOfficeClick(item)}>

    <View style={styles.spaceItem}>
      <Image source={{ uri: item.images[0] }} style={styles.image} />
      <View style={styles.spaceInfo}>
        <Text style={styles.spaceName}>{item.name}</Text>
        <Text style={styles.spaceOwner}>Owner: {item.owner}</Text>
        <Text style={styles.spacePrice}>Price: {item.price}</Text>
        <Text style={styles.spaceRating}>Rating: {item.rating}
        <Text style={{color:'#8395a7'}}> ({item.reviews})</Text>
        </Text>
      </View>
    </View>

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

<View style={{flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
            <TouchableOpacity style={{position: 'absolute', left: 4,padding:10} } onPress={()=>navigation.goBack()}>
            <Icon name='arrow-back' size={35} />

                </TouchableOpacity>
                <Text style={{flex: 1, textAlign: 'center', fontFamily: 'Outfit-Bold', fontSize: 21}}>
                    Your Favourites
                </Text>
            </View>
      <FlatList
        data={favorites}
        renderItem={renderFavouriteItem}
        keyExtractor={(item) => item.name}
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
    marginBottom:60,
    gap:12
  },
  title: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  spaceItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 }
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10
  },
  spaceInfo: {
    marginLeft: 10,
    justifyContent: 'center'
  },
  spaceName: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 16
  },
  spaceOwner: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: '#576574'
  },
  spacePrice: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: '#10ac84'
  },
  spaceRating: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: '#ff9f43'
  },
});

export default UserFavourite;
