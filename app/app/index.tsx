import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(home)");
    }
  }, [isSignedIn]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Hero Section */}
      <View className="flex-1 justify-center items-center p-8">
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
            Welcome to MinGrav
          </Text>
          <Text className="text-gray-600 text-center text-lg mb-6">
            Connect with trusted caretakers for your loved ones' graves
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="w-full space-y-4">
          <TouchableOpacity
            onPress={() => router.push("/sign-in")}
            className="bg-blue-500 p-4 rounded-lg w-full"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/sign-up")}
            className="bg-white border border-blue-500 p-4 rounded-lg w-full"
          >
            <Text className="text-blue-500 text-center font-semibold text-lg">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View className="mt-12">
          <Text className="text-gray-600 text-center mb-4">
            Why choose MinGrav?
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              <Text className="text-gray-700">
                Trusted caretakers in your area
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              <Text className="text-gray-700">Regular maintenance updates</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              <Text className="text-gray-700">Photo documentation</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
