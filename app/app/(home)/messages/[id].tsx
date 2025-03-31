import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { FontAwesome } from "@expo/vector-icons";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const flatListRef = useRef(null);

  // Get chat messages
  const messages = useQuery(api.functions.messages.getConversation, {
    userId1: user?.id as string,
    userId2: id as string,
  });

  // Get other user's details
  const otherUser = useQuery(api.functions.createUserIfNotExists.getUserById, {
    userId: id as Id<"users">,
  });

  // Send message mutation
  const sendMessage = useMutation(api.functions.messages.sendMessage);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage({
        receiverId: id as string,
        senderId: user?.id as string,
        message: message.trim(),
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current && messages?.length) {
      (flatListRef.current as any).scrollToEnd({ animated: true });
    }
  }, [messages]);

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

  const renderMessage = ({
    item,
  }: {
    item: {
      _id: string;
      senderId: string;
      message: string;
      sentAt: number;
    };
  }) => {
    const isSentByMe = item.senderId === user?.id;

    return (
      <View
        className={`flex-row ${
          isSentByMe ? "justify-end" : "justify-start"
        } mb-2`}
      >
        <View
          className={`max-w-[80%] rounded-lg p-3 ${
            isSentByMe
              ? "bg-blue-500 rounded-br-none"
              : "bg-gray-200 rounded-bl-none"
          }`}
        >
          <Text className={`${isSentByMe ? "text-white" : "text-gray-800"}`}>
            {item.message}
          </Text>
          <View className="flex-row items-center mt-1">
            <Text
              className={`text-xs ${
                isSentByMe ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {formatTimestamp(item.sentAt)}
            </Text>
            {isSentByMe && (
              <FontAwesome
                name="check"
                size={12}
                color={isSentByMe ? "#E3F2FD" : "#9CA3AF"}
                className="ml-1"
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <FlatList
        ref={flatListRef}
        data={messages || []}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerClassName="p-4"
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-500">Ingen meldinger enda</Text>
          </View>
        }
      />
      <View className="p-4 border-t border-gray-200 bg-white">
        <View className="flex-row items-center">
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Skriv en melding..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!message.trim()}
            className={`p-2 rounded-full ${
              message.trim() ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <FontAwesome name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
