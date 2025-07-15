import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
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
import { SvgUri } from "react-native-svg";
import { API_URL } from "../../../constants/api";
import { useAuthStore } from "../../../store/authStore";

export default function PostIndex() {
  const router = useRouter();
  const { token, userId, user } = useAuthStore();

  const [visibility, setVisibility] = useState("Gia đình");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const audienceMap = {
    "Gia đình": "family",
    "Cộng đồng": "public",
  };

  const fetchPosts = async (reset = false) => {
    if (!token) return;

    const queryAudience = audienceMap[visibility];
    const targetPage = reset ? 1 : page;

    try {
      const response = await axios.get(`${API_URL}/posts`, {
        params: { page: targetPage, limit, audience: queryAudience },
        headers: { Authorization: `Bearer ${token}` },
      });
      const newPosts = response.data.posts || [];
      setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
      setHasMore(response.data.pagination?.hasMore);
      setPage(reset ? 2 : targetPage + 1);
    } catch (err) {
      console.error("Lỗi khi lấy bài viết:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("User profileImage:", user?.profileImage);
    fetchPosts(true);
  }, [visibility]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts(true);
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.patch(
        `${API_URL}/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p._id === postId ? response.data : p))
      );
    } catch (err) {
      console.error("Lỗi khi like bài viết:", err.message);
    }
  };

  const renderItem = ({ item }) => {
    const userLiked = item.likes?.some(
      (id) => id.toString() === userId?.toString()
    );

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => router.push(`/post/detail?id=${item._id}`)}
      >
        <View style={styles.cardHeader}>
          <SvgUri
            uri={item.author.profileImage || "https://via.placeholder.com/40"}
            width={40}
            height={40}
            style={styles.avatar}
            onError={(error) =>
              console.log("SvgUri error (post author):", error)
            }
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
        {item.images?.[0]?.url && (
          <Image
            source={{ uri: item.images[0].url }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleLike(item._id)}
            style={styles.iconButton}
          >
            <Ionicons
              name={userLiked ? "heart" : "heart-outline"}
              size={22}
              color={userLiked ? "#FF0000" : "#444"}
            />
            <Text style={styles.actionText}>{item.likes?.length || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              router.push(`/post/detail?id=${item._id}&focusComment=true`)
            }
            style={styles.iconButton}
          >
            <Ionicons name="chatbubble-outline" size={22} color="#444" />
            <Text style={styles.actionText}>{item.comments?.length || 0}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Bài đăng</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Input giả */}
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => router.push("/(tabs)/post/create")}
          activeOpacity={0.8}
        >
          <SvgUri
            uri={user?.profileImage || "https://via.placeholder.com/40"}
            width={40}
            height={40}
            style={styles.avatar}
            onError={(error) => console.log("SvgUri error (user):", error)}
          />
          <View style={styles.fakeInput}>
            <Text style={styles.placeholderText}>Bạn đang nghĩ gì?</Text>
          </View>
          <Ionicons
            name="image-outline"
            size={20}
            color="#A1A1AA"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>

        {/* Toggle chế độ hiển thị */}
        <View style={styles.visibilityToggle}>
          <Text style={styles.visibilityLabel}>Chọn chế độ hiển thị</Text>

          <View style={{ alignItems: "flex-end" }}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  visibility === "Gia đình" && styles.toggleButtonActive,
                ]}
                onPress={() => setVisibility("Gia đình")}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    visibility === "Gia đình" && styles.toggleButtonTextActive,
                  ]}
                >
                  Gia đình
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  visibility === "Cộng đồng" && styles.toggleButtonActive,
                ]}
                onPress={() => setVisibility("Cộng đồng")}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    visibility === "Cộng đồng" && styles.toggleButtonTextActive,
                  ]}
                >
                  Cộng đồng
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasMore && !loading) fetchPosts();
          }}
          onEndReachedThreshold={0.4}
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
    backgroundColor: "#fff",
  },
  headerContainer: {
    padding: 12,
    borderBottomWidth: 1, // Đường kẻ mờ
    borderBottomColor: "#eee",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  fakeInput: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 8,
  },
  placeholderText: {
    color: "#A1A1AA",
    fontSize: 14,
  },
  visibilityToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  visibilityLabel: {
    fontSize: 12, // Label nhỏ gọn
    fontWeight: "bold",
    color: "#333",
    marginRight: 8, // Khoảng cách tự nhiên
  },
  toggleContainer: {
    flexDirection: "row",
    alignSelf: "flex-end", // Đẩy cả cụm sang phải
    backgroundColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
    marginLeft: 100, // Đẩy sang bên phải
  },

  toggleButton: {
    paddingVertical: 4, // Thu nhỏ padding
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: "#007AFF",
  },
  toggleButtonText: {
    fontSize: 10, // Font nhỏ gọn
    color: "#333",
  },
  toggleButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // Đảm bảo tròn
    overflow: "hidden", // Ngăn lệch hình
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  time: {
    fontSize: 12,
    color: "#A1A1AA",
  },
  content: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  actions: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between", // Thêm để căn nút Comment sát phải
  paddingHorizontal: 8, // Thêm padding để đảm bảo căn chỉnh đẹp
},
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: "#444",
  },
});
