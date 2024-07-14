import React, { createContext, useState } from 'react';

export const CodeContext = createContext();

export const CodeContextProvider = ({ children }) => {
  const [value, setValue,] = useState(''); 
  const [phoneNo, setphoneNo,] = useState(''); 
const [officeData,setOfficeData]=useState('')
const [userLatitude,setuserLatitude]=useState('')
const [userLongitude,setuserLongitude]=useState('')
const [daysBook, setDaysBook] = useState('')
const [dateSelected, setDateSelected] = useState('')

  return (
    <CodeContext.Provider value={{ value, setValue,phoneNo,setphoneNo,officeData,setOfficeData,userLongitude,setuserLongitude,userLatitude,setuserLatitude,daysBook, setDaysBook,dateSelected, setDateSelected}}>
      {children}
    </CodeContext.Provider>
  );
};
