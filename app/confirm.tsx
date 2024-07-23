import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';

const ConfirmScreen = () => {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const focused = useIsFocused();
  console.log('CONFIRM VIEW SCREEN?', {focused, uri});
  const videoPlayer = useVideoPlayer(uri ?? '', (p) => {
    p.play();
  });
  return <VideoView style={{ flex: 1 }} player={videoPlayer}></VideoView>;
};

export { ConfirmScreen };
export default ConfirmScreen;
