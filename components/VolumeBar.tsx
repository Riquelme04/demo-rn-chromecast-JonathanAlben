import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

interface VolumeBarProps {
  onVolumeChange: (volume: number) => void;
}

export const VolumeBar: React.FC<VolumeBarProps> = ({ onVolumeChange }) => {
  const [volume, setVolume] = useState<number>(50); 

  const handleValueChange = (value: number) => {
    setVolume(value);
    onVolumeChange(value);
  };

  return (
    <View style={styles.container}>
        <View style={styles.counterContainer}>
            
      <Text style={styles.counterText}>{volume}%</Text>
        </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={volume}
        onValueChange={handleValueChange}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#007AFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 250,
    width: "70%",
    alignSelf: "center",
    alignItems: "center",
  },
  counterContainer: {
    backgroundColor: "rgba(255,255,255,0.7)",
    width: 60,
    height: 60,
    bottom: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginBottom: 1,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  counterText: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  
});