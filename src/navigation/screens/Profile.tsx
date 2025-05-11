import { Text } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';


export function Profile() {
  const { state } = useAuth();

  return (
    <View style={styles.container}>
      <Text>{state.userInfo?.givenName}'s Profile</Text>
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
