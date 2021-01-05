import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from './firebase';

export default function Favorites({ navigation }) {
  const [kombuchaData, setKombuchaData] = useState([]);

  useEffect(() => {
    firebase.database().ref('batches/').on('value', snapshot => {
      if(snapshot.val() !== null) {
        const data = snapshot.val()
        const batches = Object.values(data)
        setKombuchaData(batches)
      } else {
        setKombuchaData('')
      } 
    })
  }, [])

  const renderItem = ({ item }) => {
    if(item.isFavorite === true)
    return (
      <ListItem 
        key={item.key} 
        bottomDivider
        onPress={() => navigation.navigate('Batch', { item })}
      >
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>    
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.containerInner}>
        <Text style={styles.h1}>Favorite batches</Text>
        <FlatList 
          style={{width: '100%'}}
          data={kombuchaData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key} 
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