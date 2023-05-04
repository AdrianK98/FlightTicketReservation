<template>
    <div>
      Play Sound
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        audio: null,
        soundUrl: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=success-fanfare-trumpets-6185.mp3'
      }
    },
    mounted() {
      this.audio = new Audio(this.soundUrl);
      this.audio.currentTime = 0;
        this.audio.play();
    },
    methods: {
      playSound() {

      }
    }
  }
  </script>
  