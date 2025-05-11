import { StyleSheet, View, Text, Button } from 'react-native';
import { useAuth } from "../../hooks/useAuth";


export function SignIn() {
  const { signIn } = useAuth();

  return (
    <View style={styles.container}>
      <Text>SignIn Screen</Text>
      <Button onPress={signIn} title="SignIn" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});