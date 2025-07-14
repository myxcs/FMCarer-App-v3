import { Stack } from "expo-router";

export default function PostLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Bài viết",
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "Tạo bài viết",
          presentation: "modal", // tùy chọn: hiển thị dạng modal
        }}
      />
      <Stack.Screen
        name="detail"
        options={{
          title: "Chi tiết bài viết",
        }}
      />
    </Stack>
  );
}
