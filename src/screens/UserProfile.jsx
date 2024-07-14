import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, StyleSheet, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';

import Icon from 'react-native-vector-icons/MaterialIcons';


const UserProfile = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth().currentUser;
    setUser(currentUser);

    // Fetch the image URL from Firestore



  }, []);

  const handleLogout = () => {
    auth().signOut()
    navigation.navigate('Intro')
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name='arrow-back' size={35} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Your Profile</Text>
      </View>
      
      <View style={styles.profileContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D' }}
            style={styles.profileImage}
          />
      
        </View>
        {user?.displayName && <Text style={styles.displayName}>{user.displayName}</Text>}
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const { height } = Dimensions.get('window');
const profileImageSize = height * 0.25;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    marginBottom: 60,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 4,
    padding: 10,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Outfit-Bold',
    fontSize: 21,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: profileImageSize,
    height: profileImageSize,
    borderRadius: profileImageSize / 2,
    borderWidth: 3,
    borderColor: '#000',
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
  },
  displayName: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
  },
  logoutButton: {
    backgroundColor: '#EE5A24',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
  },
});

export default UserProfile;
