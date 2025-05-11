import { useContext } from 'react';
import { Button as NavigationButton, Text } from '@react-navigation/elements';
import { StyleSheet, View, Button } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export function Home() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text>Open up 'src/App.tsx' to start working on your app!</Text>
      <NavigationButton screen="Profile" params={{ user: 'jane' }}>
        Go to Profile
      </NavigationButton>
      <NavigationButton screen="Settings">Go to Settings</NavigationButton>
      <Button onPress={signOut} title="Sair" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
