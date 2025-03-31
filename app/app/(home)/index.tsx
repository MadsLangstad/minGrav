import React from 'react';
import {
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useAuth } from '@clerk/clerk-expo';
import { Id } from '@/convex/_generated/dataModel';

// Define params for dynamic routes
interface GraveRouteParams {
    graveId: string;
}
interface RequestRouteParams {
    id: string;
}

// Define static route strings
type StaticRoute =
    | '/'
    | '/_sitemap'
    | '/(auth)/sign-in'
    | '/sign-in'
    | '/(auth)/sign-up'
    | '/sign-up'
    | '/(home)'
    | '/available-tasks'
    | '/create-grave';

// Define dynamic route objects
type DynamicRoute =
    | { pathname: '/requests/[id]'; params: RequestRouteParams }
    | { pathname: '/graves/[graveId]'; params: GraveRouteParams };

// Union of all valid navigation inputs
type NavigationTarget = StaticRoute | DynamicRoute;

export default function Home() {
    const router = useRouter();
    const { user } = useUser();
    const { isLoaded, isSignedIn } = useAuth();

    // Ensure user is signed in before querying user data
    const userData = isSignedIn
        ? useQuery(api.functions.createUserIfNotExists.getUserQuery, {
              email: user?.primaryEmailAddress?.emailAddress ?? '',
          })
        : undefined;

    // Get relevant data based on role
    const requests = useQuery(api.functions.listOpenRequests.listOpenRequests);
    const userGraves = useQuery(api.functions.listOpenRequests.getUserGraves, {
        userId: (userData?._id as Id<'users'>) ?? '',
    });

    // Loading state
    if (
        !isLoaded ||
        !isSignedIn ||
        requests === undefined ||
        userData === undefined
    ) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#666" />
                <Text className="mt-2 text-gray-600">Loading...</Text>
            </View>
        );
    }

    // Not signed in state
    if (!isSignedIn) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-600">
                    Please sign in to continue
                </Text>
            </View>
        );
    }

    const isCaretaker = userData?.role === 'caretaker';

    // Navigation helper with explicit type
    const navigateTo = (target: NavigationTarget) => {
        router.push(target as any);
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-4">
                <Text className="text-2xl font-bold text-gray-800 mb-4">
                    Welcome, {user?.firstName || 'User'}
                </Text>

                {/* Content will be added based on user role */}
                <View className="bg-white rounded-lg p-4 shadow-sm">
                    <Text className="text-gray-600">
                        Your dashboard content will appear here.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
