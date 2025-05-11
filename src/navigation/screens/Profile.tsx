import { Text } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';


export function Profile() {
  const { state, hasRole } = useAuth();

  return (
    <View style={styles.container}>
      <Text>{state.userInfo?.givenName} Profile</Text>
      <Text>{hasRole("Manager") ? "Manager" : "Common"}</Text>
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
