import React from "react";
import { Text, View, ImageBackground, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import { CastButton } from "react-native-google-cast";
import { s } from "./App.style";
import { PlayButton } from "./components/PlayButton";
import { initVideo } from "./util/initVideo.jsx";
import { RewindButton } from "./components/RewindButton";
import { ForwardButton } from "./components/ForwardButton";
import { VolumeBar } from "./components/VolumeBar";


export default function App() {
  const {
    handlePlayPause,
    startVideo,
    stopVideo,
    handleRewind,
    handleForward,
    handleVolumeChange,
    isPlay,
    isStarted,
    showPlay,
    status,
  } = initVideo();

  return (
    <SafeAreaProvider>
      <ImageBackground
          source={{ uri: "https://random-image-pepebigotes.vercel.app/api/random-image" }}
          style={{ flex: 1, width: '100%', height: '100%'  }}
          resizeMode="cover"
         >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View style={s.workspace}>
            <Text style={styles.text}> Manette d'Alben et Jonathan 🎮 </Text>
            <Text style={styles.text}>État : {status}</Text>
            <CastButton style={s.castButton} />
            {showPlay && (
              <View>
                <RewindButton onPress={handleRewind} />
                <PlayButton
                  isPlay={isPlay}
                  isStarted={isStarted}
                  showPlay={showPlay}
                  startVideo={startVideo}
                  stopVideo={stopVideo}
                  handlePlayPause={handlePlayPause}
                />
                <ForwardButton onPress={handleForward} />
              </View>
              )}
          </View>
            
          {showPlay && (
            <View style={styles.volumeContainer}>
              <VolumeBar onVolumeChange={handleVolumeChange} />
            </View>
          )}
          </SafeAreaView>
        </ImageBackground>
        
      
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  
  text: {
    color: "#fff",
    fontSize: 30,
    marginTop: 10,
    alignContent: "center"
  },
  
  volumeContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
});
