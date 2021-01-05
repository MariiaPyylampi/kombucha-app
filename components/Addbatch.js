import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform, Switch} from 'react-native';
import { Button, Input, Divider } from 'react-native-elements';
import BlankSpacer from "react-native-blank-spacer";
import DateTimePicker from '@react-native-community/datetimepicker';
/* import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'; */
import * as Calendar from 'expo-calendar';
import firebase from './firebase';

export default function Addbatch({ route, navigation }) {
  const [name, setName] = useState('');
  const [startdate, setStartdate] = useState(new Date());
  const [reminder, setReminder] = useState(false);
  const [water, setWater] = useState('');
  const [tea, setTea] = useState('');
  const [sugar, setSugar] = useState('');
  const [isEnabled, setIsEnabled] = useState(false); //reminder switch

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || startdate;
    console.log(currentDate)
    setStartdate(currentDate);
  }

  //reminder switch
  const toggleSwitch = async () => {
    const { status } = await Calendar.getCalendarPermissionsAsync()
      if (status !== 'granted') {
        console.log(status)
        alert('You have not enabled this app to use calendar. You need to grant permission to set reminder!')
      } else {
        const { status } = await Calendar.getRemindersPermissionsAsync()
        if(status !== 'granted') {
          alert('You have not enabled this app to use reminders. You need to grant permission to set reminder!')
        } else {
          console.log('switch calendar and reminder granted')
          setReminder(!reminder)
          setIsEnabled(previousState => !previousState)
        }
      }
  }

  const handleSave = async () => {
    let date = new Date(startdate).toDateString() 
    let newBatch = firebase.database().ref('batches/').push()
    newBatch.set({
      name: name, 
      startdate: date,
      reminder: '',
      enddate: '',
      water: water,
      tea: tea,
      sugar: sugar,
      isFavorite: false,
      isCompleted: false,
      flavors: '',
      key: newBatch.key
      })

    if(reminder === true) {
      makeReminder(newBatch.key)
    } else {
      navigation.navigate('Active')
    }
  }

  const makeReminder = async (key) => {
    try {
      const alarmtime = new Date(startdate) 
      alarmtime.setDate(alarmtime.getDate () + 2 * 7) //alarm to two weeks from start day
      alarmtime.setHours(9,0) //set alarm time 9 am
      const id = await Calendar.createReminderAsync(
        null, //device default calendar
        { 
          title: `Your ${name} kombucha is ready to be flavored!`,
          alarms: [{absoluteDate: alarmtime}]
        });
        
      console.log('reminder', id)

      //update reminder id to database
      let ref = firebase.database().ref('batches/' + key)
    
      ref.update({
        reminder: id
      })
    }  
    catch (error){
      console.log(error)
    }

    navigation.navigate('Active')
  }

  /* const addImage = async () => {
    try {
      //ask permission to use camera
      let { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') { 
        console.log('No permission to use camera') //if camera not allowed
      } else {
        console.log('Allowed to use Camera') //if camera is allowed
        let result = await ImagePicker.launchCameraAsync();   //take a picture
        if (result.cancelled) {
          console.log('cancelled')  //if picture not taken
        } else {
          console.log('picture taken', result.uri)  //if picture taken -> file location in uri

          uploadImage(result.uri)
          .then(() => {
            console.log('saved to firebase storage')
          })
          .catch((error) => {
            console.log(error)
          })
        }
      }
    }
    catch (error) {
    console.log('error', error)
    }
  }

  const uploadImage = async (uri) => {
    console.log('uri', uri, 'name', name)
  
    const response = await fetch(uri)   //fetch the image and change it to blob
    const blob = await response.blob()
   
    let ref = firebase.storage().ref("images/" + name)  //make the ref and put image there
    return ref.put(blob)
  } */
 
  return (
    <KeyboardAvoidingView 
      enabled behavior={Platform.OS === 'ios'? 'padding': 'height'} 
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.container}>
          <StatusBar style="dark" />
          <View style={styles.containerInner}>
            <Input
              label='name'
              labelStyle={styles.inputLabel}
              placeholder='name'
              value={name} 
              onChangeText={name => setName(name)}
            />
            <Text style={styles.label}>1st fermentation started on</Text>
            <DateTimePicker
              style={{height: 100, marginHorizontal: 16}}
              value={startdate}
              onChange={onChange}
            />
             <Divider style={styles.divider} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>reminder, 2 weeks</Text>
              <Switch
                  style={{ marginHorizontal: 15}}
                  trackColor={{ false: '#767577', true: '#ffb51b' }}
                  thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
            </View>
            <Divider style={styles.divider} />
            <Input 
              label='ingredients'
              labelStyle={styles.inputLabel}
              placeholder='water'        t
              value={water} 
              onChangeText={water => setWater(water)}
            />
            <Input
              placeholder='tea'   
              labelStyle={styles.inputLabel}     
              value={tea} 
              onChangeText={tea => setTea(tea)}
            />
            <Input
              placeholder='sugar'  
              labelStyle={styles.inputLabel}      
              value={sugar} 
              onChangeText={sugar => setSugar(sugar)}
            />
           {/*  <Button
              buttonStyle={styles.button}
              title='Add image'
              onPress={() => addImage()}           
            /> */}
            <Button
              buttonStyle={styles.button}
              title='Start'
              onPress={() => handleSave()}           
            />
            <BlankSpacer height={50} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  h1: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingVertical: 6,
    color: '#383838'
  },
  containerInner: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 30
  },
  button: {
    backgroundColor: '#ffb51b',
    width: 200, 
    borderRadius: 4
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: -9,
    marginVertical: 13,
    color: 'grey',
  }, 
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 15,
    color: 'grey',
  },
  divider: {
    height: 1.5,
    marginHorizontal: 12,
    marginVertical: 17,
    color: 'grey',
  },
  text: {
    fontSize: 18,
    marginHorizontal: 12,
    marginTop: 10,
    color: 'grey',
  }
});

