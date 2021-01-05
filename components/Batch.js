import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, Switch} from 'react-native';
import { Button, ButtonGroup, Text, Divider, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import * as Calendar from 'expo-calendar';
import firebase from './firebase';

export default function Addbatch({ route, navigation }) {
  const batch = route.params.item
  const [favorite, setFavorite] = useState(batch.isFavorite) //heartbutton status
  const [complete, setComplete] = useState(batch.isCompleted) //button status
  const [isEnabled, setIsEnabled] = useState(batch.reminder !== '' ? true : false); //switch
  const [reminderId, setReminderId] = useState(batch.reminder)

  const editFavorite = (batch) => {
    setFavorite(!favorite)
    firebase.database().ref('batches/' + batch.key).update({
      'isFavorite': !favorite
    })
  }

  const completeBatch = (batch) => {
    setComplete(!complete)
    firebase.database().ref('batches/' + batch.key).update({
      'isCompleted': !complete
    })
  }

  const deleteBatch = (batch) => {
    if(reminderId !== '') {
      deleteReminder(reminderId) 
    } // delete reminders
    firebase.database().ref('batches/' + batch.key).remove()
    navigation.navigate('Active')
  }
  
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
          setIsEnabled(previousState => !previousState)
          if(!isEnabled) {
            const id = await makeReminder() //make reminder
            firebase.database().ref('batches/' + batch.key).update({ //update reminder id to database
              'reminder': id
            })
            setReminderId(id)
          } else {
            try { 
              await deleteReminder(reminderId) //delete reminder with id
              firebase.database().ref('batches/' + batch.key).update({ //update database
                'reminder': ''
              })
              setReminderId('')
            } catch (error) {
              console.log('failed', error)
            }
          }
        }
      }
  }

  const makeReminder = async () => {
    const alarmtime = new Date(batch.startdate) 
    alarmtime.setDate(alarmtime.getDate () + 2 * 7) //alarm to two weeks from start day
    alarmtime.setHours(9) //alarm 9 am
    const id = await Calendar.createReminderAsync(
      null, //device default calendar
      { 
        title: `Your ${batch.name} kombucha is ready to be flavored!`,
        alarms: [{absoluteDate: alarmtime}]
      });
    return id //return reminder id
  }  

  const deleteReminder = async (id) => {
    await Calendar.deleteReminderAsync(id)
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.containerInner}>
          <View style={{ flexDirection: 'row', alignContent: 'flex-start', justifyContent: 'space-between'}}>  
            <Text style={styles.h1}>{batch.name}</Text>
            <Icon
              name={favorite === true ? 'md-heart' : 'md-heart-empty'}
              type='ionicon' 
              onPress={() => editFavorite(batch)}
              color={favorite === true ? '#ffb51b' : '#383838'}
              size={40}
            />   
          </View>
          <Text style={styles.label}>1st fermentation</Text>
          <Text style={styles.text}>started on, {batch.startdate}</Text>
          <Divider style={styles.divider} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text}>Reminder, 2 weeks
          </Text>
          <Switch
              style={{ marginHorizontal: 15}}
              trackColor={{ false: '#767577', true: '#ffb51b' }}
              thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <Divider style={styles.divider} />
          <Text style={styles.text}>finished on, {batch.enddate ? batch.enddate : null}</Text>
          <Divider style={styles.divider} />
          
          <Text style={styles.label}>ingredients</Text>
          <Text style={styles.text}>water, {batch.water}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.text}>sugar, {batch.sugar}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.text}>tea, {batch.tea}</Text>
          <Divider style={styles.divider} />

          <Text style={styles.label}>2nd fermentation</Text>
          <Text style={styles.text}>flavors, {batch.flavors}</Text>
          <Divider style={styles.divider} />
          <View style={{ flexDirection: 'row', alignContent: 'flex-start', justifyContent: 'space-around', marginVertical: 15}}>  
            <Button
              buttonStyle={styles.button}
              title='Edit'
              onPress={() => navigation.navigate('EditBatch', { batch })}           
            /> 
            <Button
              buttonStyle={styles.deleteButton}
              title='Delete'
              onPress={() => deleteBatch(batch)}           
            />
          </View>
          <Text style={styles.label}>{complete ? 'This batch is ready!' : 'Is this batch ready?'}</Text>
          <Button
            buttonStyle={complete ? styles.button: styles.buttonGrey}
            title={complete ? 'Completed' : 'Complete batch!'}
            onPress={() => completeBatch(batch)}           
          /> 
        </View>
      </ScrollView>
    </View>
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
    width: 150, 
    borderRadius: 4,
    margin: 5
  }, 
  buttonGrey: {
    backgroundColor: 'grey',
    width: 200, 
    borderRadius: 4,
    margin: 5
  }, 
  deleteButton: {
    backgroundColor: 'red',
    width: 150, 
    borderRadius: 4,
    margin: 5
  }, 
  text: {
    fontSize: 17,
    marginHorizontal: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 15,
    color: 'grey',
  }, 
  divider: {
    height: 2,
    marginHorizontal: 12,
    marginVertical: 15,
    color: 'grey',
  }
});

