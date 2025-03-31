import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

export default function CreateGrave() {
    const router = useRouter();
    const { user } = useUser();
    const [cemeteryName, setCemeteryName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);

    // Get user data
    const userData = useQuery(
        api.functions.createUserIfNotExists.getUserQuery,
        {
            email: user?.primaryEmailAddress?.emailAddress ?? '',
        },
    );

    // Create grave mutation
    const createGrave = useMutation(api.functions.createGrave.createGrave);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!cemeteryName.trim()) {
            Alert.alert('Error', 'Please enter a cemetery name');
            return;
        }

        if (!userData?._id) {
            Alert.alert('Error', 'User data not found');
            return;
        }

        try {
            await createGrave({
                ownerId: userData._id,
                cemeteryName: cemeteryName.trim(),
                description: description.trim(),
                // TODO: Upload image to storage and get URL
            });

            Alert.alert('Success', 'Grave added successfully', [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to add grave');
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-5">
                <Text className="text-2xl font-bold text-gray-800 mb-5">
                    Add New Grave
                </Text>

                {/* Cemetery Name */}
                <View className="mb-4">
                    <Text className="text-gray-700 font-medium mb-1">
                        Cemetery Name *
                    </Text>
                    <TextInput
                        value={cemeteryName}
                        onChangeText={setCemeteryName}
                        placeholder="Enter cemetery name"
                        className="bg-white p-3 rounded-lg border border-gray-200"
                    />
                </View>

                {/* Description */}
                <View className="mb-4">
                    <Text className="text-gray-700 font-medium mb-1">
                        Description
                    </Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter description (optional)"
                        multiline
                        numberOfLines={4}
                        className="bg-white p-3 rounded-lg border border-gray-200"
                    />
                </View>

                {/* Image Upload */}
                <View className="mb-4">
                    <Text className="text-gray-700 font-medium mb-1">
                        Grave Photo
                    </Text>
                    <TouchableOpacity
                        onPress={pickImage}
                        className="bg-white p-3 rounded-lg border border-gray-200 items-center"
                    >
                        {image ? (
                            <Image
                                source={{ uri: image }}
                                className="w-full h-48 rounded-lg"
                                resizeMode="cover"
                            />
                        ) : (
                            <Text className="text-gray-500">
                                Tap to add a photo
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-blue-500 p-4 rounded-lg mt-4"
                >
                    <Text className="text-white text-center font-semibold">
                        Add Grave
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
