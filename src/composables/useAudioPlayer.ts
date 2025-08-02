import { ref } from 'vue'

export function useAudioPlayer() {
  const isPlaying = ref(false)
  const currentUtterance = ref<SpeechSynthesisUtterance | null>(null)

  const playCornerAudio = (cornerName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if speech synthesis is supported
      if (!window.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      // Stop any currently playing audio
      stopAudio()

      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(cornerName)
      
      // Configure speech settings
      utterance.rate = 1.2 // Slightly faster for speed
      utterance.pitch = 1.2
      utterance.volume = 1.0
      
      // Try to use a female voice for better clarity
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Female')
      ) || voices.find(voice => voice.lang.includes('en'))
      
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      // Set up event handlers
      utterance.onstart = () => {
        isPlaying.value = true
        currentUtterance.value = utterance
      }

      utterance.onend = () => {
        isPlaying.value = false
        currentUtterance.value = null
        resolve()
      }

      utterance.onerror = (event) => {
        isPlaying.value = false
        currentUtterance.value = null
        reject(new Error(`Speech synthesis error: ${event.error}`))
      }

      // Start speaking
      window.speechSynthesis.speak(utterance)
    })
  }

  const stopAudio = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    isPlaying.value = false
    currentUtterance.value = null
  }

  // Initialize voices when the page loads
  const initializeVoices = () => {
    if (window.speechSynthesis) {
      // Some browsers need a delay to load voices
      setTimeout(() => {
        window.speechSynthesis.getVoices()
      }, 100)
    }
  }

  // Call initialization
  initializeVoices()

  return {
    isPlaying,
    playCornerAudio,
    stopAudio
  }
} 