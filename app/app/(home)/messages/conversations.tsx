import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Conversations() {
  const router = useRouter();
  const { user } = useUser();
  // Get user data
  const userData = useQuery(api.functions.createUserIfNotExists.getUserQuery, {
    email: user?.primaryEmailAddress?.emailAddress ?? "",
  });

  // Get conversations
  const conversations = useQuery(
    api.functions.messages.getRecentConversations,
    {
      userId: userData?._id as any,
    }
  );

  if (!userData || !conversations) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderConversation = ({ item }: { item: any }) => {
    const lastMessage = item.lastMessage;
    const isOwnMessage = lastMessage.senderId === userData._id;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/messages/${item.user._id}`)}
        className="flex-row items-center p-4 bg-white border-b border-gray-100"
      >
        {/* User Info */}
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {item.user.name}
          </Text>
          <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
            {isOwnMessage ? "You: " : ""}
            {lastMessage.message}
          </Text>
        </View>

        {/* Time */}
        <Text className="text-xs text-gray-400">
          {new Date(lastMessage.sentAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Messages</Text>
      </View>

      {/* Conversations List */}
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.user._id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
