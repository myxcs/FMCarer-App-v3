import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../../store/authStore";

export default function PostIndex() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [visibility, setVisibility] = useState("Gia đình");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://192.168.1.112:3000/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Lỗi khi lấy bài viết:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleCreatePost = () => {
    router.push("/(tabs)/post/create");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/post/detail?id=${item._id}`)}
    >
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: item.author.profileImage || "https://via.placeholder.com/40" }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{item.author.username}</Text>
          <Text style={styles.time}>
            {formatDistanceToNow(new Date(item.createdAt), {
              addSuffix: true,
              locale: vi,
            })}
          </Text>
        </View>
      </View>

      <Text style={styles.content}>{item.content}</Text>

      {item.images?.length > 0 && (
        <Image
          source={{ uri: item.images[0].url }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.title}>Bài đăng</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Input giả */}
      <TouchableOpacity
        style={styles.inputBox}
        onPress={handleCreatePost}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.avatar}
        />
        <View style={styles.fakeInput}>
          <Text style={styles.placeholderText}>Bạn đang nghĩ gì?</Text>
        </View>
      </TouchableOpacity>

      {/* Chế độ hiển thị */}
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

      {/* Danh sách bài viết */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
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
    height: 50,
    width: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  content: {
    fontSize: 15,
    marginVertical: 8,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 8,
  },
});
