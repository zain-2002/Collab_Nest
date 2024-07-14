import React, { useContext, useEffect } from 'react'
import { Text, View ,TouchableOpacity} from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CodeContext } from '../components/CodeConfirmContext';


const Check = ({navigation}) => {
  const {officeData,userLatitude,userLongitude}=useContext(CodeContext)

  return (
    <View style={{flex:1,padding:18,gap:8}}>
        <View style={{flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
                <TouchableOpacity style={{position: 'absolute', left: 4,padding:10} } onPress={()=>navigation.goBack()}>
                        <Icon name='arrow-back' size={30} />

                </TouchableOpacity>
                <Text style={{flex: 1, textAlign: 'center', fontFamily: 'Outfit-Bold', fontSize: 21}}>
                    Office Location
                </Text>
            </View>
 <MapView
       provider={PROVIDER_GOOGLE} 
       style={{flex:1,width:'100%'}}
       region={{
         latitude: officeData.location.latitude,
         longitude: officeData.location.longitude,
         latitudeDelta: 0.04,
         longitudeDelta: 0.0121,
       }}
     >
      <Marker coordinate={
        {
          latitude: officeData.location.latitude,
         longitude: officeData.location.longitude,
        }
      }  title="Office" description="your destination" />
       <Marker coordinate={
        {
          latitude: userLatitude,
         longitude: userLongitude,
        }
      } title="User" description="your location"/>


     </MapView>
     
    </View>
  )
}

export default Check