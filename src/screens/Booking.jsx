import React, { useContext, useRef, useState } from 'react'
import { Modal, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import CalenderIcon from 'react-native-vector-icons/Ionicons';

import More_time from 'react-native-vector-icons/MaterialIcons';

import { CodeContext } from '../components/CodeConfirmContext';
import DatePicker from 'react-native-date-picker'
import PaymentScreen from './PaymentScreen';

const Booking = ({navigation}) => {
    const {officeData,daysBook, setDaysBook,dateSelected, setDateSelected} = useContext(CodeContext)
    const daySelector = useRef()

    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);



    const formatDate = (date) => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    }

    return (
        <ScrollView style={{flex: 1, padding: 18}} contentContainerStyle={{gap: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
            <TouchableOpacity style={{position: 'absolute', left: 4,padding:10} } onPress={()=>navigation.goBack()}>
            <Icon name='arrow-back' size={35} />

                </TouchableOpacity>
                <Text style={{flex: 1, textAlign: 'center', fontFamily: 'Outfit-Bold', fontSize: 21}}>
                    Booking
                </Text>
            </View>
            <Text style={{fontFamily: 'Outfit-SemiBold', fontSize: 20}}>Your Space</Text>

            <View style={styles.spaceItem}>
                <Image source={{ uri: officeData.images[0] }} style={styles.image} />
                <View style={styles.spaceInfo}>
                    <Text style={styles.spaceName}>{officeData.name}</Text>
                    <Text style={styles.spaceOwner}>Owner: {officeData.owner}</Text>
                    <Text style={styles.spacePrice}>Price: {officeData.price}</Text>
                    <Text style={styles.spaceRating}>Rating: {officeData.rating}
                        <Text style={{color: '#8395a7'}}> ({officeData.reviews})</Text>
                    </Text>
                </View>
            </View>
            <Text style={{fontFamily: 'Outfit-SemiBold', fontSize: 20}}>View Location</Text>

            <Image source={require('../lib/Mapimg.png')} style={styles.locationImage} />
            <TouchableOpacity style={{backgroundColor: '#EE5A24', padding: 10, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}} onPress={() => navigation.navigate('Check')}>
                <Text style={{color: 'white', alignSelf: 'center', fontSize: 16, fontWeight: '500', fontFamily: 'Outfit-SemiBold'}}>View Office Location</Text>
            </TouchableOpacity>
            <Text style={{fontFamily: 'Outfit-SemiBold', fontSize: 20, marginTop: 14}}>Booking Information</Text>

            <Text style={{fontFamily: 'Outfit-SemiBold', fontSize: 16}}>Total Days</Text>
            <TouchableOpacity style={{paddingHorizontal: 12, backgroundColor: '#dfe4ea', borderRadius: 14, marginHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 8}} onPress={() => daySelector.current.focus()}>
                <More_time name='more-time' size={24}/>
                <TextInput 
                    ref={daySelector}
                    inputMode='numeric'
                    style={styles.input}
                    placeholder="Booking Days"
                    value={daysBook}
                    onChangeText={setDaysBook}
                />
            </TouchableOpacity>
            <Text style={{fontFamily: 'Outfit-SemiBold', fontSize: 16}}>Date Booking</Text>
            <TouchableOpacity style={{paddingHorizontal: 12, backgroundColor: '#dfe4ea', borderRadius: 14, marginHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 8}} onPress={() => setOpen(true)}>
                <CalenderIcon name='calendar-outline' size={24}/>
                <Text style={{fontFamily: 'Outfit-Regular', fontSize: 16, flex: 1, padding: 10}}>
                    {dateSelected ? dateSelected : 'Booking Dates'}
                </Text>
            </TouchableOpacity>
            <DatePicker
                modal
                open={open}
                date={date}
                minimumDate={new Date()}
                onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                    setDateSelected(formatDate(date))
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
    
  <PaymentScreen daysBook={daysBook} dateSelected={dateSelected}/>
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
        </ScrollView>
    )
}

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
    input: {
        fontFamily: 'Outfit-Regular',
        fontSize: 16,
        flex: 1,
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
    locationImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
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
    fontFamily:'Outfit-Bold'
  }
});

export default Booking
