import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import firebase from './firebase';

export default function Active({ navigation }) {
  const [kombuchaData, setKombuchaData] = useState([]);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    firebase.database().ref('batches/').on('value', snapshot => {
      if(snapshot.exists()) {
        const data = snapshot.val()
        const batches = Object.values(data)
        setKombuchaData(batches)
        setMessage('')
      } else {
        setKombuchaData('')
        setMessage('Nothing here, add a new batch!')
      } 
    })
  }, [])
   
  const renderItem = ({ item }) => {
    if(!item.isCompleted)
    return (
      <ListItem 
        key={item.key} 
        bottomDivider
        onPress={() => navigation.navigate('Batch', { item })}
      >
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
          <ListItem.Subtitle>Started on {item.startdate}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>    
    )
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.containerInner}>
        <Text style={styles.h1}>Active batches</Text>
        <Text>{message}</Text>
        <FlatList 
          style={{width: '100%'}}
          data={kombuchaData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key} 
        />
        <Button
          buttonStyle={styles.button}
          title='Start new batch'
          onPress={() => navigation.navigate('Start batch')}           
        />
      </View>
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
    width: 200, 
    borderRadius: 4
  }
});

