import { Ionicons } from "@expo/vector-icons"; // Hoặc FontAwesome...
import { StyleSheet, TouchableOpacity, View } from "react-native";



export default function Index() {
  const handlePress = () => {
    console.log("Floating button pressed!");
  };

  return (
    <View style={styles.container}>
      {/* Nội dung màn hình chính */}

      {/* Floating Button */}
      <TouchableOpacity style={styles.fab} onPress={handlePress}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#2196F3",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
