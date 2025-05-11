import { Assets as NavigationAssets } from '@react-navigation/elements';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { RootStack } from './navigation';
import { NavigationContainer } from '@react-navigation/native';
import { NotFound } from './navigation/screens/NotFound';
import { AuthProvider } from './hooks/useAuth'

Asset.loadAsync([
  ...NavigationAssets,
  require('./assets/newspaper.png'),
  require('./assets/bell.png'),
]);

SplashScreen.preventAutoHideAsync();

export function App() {
  return (
    <AuthProvider>
      <NavigationContainer
        linking={{
          enabled: true,
          prefixes: [
            // Change the scheme to match your app's scheme defined in app.json
            'rnexpooauth://',
          ],
          config: {
            screens: {
              NotFound: '*'
            }
          }
        }}
        onReady={() => {
          SplashScreen.hideAsync();
        }}
      >
        <RootStack />
      </NavigationContainer>
    </AuthProvider>
  );
}
