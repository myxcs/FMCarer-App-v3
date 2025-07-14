import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function PostIndex() {
  const router = useRouter();

  return (
    <View>
      <TouchableOpacity onPress={() => router.push("/(tabs)/post/create")}>
        <Text>Viết bài mới</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(tabs)/post/detail")}>
        <Text>Xem chi tiết bài viết</Text>
      </TouchableOpacity>
    </View>
  );
}
