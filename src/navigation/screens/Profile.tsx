import { Text } from '@react-navigation/elements';
import type { ParamListBase } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

type Params = {
  user: string;
};

export function Profile() {
  const route = useRoute();
  const params = route.params as Params;

  return (
    <View style={styles.container}>
      <Text>{params.user}'s Profile</Text>
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
