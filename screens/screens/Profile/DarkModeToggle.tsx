import React from 'react';
import { StyleSheet, Switch, Text, useColorScheme, View } from 'react-native';

export default function DarkModeToggle() {
  const scheme = useColorScheme();
  const [enabled, setEnabled] = React.useState(scheme === 'dark');

  return (
    <View style={styles.row}>
      <Text style={styles.text}>Dark Mode</Text>
      <Switch value={enabled} onValueChange={() => setEnabled((prev) => !prev)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  text: { fontSize: 16 },
});
