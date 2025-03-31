import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function Profile() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Profile Header */}
        <View className="bg-white rounded-lg p-6 shadow-sm mb-4 items-center">
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-3">
            <FontAwesome name="user" size={40} color="#3b82f6" />
          </View>
          <Text className="text-xl font-bold text-gray-800">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="text-gray-500">
            {user?.emailAddresses[0].emailAddress}
          </Text>
        </View>

        {/* Settings Section */}
        <View className="bg-white rounded-lg shadow-sm mb-4">
          <TouchableOpacity className="p-4 border-b border-gray-100">
            <Text className="text-gray-800">Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 border-b border-gray-100">
            <Text className="text-gray-800">Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4">
            <Text className="text-gray-800">Privacy Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View className="bg-white rounded-lg shadow-sm mb-4">
          <TouchableOpacity className="p-4 border-b border-gray-100">
            <Text className="text-gray-800">Help & Support</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 border-b border-gray-100">
            <Text className="text-gray-800">Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4">
            <Text className="text-gray-800">Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-red-500 p-4 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
