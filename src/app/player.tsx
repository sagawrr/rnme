import { Stack } from 'expo-router';

import { COPY } from '@/constants/copy';
import PlayerScreen from '@/screens/player/PlayerScreen';

export default function PlayerRoute() {
  return (
    <>
      <Stack.Screen options={{ title: COPY.navigation.trailer }} />
      <PlayerScreen />
    </>
  );
}
