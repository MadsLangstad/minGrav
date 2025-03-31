import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

type Role = "client" | "caretaker";

export default function SignUp() {
  const router = useRouter();
  const { signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("client");
  const [loading, setLoading] = useState(false);

  // Create user mutation
  const createUser = useMutation(
    api.functions.createUserIfNotExists.createUserIfNotExists
  );

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      if (!signUp) {
        Alert.alert("Error", "Sign up functionality is unavailable");
        setLoading(false);
        return;
      }

      const result = await signUp.create({
        emailAddress: email.trim(),
        password: password.trim(),
        firstName: name.trim(),
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // Create user in Convex
        await createUser({
          email: email.trim(),
          name: name.trim(),
          role,
        });

        router.replace("/(home)");
      } else {
        Alert.alert("Error", "Sign up failed");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert("Error", "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 justify-center p-5">
      <View className="bg-white p-6 rounded-lg shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Account
        </Text>

        {/* Name */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-1">Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            className="bg-gray-50 p-3 rounded-lg border border-gray-200"
          />
        </View>

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

        {/* Role Selection */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">I want to</Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => setRole("client")}
              className={`flex-1 p-3 rounded-lg border ${
                role === "client"
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-200"
              }`}
            >
              <Text
                className={`text-center ${
                  role === "client" ? "text-white" : "text-gray-700"
                }`}
              >
                Request Grave Care
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRole("caretaker")}
              className={`flex-1 p-3 rounded-lg border ${
                role === "caretaker"
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-200"
              }`}
            >
              <Text
                className={`text-center ${
                  role === "caretaker" ? "text-white" : "text-gray-700"
                }`}
              >
                Provide Care
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={handleSignUp}
          disabled={loading}
          className={`bg-blue-500 p-4 rounded-lg ${
            loading ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white text-center font-semibold">
            {loading ? "Creating account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <TouchableOpacity
          onPress={() => router.push("/sign-in")}
          className="mt-4"
        >
          <Text className="text-blue-500 text-center">
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
