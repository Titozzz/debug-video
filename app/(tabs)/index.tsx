import { StyleSheet, Button, View } from 'react-native';
import { router } from 'expo-router';
import qs from 'qs';
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import {Audio, InterruptionModeIOS} from 'expo-av';

Audio.setAudioModeAsync({
  interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
  allowsRecordingIOS: true,
  playsInSilentModeIOS: true,
})

export default function HomeScreen() {
  const ref = useRef<CameraView>(null);
  const [isRecording, setIsRecording] = useState(false);

  const [p, r] = useCameraPermissions();
  useEffect(() => {
    if (p?.granted === false && p.canAskAgain) {
      r();
    }
  }, [p, r]);

  const [p2, r2] = useMicrophonePermissions();
  useEffect(() => {
    if (p2?.granted === false && p2.canAskAgain) {
      r2();
    }
  }, [p2, r2]);

  const n = useNavigation();
  const focused = useIsFocused();
  console.log('CAMERA VIEW SCREEN?', focused);
  const [focusedLate, setFocusedLate] = useState(focused);
  useEffect(() => {
    setTimeout(() => {
      setFocusedLate(focused);
    }, 1000)
  }, [focused])
  return (
    <View style={{ flex: 1, backgroundColor: 'gray' }}>
      {focusedLate && <CameraView
        mode="video"
        style={StyleSheet.absoluteFill}
        facing="front"
        ref={ref}
      ></CameraView>}
      <View style={{ position: 'absolute', bottom: 30, alignSelf: 'center' }}>
        <Button
          onPress={async () => {
            try {
              if (isRecording) {
                console.log('stopping');
                ref.current?.stopRecording();
              } else {
                setIsRecording(true);
                console.log('starting');
                const res = await ref.current?.recordAsync();
                setIsRecording(false);
                if (res?.uri) {
                  console.log(`/confirm?${qs.stringify({ uri: res.uri })}`);
                  router.push(
                    { pathname: '/confirm' },
                  );
                  router.setParams({ uri: res.uri });
                  console.log(res);
                }
              }
            } catch (e) {
              console.error(e);
            }
          }}
          title={isRecording ? 'Stop recording' : 'Start recording'}
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
