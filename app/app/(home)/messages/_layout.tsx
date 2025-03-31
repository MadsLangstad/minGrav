import { Stack } from 'expo-router';

export default function MessagesLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{}} />
            <Stack.Screen
                name="[id]"
                options={{
                    title: 'Chat',
                    headerBackTitle: 'Back',
                }}
            />
        </Stack>
    );
}
