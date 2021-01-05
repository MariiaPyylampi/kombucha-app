import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Linking, Share, ScrollView } from 'react-native';
import { SearchBar, Card, ListItem, Icon} from 'react-native-elements';
import { BlurView } from 'expo-blur';
import { FontAwesome } from '@expo/vector-icons';
import { EDAMAM_APP_KEY } from '@env'

export default function Recipes({ navigation }) {  
  const [recipeData, setRecipeData] = useState([]);
  const [searchString, setSearchStrign] = useState('');
  const [blur, setBlur] = useState(false);
  const [recipe, setRecipe] = useState('');
  const [message, setMessage] = useState('');

  const api_key = EDAMAM_APP_KEY

  const searchRecipes = () => {
    try {
      fetch(`https://api.edamam.com/search?q=${searchString}-kombucha&app_id=0929460c&app_key=${api_key}&to=30`)
      .then(response => response.json())
      .then(data => {
        if(data.count !== 0){
          setRecipeData(data.hits)
          setMessage('')
        } else {
          setRecipeData(null)
          setMessage('Sorry, no recipes found. \n Try e.g. ginger or blueberry.')
        }
       
        
      })
    }
    catch (error) {
      console.log('error', error)
    
    }
  }

  const showRecipe = (item) => {
    setBlur(true)
    setRecipe(item)
  }

  const hideRecipe = () => {
    setBlur(false)
    setRecipe('')
  }

  const onShare = async (recipe) => {
    try {
        const result = await Share.share({
        message: 'Hi Check out this delicious kombucha recipe!',
        url: recipe.recipe.url
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <Card containerStyle={{ paddingHorizontal: 0, paddingVertical: 3, borderWidth: 0, shadowOpacity:0 }}>
        <Card.Image 
          source={{ uri: item.recipe.image }}
          onPress={() => showRecipe(item)} />
        <Text style={styles.text}>{item.recipe.label}</Text>
      </Card>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.containerInner}>
        <Text style={styles.h1}>Search Recipes</Text>
        <SearchBar 
          platform='ios'
          placeholder='search...'
          searchIcon={{ size: 24 }}
          clearIcon={{ size: 24 }}
          value={searchString} 
          onChangeText={searchString => setSearchStrign(searchString)}
          onEndEditing={searchRecipes}
        />
        <Text>{message}</Text>
        <View style={styles.list}>
        <FlatList 
          style={{width: '100%'}}
          data={recipeData}
          renderItem={renderItem}
          keyExtractor={(item) => item.recipe.label} 
        /> 
        </View>
        {blur 
          ? <BlurView intensity={100} tint={'light'} style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}>
              <View style={{alignContent: "flex-start", marginRight: '80%'}}>
              <Icon
                name='ios-arrow-dropleft-circle'
                type='ionicon' 
                color={'#ffb51b'}
                size={40}
                onPress={hideRecipe} 
              />   
              </View>
              <Text style={styles.h1}>{recipe.recipe.label}</Text>
              <Text style={styles.text}>Ingredients</Text>
              <ScrollView style={{marginVertical: 20}}>
                {recipe.recipe.ingredientLines.map((line, index) => (
                  <ListItem key={index} bottomDivider>
                    <Text>
                      {line}
                    </Text>
                  </ListItem>    
                ))}
              </ScrollView>
              <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>  
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <FontAwesome 
                    name='safari'
                    color='#ffb51b'
                    size={40} 
                    onPress={() => Linking.openURL(recipe.recipe.url)}
                  />
                  <Text style={styles.label}>Visit website</Text>
                </View>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <Icon
                    name='md-share'
                    type='ionicon' 
                    color={'#ffb51b'}
                    size={40}
                    onPress={() => onShare(recipe)} 
                  /> 
                  <Text style={styles.label}>Share</Text>
                </View>
              </View>
            </BlurView>
          : null
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerInner: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 30
  },
  list: {
    flex: 1, 
    backgroundColor: '#fff',
    marginHorizontal: -15
  },
  h1: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 10,
    color: '#383838'
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 5,
    color: '#383838'
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
    marginVertical: 10,
    color: 'grey',
  },
  nonBlurredContent: {
    flex:1,
    alignContent:'flex-start',
    justifyContent: 'space-around',
    margin: -20,
    padding: 20
  }
});
