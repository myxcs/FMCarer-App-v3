import { Ionicons } from "@expo/vector-icons";
import { FlatList, Image, StyleSheet, Text, TextInput, View } from "react-native";

import { router } from "expo-router";



const posts = [
  {
    id: "1",
    user: "EmiliaQAQ",
    time: "2 phút",
    content: "Bé nhà mình không thích tắm...",
    likes: 3,
    comments: 2,
  },
  {
    id: "2",
    user: "mOnesy",
    time: "15 phút",
    content: "Con có thói quen mở điện thoại...",
    image: "https://link.to/baby.jpg",
    likes: 5,
    comments: 3,
  },
];

export default function Post() {
  return (

    
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bài đăng</Text>
        <Ionicons name="search" size={24} color="#666" />
      </View>

      {/* Input giả */}
      <View style={styles.inputWrapper}>
        <Ionicons name="person-circle-outline" size={32} />
        <TextInput
          placeholder="Bạn đang nghĩ gì?"
          style={styles.input}
          editable={false} // Chỉ để hiển thị, không cho nhập
          onPress={() => router.push("/(tabs)/post.creacter")} // Chuyển hướng đến trang tạo bài đăng
        />
      </View>

      {/* Bộ lọc */}
      <View style={styles.filter}>
        <Text style={styles.filterLabel}>Chế độ hiển thị</Text>
        <Text style={styles.filterRight}>Tất cả ▾</Text>
      </View>

      {/* Danh sách bài viết */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.username}>{item.user}</Text>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={styles.content}>{item.content}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}
            <View style={styles.actions}>
              <Text>❤️ {item.likes} lượt thích</Text>
              <Text>💬 {item.comments} bình luận</Text>
            </View>
          </View>
        )}
      />

      {/* Navigation (tùy bạn đã setup expo-router tabs) */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  inputWrapper: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#f2f2f2",
    borderRadius: 10, padding: 10, marginBottom: 12,
  },
  input: { marginLeft: 10, color: "#555" },
  filter: {
    flexDirection: "row", justifyContent: "space-between", marginBottom: 8,
  },
  filterLabel: { fontWeight: "600" },
  filterRight: { color: "#555" },
  post: {
    paddingVertical: 12, borderBottomWidth: 0.5, borderColor: "#ddd",
  },
  username: { fontWeight: "bold" },
  time: { color: "#888", fontSize: 12 },
  content: { marginVertical: 6 },
  image: { width: "100%", height: 200, borderRadius: 8, marginTop: 8 },
  actions: {
    flexDirection: "row", justifyContent: "space-between", marginTop: 6,
  },
});
