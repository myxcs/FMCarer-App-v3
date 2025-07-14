import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PostIndex() {
  const router = useRouter();
  const [visibility, setVisibility] = useState("Gia đình");

  const handleCreatePost = () => {
    router.push("/(tabs)/post/create");
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.title}>Bài đăng</Text>
        <View style={{ width: 24 }} />
      </View>


      <TouchableOpacity style={styles.inputBox} onPress={handleCreatePost} activeOpacity={0.8}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.avatar}
        />
        <View style={styles.fakeInput}>
          <Text style={styles.placeholderText}>Bạn đang nghĩ gì?</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.label}>Chế độ hiển thị</Text>
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={visibility}
            onValueChange={(itemValue) => setVisibility(itemValue)}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="Gia đình" value="Gia đình" />
            <Picker.Item label="Cộng đồng" value="Cộng đồng" />
          </Picker>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    marginRight: 12,
  },
  fakeInput: {
    flex: 1,
    justifyContent: "center",
  },
  placeholderText: {
    color: "#6B7280",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  dropdownWrapper: {
    width: 170,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50 ,
    width: "100%",
  },
});
