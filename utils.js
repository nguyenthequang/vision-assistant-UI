import { Audio } from "expo-av";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function playRecordingSound() {
  const soundRec = new Audio.Sound();
  await soundRec.loadAsync(require("./system_sounds/recording.mp3"));

  await soundRec.playAsync();
  await delay(1000);

  await soundRec.unloadAsync();
}

export async function playRecordingDoneSound() {
    const soundRec = new Audio.Sound();
    await soundRec.loadAsync(require("./system_sounds/done_wait.wav"));
  
    await soundRec.playAsync();
    await delay(1000);
  
    await soundRec.unloadAsync();
  }

