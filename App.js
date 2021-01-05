import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from './components/Home';
import Active from './components/Active';
import Completed from './components/Completed';
import Favorites from './components/Favorites';
import Recipes from './components/Recipes';
import Batch from './components/Batch';
import Addbatch from './components/Addbatch';
import EditBatch from './components/EditBatch';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'ios-home';
            color = focused ? '#ffb51b' : '#383838';
          } else if (route.name === 'Active') {
            iconName = 'ios-hourglass';
            color = focused ? '#ffb51b' : '#383838';
          } else if (route.name === 'Completed') {
            iconName = 'ios-checkbox'
            color = focused ? '#ffb51b' : '#383838';
          } else if (route.name === 'Favorites') {
            iconName = 'ios-heart'
            color = focused ? '#ffb51b' : '#383838';
          } else if (route.name === 'Recipes') {
            iconName = 'ios-search'
            color = focused ? '#ffb51b' : '#383838';
        }
          return <Ionicons name={iconName} size={30} color={color} />;
        }
      })}
      tabBarOptions={{
        activeTintColor: '#ffb51b',
        inactiveTintColor: '#383838',
      }}
    >
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Active' component={Active} />
      <Tab.Screen name='Completed' component={Completed} />
      <Tab.Screen name='Favorites' component={Favorites} />
      <Tab.Screen name='Recipes' component={Recipes} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="Active" component={HomeTabs} />
        <Stack.Screen name="Start batch" component={Addbatch} />
        <Stack.Screen name="Batch" component={Batch} />
        <Stack.Screen name="EditBatch" component={EditBatch} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
