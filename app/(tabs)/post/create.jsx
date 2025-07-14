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
import { useAuthStore } from "../../../store/authStore";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState("family");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { token } = useAuthStore();

  const pickImages = async () => {
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
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung bài viết.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("audience", audience);

      images.forEach((img, index) => {
        formData.append("images", {
          uri: img.uri,
          name: `photo_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      const res = await fetch("http://192.168.1.112:3000/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Đăng bài thất bại");
      }

      Alert.alert("Thành công", "Bài viết đã được đăng.");
      router.back();
    } catch (err) {
      Alert.alert("Lỗi", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Tạo bài viết</Text>

      <TextInput
        placeholder="Bạn đang nghĩ gì?"
        multiline
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />

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

      <TouchableOpacity style={styles.uploadBtn} onPress={pickImages}>
        <Text style={styles.uploadText}>Chọn ảnh ({images.length}/5)</Text>
      </TouchableOpacity>

      <View style={styles.preview}>
        {images.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: img.uri }}
            style={styles.imagePreview}
          />
        ))}
      </View>

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
});
