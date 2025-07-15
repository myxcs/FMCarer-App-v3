import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../../constants/api";
import { useAuthStore } from "../../../store/authStore";

export default function CreatePost() {
  // State variables
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState("family");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { token } = useAuthStore();

  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== indexToRemove));
  };

  const pickImages = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Quyền bị từ chối", "Cần cấp quyền để chọn ảnh");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        selectionLimit: 5,
      });

      if (!result.canceled) {
        const selected = result.assets.slice(0, 5);
        setImages(selected);
      }
    } catch (error) {
      console.error("Lỗi chọn ảnh:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi chọn ảnh");
    }
  };

  const handleSubmit = async () => {
    // Kiểm tra token
    if (!token) {
      Alert.alert("Lỗi", "Phiên đăng nhập đã hết, vui lòng đăng nhập lại.");
      return;
    }

    // Kiểm tra nội dung bài viết
    if (!content.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung bài viết.");
      return;
    }

    // Kiểm tra số lượng ảnh
    if (images.length > 5) {
      Alert.alert("Lỗi", "Chỉ được chọn tối đa 5 ảnh.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("audience", audience);

      // Hàm lấy MIME type theo đuôi ảnh
      const getMimeType = (uri) => {
        if (uri.endsWith(".png")) return "image/png";
        if (uri.endsWith(".webp")) return "image/webp";
        return "image/jpeg";
      };

      // Thêm ảnh vào FormData
      images.forEach((img, index) => {
        formData.append("images", {
          uri: img.uri,
          name: `photo_${index}.jpg`,
          type: getMimeType(img.uri),
        });
      });

      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // KHÔNG thêm Content-Type, React Native sẽ tự xử lý với boundary
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Đăng bài thất bại");
      }

      Alert.alert("Thành công", "Bài viết đã được đăng.");
      router.back(); // quay lại màn hình trước
    } catch (err) {
      Alert.alert("Lỗi", err.message || "Đã xảy ra lỗi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Render the create post form
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Tạo bài viết</Text>

      {/* Content input */}
      <TextInput
        placeholder="Bạn đang nghĩ gì?"
        multiline
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />

      {/* Audience selection */}
      <View style={styles.row}>
        <Text style={styles.label}>Chế độ hiển thị:</Text>
        <TouchableOpacity
          onPress={() =>
            setAudience(audience === "family" ? "public" : "family")
          }
          style={styles.toggle}
        >
          <Text style={styles.toggleText}>
            {audience === "family" ? "Gia đình" : "Cộng đồng"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image upload button */}
      <TouchableOpacity style={styles.uploadBtn} onPress={pickImages}>
        <Text style={styles.uploadText}>Chọn ảnh ({images.length}/5)</Text>
      </TouchableOpacity>

      {/* Image preview */}
      <View style={styles.imagePreviewContainer}>
        {images.map((img, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: img.uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveImage(index)}
            >
              <Ionicons name="close-circle" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Submit button */}
      <TouchableOpacity
        style={[styles.submitBtn, isSubmitting && { opacity: 0.5 }]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitText}>
          {isSubmitting ? "Đang đăng..." : "Đăng bài"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  toggle: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  toggleText: {
    fontSize: 14,
  },
  uploadBtn: {
    backgroundColor: "#e0e7ff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "500",
  },
  preview: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 8,
    marginTop: 8,
  },
  submitBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 12,
  },

  imageWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },

  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#fff",
    borderRadius: 999,
  },
});
