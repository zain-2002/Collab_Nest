import React, { useState, useEffect, useRef } from 'react';
import { Image, Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const slides=[{
  image:require('../lib/img1.png'),
  text:'Start to find a suitable place to work',
  desc:'Free delivery for new customers via credit card and other payment method'
},
{
  image:require('../lib/img2.png'),
  text:'Flexible to book a place from anywhere',
  desc:'Free delivery for new customers via credit card and other payment method'
},
{
  image:require('../lib/img3.png'),
  text:'Find a comfortable work place around you',
  desc:'Free delivery for new customers via credit card and other payment method'
}
]
function Slider(){
  const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
         
            const nextSlide = (currentSlide + 1) % slides.length;
            setCurrentSlide(nextSlide);
           
            sliderRef.current.goToSlide(nextSlide);
        }, 4400);

        return () => clearInterval(interval);
    }, [currentSlide]);

  return(
    <View style={{flex:1}}>
      <AppIntroSlider renderItem={({item})=>
      <View style={{flex:1}}>
    <View style={{flex:.63,overflow:'hidden'}}>
     <Image source={item.image} style={{width:'100%',}}/>
    </View>
    <View style={{flex:.34,padding:12,paddingLeft:18,}}>
        <View style={{display:'flex',flexDirection:'row'}}>
        <Text style={{fontSize:20,fontWeight:500,color:'black',fontFamily:'Outfit-Medium'}}>Co</Text><Text style={{fontSize:20,fontWeight:500,color:'orange',fontFamily:'Outfit-Medium'}}>Space.</Text>
        </View>
   <Text style={{fontSize:27,fontWeight:'600',marginTop:6,lineHeight:32,fontFamily:'Outfit-SemiBold'}}>{item.text}</Text>
   <Text style={{color:'#b2bec3',marginTop:6,lineHeight:19,fontFamily:'Outfit-Medium'}}>{item.desc}</Text>
   </View>
        </View>
      } ref={sliderRef} data={slides}  activeDotStyle={{backgroundColor:'#EE5A24',borderRadius:20,width:20}}  dotStyle={{backgroundColor:'#D9D9D9',borderRadius:20,width:20}} showNextButton={false}  showDoneButton={false} showPrevButton={false} 
     />
    </View>
  )
}
export default Slider