import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect } from 'react';

const ConfirmScreen = () => {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const focused = useIsFocused();
  console.log('CONFIRM VIEW SCREEN?', { focused, uri });
  const videoPlayer = useVideoPlayer(uri ?? '');

  useEffect(() => {
    const l = videoPlayer.addListener('statusChange', (status) => {
      console.log('statusChange', status);
      if (status === 'readyToPlay') {
        if (!videoPlayer.playing) {
          console.log('playing bc of asynch status');
          videoPlayer.play();
        }
      }
    });
    const status = videoPlayer.status;
    if (status === 'readyToPlay') {
      if (!videoPlayer.playing) {
        console.log('playing bc of synchroneous status');
        videoPlayer.play();
      }
    }
    return () => {
      l.remove();
    };
  }, [videoPlayer]);

  return <VideoView style={{ flex: 1 }} player={videoPlayer}></VideoView>;
};

export { ConfirmScreen };
export default ConfirmScreen;
