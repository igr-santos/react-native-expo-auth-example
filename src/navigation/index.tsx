import { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { HeaderButton, Text } from '@react-navigation/elements';
// import {
//   createStaticNavigation,
//   StaticParamList,
// } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import bell from '../assets/bell.png';
import newspaper from '../assets/newspaper.png';
import { Home } from './screens/Home';
import { Profile } from './screens/Profile';
import { Settings } from './screens/Settings';
import { Updates } from './screens/Updates';
import { NotFound } from './screens/NotFound';
import { SignIn } from './screens/SignIn';
import { useAuth } from '../hooks/useAuth'


const Tabs = createBottomTabNavigator();

const HomeTabOptions = {
  title: "Feed",
  tabBarIcon: ({ color, size }: any) => (
    <Image
      source={newspaper}
      tintColor={color}
      style={{
        width: size,
        height: size,
      }}
    />
  )
}

const UpdatesTabOptions = {
  tabBarIcon: ({ color, size }: any) => (
    <Image
      source={bell}
      tintColor={color}
      style={{
        width: size,
        height: size,
      }}
    />
  ),
}

function HomeTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={Home} options={HomeTabOptions} />
      <Tabs.Screen name="Updates" component={Updates} options={UpdatesTabOptions} />
    </Tabs.Navigator>
  )
}

const Stack = createNativeStackNavigator();

export function RootStack() {
  const { state } = useAuth();

  return (
    <Stack.Navigator initialRouteName={state.isSignedIn ? "HomeTabs" : "SignIn"}>
      {state.isSignedIn ? (
        <>
          <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ title: "Home", headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Settings" component={Settings} />
        </>
      ) : (
        <Stack.Screen name="SignIn" component={SignIn} options={{ animationTypeForReplace: 'pop' }} />
      )}
      <Stack.Screen name="NotFound" component={NotFound} options={{ title: "404" }} />
    </Stack.Navigator>
  )
}
