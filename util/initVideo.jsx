import React, { useState } from 'react';
import GoogleCast, { useRemoteMediaClient } from 'react-native-google-cast';

// Compteurs de clique
let playPauseCount = 0;
let rewindCount = 0;
let forwardCount = 0;
let volumeChangeCount = 0;

// Anti-répétitions 
let lastRewindPosition = null;
let lastForwardPosition = null;
let lastPlayState = null;
let lastVolume = null;

// Chronomètre
let chronometreStart = null;

// Volume délais et pas de compte lors pleine utilisation
let volumeLogTimeout = null;
let volumeChangePending = false;

export const initVideo = () => {
  const client = useRemoteMediaClient();
  const [showPlay, setShowPlay] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [status, setStatus] = useState('initial');
  const [currentSession, setCurrentSession] = useState(false);

  const videoList = [
    'https://transfertco.ca/video/DBillPrelude.mp4',
    'https://transfertco.ca/video/DBillSpotted.mp4',
    'https://transfertco.ca/video/usa23_7_02.mp4',
  ];

  const sessionManager = GoogleCast.getSessionManager();

  React.useEffect(() => {
    const listener = sessionManager.onSessionStarted((session) => {
      setStatus('Connecté');
      setCurrentSession(session);
      setShowPlay(true);

      // Réinitialisation des stats (compteur,minuterie et etc.)
      playPauseCount = 0;
      rewindCount = 0;
      forwardCount = 0;
      volumeChangeCount = 0;
      lastRewindPosition = null;
      lastForwardPosition = null;
      lastPlayState = null;
      lastVolume = null;
      chronometreStart = null;
      volumeLogTimeout = null;
      volumeChangePending = false;

      if (client) {
        client.onMediaPlaybackStarted(() => setIsStarted(true));
        client.onMediaPlaybackEnded(() => setIsStarted(false));
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  const getSecondesDepuisStart = () => {
    if (chronometreStart === null) return 0;
    return ((performance.now() - chronometreStart) / 1000).toFixed(2);
  };

  const startVideo = () => {
    if (client) {
      client.loadMedia({
        autoplay: true,
        mediaInfo: {
          contentUrl: videoList[0],
          contentType: 'video/mp4',
        },
      });

      chronometreStart = performance.now();
      console.log("⏱️ Chronomètre démarré à 0 seconde");

      setIsStarted(true);
      setIsPlay(true);
    }
  };

  const stopVideo = () => {
    const secondes = getSecondesDepuisStart();
    console.log(`🛑 Chronomètre arrêté à ${secondes} secondes`);
    chronometreStart = null;

    sessionManager.endCurrentSession();
    setStatus('Déconnecté');
    setIsStarted(false);
    setIsPlay(false);
    setShowPlay(false);

    console.log("\n📊 Grille d'observation (fin de session) :");
    console.log(`▶️ Play/Pause : ${playPauseCount} fois`);
    console.log(`⏪ Rewind     : ${rewindCount} fois`);
    console.log(`⏩ Forward    : ${forwardCount} fois`);
    console.log(`🔊 Volume     : ${volumeChangeCount} fois`);
  };

  const handleRewind = async () => {
    const mediaStatus = await client?.getMediaStatus?.();
    const currentPosition = mediaStatus?.streamPosition ?? 0;
    const newPosition = Math.max(currentPosition - 5, 0);

    if (lastRewindPosition !== newPosition) {
      rewindCount++;
      lastRewindPosition = newPosition;
    }

    await client?.seek({ position: newPosition });

    console.log(`⏪ Rewind appuyé à ${getSecondesDepuisStart()} secondes`);
  };

  const handleForward = async () => {
    const mediaStatus = await client?.getMediaStatus?.();
    const currentPosition = mediaStatus?.streamPosition ?? 0;
    const newPosition = Math.max(currentPosition + 5, 0);

    if (lastForwardPosition !== newPosition) {
      forwardCount++;
      lastForwardPosition = newPosition;
    }

    await client?.seek({ position: newPosition });

    console.log(`⏩ Forward appuyé à ${getSecondesDepuisStart()} secondes`);
  };

  const handlePlayPause = () => {
    const newState = !isPlay;

    if (lastPlayState !== newState) {
      playPauseCount++;
      lastPlayState = newState;
    }

    if (client) {
      if (isPlay) {
        client.pause();
        setIsPlay(false);
      } else {
        client.play();
        setIsPlay(true);
      }
    }

    console.log(`▶️ Play/Pause appuyé à ${getSecondesDepuisStart()} secondes`);
  };

  const handleVolumeChange = async (newVolumeValue) => {
    if (newVolumeValue === lastVolume) return;
    lastVolume = newVolumeValue;

    if (client) {
      const normalizedVolume = newVolumeValue / 100;
      currentSession?.setVolume(normalizedVolume);
    }

    volumeChangePending = true;

    if (volumeLogTimeout) clearTimeout(volumeLogTimeout);

    volumeLogTimeout = setTimeout(() => {
      if (volumeChangePending) {
        volumeChangeCount++;
        console.log(`🔊 Volume modifié à ${getSecondesDepuisStart()} secondes`);
        volumeChangePending = false;
      }
      volumeLogTimeout = null;
    }, 1000); // 1 seconde de délai = 1000ms pour compter le changement du volume
  };

  return {
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
  };
};
