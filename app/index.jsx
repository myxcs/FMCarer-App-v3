import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";


export default function Index() {
  return (
    <View style={styles.container} testID="index-view">
      <Text style={styles.text} testID="index-text">Hello world.</Text>
      <Image
        source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        style={{ width: 50, height: 50 }}
        testID="index-image"
      />

    <Link href="/(auth)/signup">Go to signup</Link>
    <Link href="/(auth)">Go to login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "rgb(146, 2, 2)",
  },
});