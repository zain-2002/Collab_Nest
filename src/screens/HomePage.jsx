import React, { useEffect, useState } from 'react'
import {  Text, TouchableOpacity, View } from 'react-native'
import Slider from '../components/AppSlider'
import auth from '@react-native-firebase/auth';

const HomePage = ({navigation}) => {
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
  }

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        navigation.navigate('BottomTabs');
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe(); // Clean up the subscription
  }, [navigation]);

  return (
    <View style={{flex:1}}>
    
<Slider/>
<View style={{flex:.17,paddingHorizontal:18,}}>
<TouchableOpacity style={{backgroundColor:'#EE5A24',padding:10,borderRadius:20,alignItems:'center',justifyContent:'center'}} onPress={()=>navigation.navigate('CreateAccount')}>
    <Text style={{color:'white',alignSelf:'center',fontSize:18,fontWeight:500,fontFamily:'Outfit-SemiBold'}}>Create Account</Text>
</TouchableOpacity>
<View style={{display:'flex',flexDirection:'row',justifyContent:'center',marginTop:14}}>
<TouchableOpacity onPress={()=>navigation.navigate('LoginScreen')}>
<Text style={{color:'#EE5A24',fontSize:16,fontFamily:'Outfit-SemiBold'}}>Already Have an Account?</Text>

</TouchableOpacity>

</View>
        </View>
    
    
    </View>
  )
}

export default HomePage