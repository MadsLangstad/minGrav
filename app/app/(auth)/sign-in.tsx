import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const { signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      if (!signIn) {
        Alert.alert("Error", "SignIn object is undefined");
        setLoading(false);
        return;
      }

      const result = await signIn.create({
        identifier: email.trim(),
        password: password.trim(),
      });

      if (result.status === "complete") {
        if (setActive) {
          await setActive({ session: result.createdSessionId });
          router.replace("/(home)");
        } else {
          Alert.alert("Error", "Unable to set active session");
        }
      } else {
        Alert.alert("Error", "Sign in failed");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      Alert.alert("Error", "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 justify-center p-5">
      <View className="bg-white p-6 rounded-lg shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Welcome Back
        </Text>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-1">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-gray-50 p-3 rounded-lg border border-gray-200"
          />
        </View>

        {/* Password */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-1">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            className="bg-gray-50 p-3 rounded-lg border border-gray-200"
          />
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          className={`bg-blue-500 p-4 rounded-lg ${
            loading ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white text-center font-semibold">
            {loading ? "Signing in..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity
          onPress={() => router.push("/sign-up")}
          className="mt-4"
        >
          <Text className="text-blue-500 text-center">
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
