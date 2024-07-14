import React, { useContext, useEffect, useState } from 'react';
import { Text, View, Modal, StyleSheet, TouchableOpacity, FlatList, Image, SafeAreaView, BackHandler, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { PERMISSIONS, request, check, } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome6';
import { spaces } from '../components/data';
import { CodeContext } from '../components/CodeConfirmContext';

const UserScreen = ({ navigation }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationFetched, setLocationFetched] = useState(false);
  const { setOfficeData, setuserLatitude, setuserLongitude } = useContext(CodeContext);
  const [selectedChip, setSelectedChip] = useState('All');
  const [filteredSpaces, setFilteredSpaces] = useState(spaces);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text) => {
    setSearchQuery(text);
    filterSpaces(text);
  };

  const filterSpaces = (text) => {
    const filtered = spaces.filter((space) => {
      return (
        space.name.toLowerCase().includes(text.toLowerCase()) ||
        space.owner.toLowerCase().includes(text.toLowerCase()) ||
        space.price.toLowerCase().includes(text.toLowerCase()) ||
        space.rating.toString().includes(text)
      );
    });
    setFilteredSpaces(filtered);
  };

  const handleChipPress = (chip) => {
    setSelectedChip(chip);
  };

  const handleOfficeClick = (item) => {
    setOfficeData(item);
    navigation.navigate('OfficeDetail');
  };

  const renderSpaceItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleOfficeClick(item)}>
      <View style={styles.spaceItem}>
        <Image source={{ uri: item.images[0] }} style={styles.image} />
        <View style={styles.spaceInfo}>
          <Text style={styles.spaceName}>{item.name}</Text>
          <Text style={styles.spaceOwner}>Owner: {item.owner}</Text>
          <Text style={styles.spacePrice}>Price: {item.price}</Text>
          <Text style={styles.spaceRating}>Rating: {item.rating}
            <Text style={{ color: '#8395a7' }}> ({item.reviews})</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );



  const fetchLocationData = (lat, lon) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`)
      .then(response => response.json())
      .then(data => {
        const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;
        const country = data.address.country;
        setCity(city);
        setCountry(country);
        setLocationFetched(true);
      })
    
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (info) => {
        setLatitude(info.coords.latitude);
        setLongitude(info.coords.longitude);
        setuserLatitude(info.coords.latitude);
        setuserLongitude(info.coords.longitude);
        fetchLocationData(info.coords.latitude, info.coords.longitude);
      },
      (error) => {
        if (!locationFetched) {
          setErrorMessage("Turn on your location just once for sometime!");
          setModalVisible(true);
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const requestLocationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (result === 'granted') {
      getLocation();
    } else if (result === 'denied') {
      setErrorMessage('Location permission denied. Please enable location services.');
      setModalVisible(true);
    } else if (result === 'blocked') {
      setErrorMessage('Location permission blocked. Please enable location services from settings.');
      setModalVisible(true);
    }
  };

  useEffect(() => {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then((result) => {
        if (result === 'granted') {
          getLocation();
        } else {
          requestLocationPermission();
        }
      })
     

    const interval = setInterval(() => {
      if (!locationFetched) {
        getLocation();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [locationFetched, latitude, longitude]);

  useEffect(() => {
    let filtered = spaces;

    if (selectedChip === 'Latest') {
      filtered = spaces.slice(0, 6);
    } else if (selectedChip === 'Most Popular') {
      filtered = spaces.filter(space => space.rating > 4.5);
    } else if (selectedChip === 'Cheapest') {
      filtered = spaces.filter(space => parseInt(space.price.replace(' PKR/month', '').replace(',', '')) < 15000);
    }

    setFilteredSpaces(filtered);
  }, [selectedChip]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 10, marginBottom: 60 }}>
      <View style={{ backgroundColor: '#ced6e0', padding: 10, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          <Icon name="location-pin" size={20} color="black" />
          <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 13 }}>{city ? `${city}, ${country}` : 'Loading location...'}</Text>
        </View>
        <Icon2 name="notifications-none" size={20} color="black" />
      </View>
      <View style={{ borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 20, borderColor: '#8395a7', paddingHorizontal: 10 }}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flex: 1 }}>
          <Icon2 name="search" size={24} color="#8395a7" />
          <TextInput style={{ fontFamily: 'Outfit-Medium', color: '#8395a7', flex: 1, fontSize: 14, marginLeft: 8 }} placeholder='Search working space...' onChangeText={handleSearch} value={searchQuery}></TextInput>
        </View>
        <Icon3 name="sliders" size={18} color="#8395a7" />
      </View>
      <View style={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 22 }}>Recommended Space</Text>
        <Icon2 name="local-fire-department" size={26} color="#ff9f43" />
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.chip, selectedChip === 'All' && styles.selectedChip]}
          onPress={() => handleChipPress('All')}
        >
          <Text style={[styles.chipText, selectedChip === 'All' && styles.selectedChipText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, selectedChip === 'Latest' && styles.selectedChip]}
          onPress={() => handleChipPress('Latest')}
        >
          <Text style={[styles.chipText, selectedChip === 'Latest' && styles.selectedChipText]}>Latest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, selectedChip === 'Most Popular' && styles.selectedChip]}
          onPress={() => handleChipPress('Most Popular')}
        >
          <Text style={[styles.chipText, selectedChip === 'Most Popular' && styles.selectedChipText]}>Most Popular</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, selectedChip === 'Cheapest' && styles.selectedChip]}
          onPress={() => handleChipPress('Cheapest')}
        >
          <Text style={[styles.chipText, selectedChip === 'Cheapest' && styles.selectedChipText]}>Cheapest</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredSpaces}
        renderItem={renderSpaceItem}
        keyExtractor={(item) => item.name}
        style={styles.list}
      />
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={{ padding: 8, backgroundColor: '#EE5A24', borderRadius: 6, paddingHorizontal: 16 }} onPress={() => setModalVisible(false)} >
              <Text style={{ color: 'white', fontFamily: 'Outfit-Bold', fontSize: 15 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    fontFamily: 'Outfit-Bold',
  },
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    padding: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    borderColor: '#8395a7',
  },
  selectedChip: {
    borderColor: '#EE5A24',
    backgroundColor: '#EE5A24',
  },
  chipText: {
    fontFamily: 'Outfit-Light',
    color: 'black',
  },
  selectedChipText: {
    color: 'white',
  },
});

export default UserScreen;
