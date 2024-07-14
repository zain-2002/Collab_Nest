import React, { useState,useRef,useEffect, useContext } from 'react'
import { Text, View,StyleSheet,TextInput,TouchableOpacity ,Modal } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { CodeContext } from '../components/CodeConfirmContext';
import auth from '@react-native-firebase/auth';

const Verification = () => {
 
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
const [isDisable, setisDisable] = useState(true)
const [counter, setcounter] = useState(90)
const {value,phoneNo}=useContext(CodeContext)
const [errorMessage, setErrorMessage] = useState('');
const [isModalVisible, setModalVisible] = useState(false);
  const handleInputChange = async (text, index) => {
    let newCode = [...code];
  
    if (text.length === 6) {
      newCode = text.split('');
      inputRefs.current[index].blur();
    } else {
      newCode[index] = text;
    }
  
    if (index === code.length - 1 && text.length === 2) {
      return;
    }
  
    if (text.length === 1 && index < code.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  
    setCode(newCode);
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        inputRefs.current[index - 1].focus();
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

const handleVerification=async()=>{
  try {
    await value.confirm(code.join(""));
  } catch (error) {
    setErrorMessage('Invalid code!')
    setModalVisible(true)
  }
 
}
const handleResendClick=async()=>{
  try {
    setCode(['', '', '', '', '', ''])
    inputRefs.current[0].focus();
    await auth().signInWithPhoneNumber(phoneNo);
  } catch (error) {
    setErrorMessage(error.message);
    setModalVisible(true);
  }
}
  useEffect(() => {
    inputRefs.current[0].focus();
 
  }, []);
  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setcounter((prevCounter) => prevCounter - 1);
      }, 1000);

      return () => clearInterval(timer);
    } 
    if (counter==0) {
      setisDisable(false)
    }
   
  }, [counter]);

  return (
    <View style={{flex:1}}>
<View style={{width:'100%',justifyContent:'center',alignItems:'center',padding:18,borderBottomColor:'lightgrey',backgroundColor:'#f5f6fa',borderBottomWidth:1,shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 7,
},
shadowOpacity: 0.43,
shadowRadius: 9.51,

elevation: 15}}>

        <Text style={{fontFamily:'Outfit-SemiBold',padding:4,fontSize:22,backgroundColor:'transparent'}}>Verification</Text>
</View>
<View style={{flex:1,justifyContent:'center',alignItems:"center",gap:21}}>
<View style={styles.outerCircle}>
  <View style={styles.circle}>

<Icon name='mail-lock' size={58} color="white"/>
  </View>
  </View>
  <View style={{display:"flex",gap:10,justifyContent:'center',alignItems:'center'}}>

<Text style={{fontSize:22,fontFamily:'Outfit-Bold'}}>Verification Code</Text>
<Text style={{fontSize:16,fontFamily:'Outfit-Light'}}>Verify the code sent to {phoneNo}</Text>
  </View>
 


      <View style={styles.container}>
     
        {code.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.inputBox}
            value={digit}
            onChangeText={(text) => handleInputChange(text, index)}
            // maxLength={1}
            
            keyboardType="number-pad"
            onKeyPress={(e) => handleKeyPress(e, index)}
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </View>
      <TouchableOpacity style={{backgroundColor:'#EE5A24',padding:14,borderRadius:24,alignItems:'center',justifyContent:'center',width:'80%'}} onPress={handleVerification}>
    <Text style={{color:'white',alignSelf:'center',fontSize:18,fontWeight:500,fontFamily:'Outfit-SemiBold'}}>Submit</Text>
</TouchableOpacity>
<View style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:2}}>
<Text style={{alignSelf:'center',fontFamily:'Outfit-Medium',color:'#b2bec3'}}>Did n't recieved the code?
 </Text>
 <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} disabled={isDisable} onPress={handleResendClick}>
 <Text style={{color:isDisable ? 'rgba(238, 90, 36, 0.35)' : "#EE5A24"}}>Resend</Text>
</TouchableOpacity>
{isDisable && <Text style={{ color: '#EE5A24' }}> ({counter}s)</Text>}
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
</View>
</View>
    </View>
  )
}
const styles = StyleSheet.create({

  circle: {
    width: 110, // Adjust the size as needed
    height: 110,
    borderRadius: 55, // Half of the width/height to make it a circle
    backgroundColor: '#EE5A24', // Circle color
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    width: 140, // Adjust the size as needed
    height: 140,
    borderRadius: 70, // Half of the width/height to make it a circle
    backgroundColor: 'rgba(238, 90, 36, 0.2)', // Outer circle color
    justifyContent: 'center',
    alignItems: 'center',
    
  }, container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
 gap:8
 
  },

  inputBox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#EE5A24',
    backgroundColor: 'rgba(238, 90, 36, 0.1)',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    color: '#EE5A24',
  },modalOverlay: {
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
export default Verification