import { useContext } from "react";
import { StyleSheet, View, Text, Button } from 'react-native';
import { AuthContext } from "../../context/AuthContext";


export function SignIn() {
  const { signIn } = useContext(AuthContext);

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