import React, { useContext, useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View,SafeAreaView, ScrollView , StyleSheet, Modal} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Octicons';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { CodeContext } from '../components/CodeConfirmContext';
const LoginScreen = ({navigation}) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setemail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const {setValue,setphoneNo}=useContext(CodeContext)
    useEffect(()=>{
      GoogleSignin.configure({
        webClientId: '514436008555-dv7na9rest4pufq1nkq09qg0phlfjanq.apps.googleusercontent.com',
      });

    },[])
    const onGoogleButtonPress=async()=>{
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        await auth().signInWithCredential(googleCredential);
        
      } catch (error) {
        setErrorMessage(error.message);
        setModalVisible(true);
      }
    }
const handleResetPassword=async ()=>{
  if (validateEmail(email)) {
    try {
      await auth().sendPasswordResetEmail(email)
      setErrorMessage('Email has been sent succesfully.');
      setModalVisible(true);
      
    } catch (error) {
      setErrorMessage(error.message);
      setModalVisible(true);
    }
  }
  else{
    setErrorMessage('Enter the valid email!');
    setModalVisible(true);

  }

}
    const handleFacebookAuth=async()=>{
      try {
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
        if (result.isCancelled) {
          setErrorMessage('User cancelled the login process');
          setModalVisible(true);
          return;  
        }
  
        const data = await AccessToken.getCurrentAccessToken();
  
        if (!data) {
          setErrorMessage('Something went wrong obtaining access token');
          setModalVisible(true);
          return; 
        }
  
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
        await auth().signInWithCredential(facebookCredential);

      } catch (error) {
        setErrorMessage(error.message);
        setModalVisible(true);
      }
 
    }
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };
    
    const validatePhoneNumber = (phoneNumber) => {
      const re = /^\+92\d{10}$/;
      return re.test(phoneNumber);
    };
  
    const handleInputChange = (text) => {
      setemail(text);
      setErrorMessage('');
    };
  
  
  
  const AddUser=async()=>{
    if (!email||!password) {
      setErrorMessage('Please fill all fields first');
      setModalVisible(true);
    
    }
  else{
   if (password.length<6) {
    setErrorMessage('Password length should be greater than 5 characters');
    setModalVisible(true);
   }
    if (validateEmail(email)) {
        try {
            const user = await auth().signInWithEmailAndPassword(email, password);
        navigation.navigate('BottomTabs')

          } catch (error) {
            setErrorMessage(error.message);
            setModalVisible(true);
          }
 
    } else if (validatePhoneNumber(email) && password) {
      try {
        const confirmation = await auth().signInWithPhoneNumber(email);
        if (confirmation) {
          setValue(confirmation)
          setphoneNo(email)
          navigation.navigate('Verification');
        }
      } catch (error) {
        setErrorMessage(error.message);
        setModalVisible(true);
      }
    } else {
      setErrorMessage('Please enter a valid email or phone number in the format +923XXXXXXXXX');
      setModalVisible(true);
    }
  }
 
   
  
  }
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };
    return (
      <SafeAreaView style={{flex:1,paddingVertical:10,paddingHorizontal:16}}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}  contentContainerStyle={{justifyContent:'center',alignItems:'center'}}>
  
       
  <Text style={{fontSize:24,fontFamily:'Outfit-SemiBold'}}>Login Account</Text>
  <Text style={{fontSize:14,color:'#b2bec3',fontFamily:'Outfit-Light'}}>Please Login with registered account.</Text>
  <View style={{flex:1,marginVertical:20}}>
 
  <Text style={{fontSize:20,fontFamily:'Outfit-SemiBold',marginTop:16}}>Email or Phone Number</Text>
  <View style={{width:'96%',backgroundColor:'#f5f6fa',padding:8,paddingHorizontal:12,borderRadius:8,marginVertical:8,shadowColor: "#000",
  shadowOffset: {
      width: 0,
      height: 7,
  },
  shadowOpacity: 0.43,
  shadowRadius: 9.51,
  
  elevation: 15,display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:8}}>
    
    <Icon2 name="mail" size={25} color="#b2bec3" />
  <TextInput style={{backgroundColor:'transparent',flex:1,fontSize:14,marginTop:4}} placeholder='Enter Email or Phone No:+92xxxx' inputMode='email' value={email} onChangeText={handleInputChange}></TextInput>
  
  </View>
  <Text style={{fontSize:20,fontFamily:'Outfit-SemiBold'}}>Password </Text>
  <View style={{backgroundColor:'#f5f6fa',padding:8,paddingHorizontal:12,borderRadius:8,marginVertical:8,shadowColor: "#000",
  shadowOffset: {
      width: 0,
      height: 7,
  },
  shadowOpacity: 0.43,
  shadowRadius: 9.51,
  
  elevation: 15,display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:10}}>
    
    <Icon2 name="lock" size={27} color="#b2bec3" />
  <TextInput style={{backgroundColor:'transparent',flex:1,fontSize:14,marginTop:4}} inputMode='text' placeholder='Create Your Password' textContentType='password' secureTextEntry={!passwordVisible}  value={password}
          onChangeText={setPassword}></TextInput>
  <TouchableOpacity style={{marginRight:16}} onPress={togglePasswordVisibility}>
  
  <Icon2 name={passwordVisible ? 'eye' : 'eye-closed'}  size={27} color="#b2bec3" />
  </TouchableOpacity>
  </View>
  <TouchableOpacity style={{alignSelf:'flex-end',marginBottom:12,marginTop:4}} onPress={handleResetPassword}>

  <Text style={{fontFamily:'Outfit-Bold',color:'#EE5A24',fontSize:15,paddingRight:6}}>Forgot Password?</Text>
  </TouchableOpacity>
  <View style={{marginVertical:14,display:'flex',gap:14}}>
  
  <TouchableOpacity style={{backgroundColor:'#EE5A24',padding:10,borderRadius:20,alignItems:'center',justifyContent:'center'}} onPress={AddUser}>
      <Text style={{color:'white',alignSelf:'center',fontSize:18,fontWeight:500,fontFamily:'Outfit-SemiBold'}}>Sign In</Text>
  </TouchableOpacity>
  <Text style={{alignSelf:'center',fontFamily:'Outfit-Medium',color:'#b2bec3'}}>Or using other method</Text>
  
  <TouchableOpacity style={{backgroundColor:'#f5f6fa',padding:14,borderRadius:22,display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:8,shadowColor: "#000",
  shadowOffset: {
      width: 0,
      height: 7,
  },
  shadowOpacity: 0.43,
  shadowRadius: 9.51,
  
  elevation: 15}} onPress={onGoogleButtonPress}>
    <Icon name='google' size={24} />
    <Text style={{alignSelf:'center',fontFamily:'Outfit-Black'}}>Sign In with Google</Text>
  </TouchableOpacity>
  <TouchableOpacity style={{backgroundColor:'#f5f6fa',padding:14,borderRadius:22,display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:8,shadowColor: "#000",
  shadowOffset: {
      width: 0,
      height: 7,
  },
  shadowOpacity: 0.43,
  shadowRadius: 9.51,
  
  elevation: 15}} onPress={handleFacebookAuth}>
    <Icon name='facebook-square' size={24}  />
    <Text style={{alignSelf:'center',fontFamily:'Outfit-Black' }}>Sign In with Facebook</Text>
  </TouchableOpacity>
  
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
    
  
  </ScrollView>
      </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
    textInput: {
      backgroundColor: 'transparent',
      flex: 1,
      height: 39,
      fontSize: 14,
      marginTop: 4,
      borderBottomWidth: 1,
      borderColor: '#ccc',
      marginBottom: 16,
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
    },
  });
export default LoginScreen