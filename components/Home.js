import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, FlatList, SafeAreaView, ImageBackground } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import * as Calendar from 'expo-calendar';
import firebase from './firebase';

export default function Home({ navigation }) {  
  const [kombuchaData, setKombuchaData] = useState([]);
  
  useEffect(() => {
    try{
    firebase.database().ref('batches/').on('value', snapshot => {
      if(snapshot.exists()) {
        const data = snapshot.val()
        const batches = Object.values(data)
        setKombuchaData(batches)
      } else {
        setKombuchaData('')
      } 
    })
    }
    catch(error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync()
      if (status === 'granted') {
        console.log('calendar granted');
        const { status } = await Calendar.requestRemindersPermissionsAsync()
        if(status === 'granted') {
          console.log('reminders granted')
        } else {
          console.log('reminders denied')
        }
      } else {
        console.log('calendar denied')
      }
    })();
  }, []);

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
      <SafeAreaView>
        <StatusBar style="dark" />
      </SafeAreaView>
      <View>
        <ImageBackground
          source={require ('../img/kombucha2.jpeg')}
          style={{ width: '100%', height: 280, justifyContent: 'center', alignItems: 'center'}}
          PlaceholderContent={<ActivityIndicator />}
        >
          <ImageBackground style={{ height: 170, width: 170, backgroundColor: '#ffb51b', borderRadius: '100', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.logo}>KOMBU</Text>
          </ImageBackground>
        </ImageBackground>
      </View>
      <View style={styles.containerInner}>
        <Text style={styles.h1}>Active bacthes</Text>
        <FlatList 
          style={{width: '100%', marginBottom: 10}}
          data={kombuchaData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key} 
        />
        <Button
          buttonStyle={styles.button}
          title='Start new batch'
          onPress={() => navigation.navigate('Active')}           
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  h1: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingVertical: 6,
    color: '#383838'
  },
  logo: {
    fontSize: 38,
    fontWeight: '900',
    paddingVertical: 6,
    color: '#fff',
    letterSpacing: -2
  },
  containerInner: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 20
  },
  button: {
    backgroundColor: '#ffb51b',
    width: 150, 
    borderRadius: 4,
    margin: 5
  }
});
