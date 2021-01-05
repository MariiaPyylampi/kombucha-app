import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Input } from 'react-native-elements';
import BlankSpacer from "react-native-blank-spacer";
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from './firebase';

export default function Addbatch({ route, navigation }) {
  const batch = route.params.batch
  const [name, setName] = useState(batch.name);
  const [newname, setNewname] = useState(batch.name)
  const [startdate, setStartdate] = useState(new Date(batch.startdate));
  const [enddate, setEnddate] = useState(!batch.enddate ? new Date() : new Date(batch.enddate));
  const [water, setWater] = useState(batch.water);
  const [tea, setTea] = useState(batch.tea);
  const [sugar, setSugar] = useState(batch.sugar);
  const [flavors, setFlavors] = useState(batch.flavors);
  const [visible, setVisible] = useState(false);

  const handleSave = () => {
    let start = new Date(startdate).toDateString() 
    let end = !visible ? null : new Date(enddate).toDateString() 
    let ref = firebase.database().ref('batches/' + batch.key)
    
    ref.update({
      name: newname, 
      startdate: start,
      water: water,
      tea: tea,
      sugar: sugar,
      enddate: end,
      flavors: flavors
    })

    let item = {
      name: newname, 
      startdate: start,
      reminder: batch.reminder,
      water: water,
      tea: tea,
      sugar: sugar,
      enddate: end,
      flavors: flavors,
      isCompleted: batch.isCompleted,
      isFavorite: batch.isFavorite,
      key: batch.key
    }

    navigation.navigate('Batch', { item })
  }
 
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || startdate;
    setStartdate(currentDate);
  }

  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || enddate;
    setEnddate(currentDate);   
  }

  return (
    <KeyboardAvoidingView  
      enabled behavior={ Platform.OS === 'ios'? 'padding': 'height'}  
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.container}>
          <StatusBar style="dark" />
          <View style={styles.containerInner}>
            <Input
              label='name'
              labelStyle={styles.inputLabel}
              placeholder={name} 
              value={newname} 
              onChangeText={newname => setNewname(newname)}
            />
            <Text style={styles.label}>1st fermentation started on</Text>
            <DateTimePicker
              value={startdate}
              style={{height: 100}}
              onChange={onChange}
            />
            <Text style={styles.label}>1st fermentation ended on</Text>
            <Button
              type='clear'
              title={!visible ? 'select a date' : 'set empty'}
              onPress={() => setVisible(!visible)}           
            />
            {visible && (
              <DateTimePicker
              value={enddate}
              style={{height: 100}}
              onChange={onChangeEnd}
              /> 
            )}
            <Input 
              label='ingredients'
              labelStyle={styles.inputLabel}
              placeholder='water'        
              value={water} 
              onChangeText={water => setWater(water)}
            />
            <Input
              placeholder='tea'        
              value={tea} 
              onChangeText={tea => setTea(tea)}
            />
            <Input
              placeholder='sugar'        
              value={sugar} 
              onChangeText={sugar => setSugar(sugar)}
            /> 
            <Input
              label='2nd fermentation'
              labelStyle={styles.inputLabel}
              placeholder='flavors'        
              value={flavors} 
              onChangeText={flavors => setFlavors(flavors)}
            /> 
            <Button
              buttonStyle={styles.button}
              title='Save'
              onPress={handleSave}           
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
    borderRadius: 4,
    margin: 5
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
  }
});

