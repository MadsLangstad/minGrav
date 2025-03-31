import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FontAwesome } from "@expo/vector-icons";

export default function Messages() {
  const router = useRouter();
  const { user } = useUser();

  // Get user data first
  const userData = useQuery(api.functions.createUserIfNotExists.getUserQuery, {
    email: user?.primaryEmailAddress?.emailAddress ?? "",
  });

  // Then get conversations using the user's Convex ID
  const conversations = userData?._id
    ? useQuery(api.functions.messages.getRecentConversations, {
        userId: userData._id,
      })
    : null;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "I går";
    } else if (days < 7) {
      return date.toLocaleDateString("nb-NO", { weekday: "long" });
    } else {
      return date.toLocaleDateString("nb-NO", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  const renderConversation = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push(`/messages/${item.user._id}`)}
      className="p-4 bg-white border-b border-gray-100"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="font-medium text-gray-800">{item.user.name}</Text>
          <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
            {item.lastMessage.message}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-gray-400 text-xs">
            {formatTimestamp(item.lastMessage.sentAt)}
          </Text>
          {item.unreadCount > 0 && (
            <View className="mt-1 bg-blue-500 rounded-full px-2 py-1">
              <Text className="text-white text-xs">{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!userData) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Laster...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={conversations || []}
        renderItem={renderConversation}
        keyExtractor={(item) => item.user._id}
        ListEmptyComponent={
          <View className="p-4">
            <Text className="text-gray-500 text-center">
              Ingen samtaler enda
            </Text>
          </View>
        }
      />
    </View>
  );
}
