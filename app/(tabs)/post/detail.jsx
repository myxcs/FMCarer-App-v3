import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SvgUri } from "react-native-svg";
import axios from "axios";
import { API_URL } from "../../../constants/api";
import { useAuthStore } from "../../../store/authStore";
import { useNavigation, useRoute } from "@react-navigation/native";
import { formatDistanceToNow } from "date-fns"; // Thay moment bằng date-fns

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const commentListRef = useRef(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { id: postId, focusComment } = route.params;
  const { token, userId } = useAuthStore();

  useEffect(() => {
    console.log("route.params:", route.params);
    console.log("postId:", postId, "token:", token);
    const fetchPost = async () => {
      if (!postId) {
        console.error("Error: postId is undefined");
        setLoading(false);
        setPost(null);
        return;
      }
      try {
        if (!token) throw new Error("No token found");
        const response = await axios.get(`${API_URL}/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API response:", response.data);
        setPost(response.data);
        setLoading(false);
        if (focusComment && commentListRef.current) {
          setTimeout(() => {
            commentListRef.current.scrollToEnd({ animated: true });
          }, 100);
        }
      } catch (error) {
        console.error("Error details:", error.response?.data, error.message);
        setLoading(false);
        if (error.response?.status === 404 || error.response?.status === 400) {
          setPost(null);
        }
      }
    };
    fetchPost();
  }, [postId, token, focusComment]);

  const handleLike = async () => {
    try {
      if (!token) throw new Error("No token found");
      const response = await axios.post(
        `${API_URL}/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost({ ...post, likes: response.data.likes });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      if (!token) throw new Error("No token found");
      const response = await axios.post(
        `${API_URL}/posts/${postId}/comment`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost({ ...post, comments: response.data.comments });
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const renderComment = ({ item }) => {
    console.log("Comment user:", JSON.stringify(item.user, null, 2));
    return (
      <View style={styles.commentContainer}>
        <SvgUri
          uri={item.user?.profileImage || "https://via.placeholder.com/40"}
          width={40}
          height={40}
          style={styles.commentAvatar}
          onError={(error) => console.log("SvgUri error (comment):", error)}
        />
        <View style={styles.commentContent}>
          <Text style={styles.commentUser}>{item.user?.username || "Unknown"}</Text>
          <Text style={styles.commentText}>{item.content}</Text>
          <Text style={styles.commentTime}>
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.loading}>
        <Text>Bài viết không tồn tại hoặc postId không hợp lệ</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SvgUri
          uri={post.author.profileImage || "https://via.placeholder.com/50"}
          width={50}
          height={50}
          style={styles.avatar}
          onError={(error) => console.log("SvgUri error (author):", error)}
        />
        <View>
          <Text style={styles.username}>{post.author.username}</Text>
          <Text style={styles.time}>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </Text>
          <Text style={styles.audience}>{post.audience.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.content}>{post.content}</Text>
      {post.images && post.images.length > 0 && (
        <FlatList
          data={post.images}
          horizontal
          keyExtractor={(item) => item.public_id}
          renderItem={({ item }) => (
            <Image source={{ uri: item.url }} style={styles.image} />
          )}
          showsHorizontalScrollIndicator={false}
          style={styles.imageList}
        />
      )}
      <View style={styles.stats}>
        <Text>{post.likes.length} Likes</Text>
        <Text>{post.comments.length} Comments</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <Text style={styles.actionText}>
            {post.likes.some((id) => id.toString() === userId?.toString()) ? "Unlike" : "Like"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Viết bình luận..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity onPress={handleComment} style={styles.commentButton}>
          <Text style={styles.commentButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={commentListRef}
        data={post.comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderComment}
        ListEmptyComponent={<Text>Chưa có bình luận</Text>}
        style={styles.commentList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  time: {
    color: "#888",
    fontSize: 12,
  },
  audience: {
    color: "#007AFF",
    fontSize: 12,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  imageList: {
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 10,
  },
  actionButton: {
    padding: 10,
  },
  actionText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  commentButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  commentButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  commentList: {
    flexGrow: 0,
  },
  commentContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontWeight: "bold",
  },
  commentText: {
    fontSize: 14,
  },
  commentTime: {
    color: "#888",
    fontSize: 12,
  },
});

export default PostDetail;