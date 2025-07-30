<template>
  <div class="container">
    <h1 class="title">🏸 Training Simulator</h1>
    
    <!-- Training Mode Selector -->
    <div class="training-mode-selector">
      <label class="mode-option">
        <input 
          type="radio" 
          v-model="trainingMode"
          value="court"
          :disabled="isIntervalRunning || isPlaying"
          class="mode-radio"
        />
        <span class="mode-text">🏸 Court Training</span>
      </label>
      <label class="mode-option">
        <input 
          type="radio" 
          v-model="trainingMode"
          value="body"
          :disabled="isIntervalRunning || isPlaying"
          class="mode-radio"
        />
        <span class="mode-text">👤 Body Training</span>
      </label>
    </div>
    
         <div class="interval-controls">
       <div class="interval-input-group">
         <label for="interval-time">Interval Time (milliseconds):</label>
         <input 
           id="interval-time"
           v-model.number="intervalTime" 
           type="number" 
           min="100" 
           max="60000"
           step="100"
           :disabled="isIntervalRunning"
           class="interval-input"
         />
       </div>
       
                 <div class="corner-customization">
           <h3 @click="toggleCustomizationVisibility" class="customization-header">
             {{ trainingMode === 'court' ? 'Corner Configuration' : 'Body Part Configuration' }}
             <span class="toggle-icon">{{ isCustomizationVisible ? '▲' : '▼' }}</span>
           </h3>
          
          <!-- Display Mode Toggle -->
          <div class="display-mode-toggle">
            <label class="mode-label">
              <input 
                type="checkbox" 
                v-model="numberMode"
                :disabled="isIntervalRunning || isPlaying"
                class="mode-checkbox"
              />
              <span class="mode-text">Number Mode</span>
            </label>
          </div>
                     <div v-if="isCustomizationVisible" class="corner-inputs">
             <!-- Court Configuration -->
             <div v-if="trainingMode === 'court'" class="corner-input-group" v-for="(corner, index) in customCorners" :key="`corner-${index}`">
               <div class="corner-controls">
                 <input 
                   :id="`corner-toggle-${index}`"
                   type="checkbox"
                   :checked="corner.enabled"
                   @change="toggleCorner(index)"
                   :disabled="isIntervalRunning || isPlaying"
                   class="corner-toggle"
                 />
                 <label :for="`corner-toggle-${index}`" class="corner-toggle-label">
                   {{ corner.enabled ? '✓' : '✗' }} {{ corner.name }}
                 </label>
               </div>
               <input 
                 :id="`corner-${index}`"
                 v-model="corner.name"
                 type="text"
                 :disabled="isIntervalRunning || isPlaying"
                 class="corner-input"
                 placeholder="Enter corner name"
               />
             </div>
             
             <!-- Body Part Configuration -->
             <div v-if="trainingMode === 'body'" class="corner-input-group" v-for="(part, index) in customBodyParts" :key="`body-${index}`">
               <div class="corner-controls">
                 <input 
                   :id="`body-toggle-${index}`"
                   type="checkbox"
                   :checked="part.enabled"
                   @change="toggleBodyPart(index)"
                   :disabled="isIntervalRunning || isPlaying"
                   class="corner-toggle"
                 />
                 <label :for="`body-toggle-${index}`" class="corner-toggle-label">
                   {{ part.enabled ? '✓' : '✗' }} {{ part.name }}
                 </label>
               </div>
               <input 
                 :id="`body-${index}`"
                 v-model="part.name"
                 type="text"
                 :disabled="isIntervalRunning || isPlaying"
                 class="corner-input"
                 placeholder="Enter body part name"
               />
             </div>
           </div>
                     <div v-if="isCustomizationVisible" class="corner-actions">
             <!-- Court Actions -->
             <div v-if="trainingMode === 'court'">
               <button 
                 @click="resetToDefaultCorners" 
                 :disabled="isIntervalRunning || isPlaying"
                 class="btn btn-secondary"
               >
                 Reset Names
               </button>
               <button 
                 @click="enableAllCorners" 
                 :disabled="isIntervalRunning || isPlaying"
                 class="btn btn-secondary"
               >
                 Enable All
               </button>
               <button 
                 @click="disableAllCorners" 
                 :disabled="isIntervalRunning || isPlaying"
                 class="btn btn-secondary"
               >
                 Disable All
               </button>
             </div>
             
             <!-- Body Part Actions -->
             <div v-if="trainingMode === 'body'">
               <button 
                 @click="resetToDefaultBodyParts" 
                 :disabled="isIntervalRunning || isPlaying"
                 class="btn btn-secondary"
               >
                 Reset Names
               </button>
               <button 
                 @click="enableAllBodyParts" 
                 :disabled="isIntervalRunning || isPlaying"
                 class="btn btn-secondary"
               >
                 Enable All
               </button>
               <button 
                 @click="disableAllBodyParts" 
                 :disabled="isIntervalRunning || isPlaying"
                 class="btn btn-secondary"
               >
                 Disable All
               </button>
             </div>
           </div>
        </div>
      
      <div class="interval-buttons">
          <div>    <button 
           @click="startInterval" 
           :disabled="isIntervalRunning || intervalTime < 100"
           class="btn btn-success"
         >
          Start
        </button>
        
        <button 
          @click="stopInterval" 
          :disabled="!isIntervalRunning"
          class="btn btn-danger"
        >
          Stop
        </button>
        </div>
        <div class="keyboard-hint">
          💡 Press <kbd>Space</kbd> to start/stop
        </div>
      </div>
      
             <div v-if="isIntervalRunning" class="interval-status">
         <div class="timer-display">
           Next corner in: {{ formatTime(timeRemaining) }}
         </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>
    </div>
         <div v-if="selectedCorner" class="selected-corner">
       Selected {{ trainingMode === 'court' ? 'Corner' : 'Body Part' }}: {{ selectedCorner }}
     </div>

          <div class="court-container">
                <BadmintonCourt 
           v-if="trainingMode === 'court'"
           :selectedCorner="selectedCorner"
           :isPlaying="isPlaying"
           :corners="customCorners"
           :numberMode="numberMode"
         />
         <HumanBody 
           v-if="trainingMode === 'body'"
           :selectedPart="selectedCorner"
           :isPlaying="isPlaying"
           :bodyParts="customBodyParts"
           :numberMode="numberMode"
         />
      </div>

    <div v-if="audioStatus" :class="['audio-status', audioStatus.type]">
      {{ audioStatus.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from 'vue'
import BadmintonCourt from './components/BadmintonCourt.vue'
import HumanBody from './components/HumanBody.vue'
import { useAudioPlayer } from './composables/useAudioPlayer'

const selectedCorner = ref<string>('')
const isPlaying = ref(false)
const audioStatus = ref<{ type: 'playing' | 'error', message: string } | null>(null)

// Interval timer state
const intervalTime = ref(1000) // Default to 5 seconds (5000ms)
const isIntervalRunning = ref(false)
const timeRemaining = ref(0)
const intervalId = ref<number | null>(null)
const timerId = ref<number | null>(null)

const { playCornerAudio, stopAudio: stopAudioPlayer } = useAudioPlayer()

const isCustomizationVisible = ref(false)
const numberMode = ref(false)
const trainingMode = ref<'court' | 'body'>('court')

const toggleCustomizationVisibility = () => {
  isCustomizationVisible.value = !isCustomizationVisible.value
}

const defaultCorners = [
  'Front Left',
  'Front Center',
  'Front Right',
  'Mid Left',
  'Mid Center',
  'Mid Right',
  'Back Left',
  'Back Center',
  'Back Right',
]

const defaultBodyParts = [
  'Left Shoulder',
  'Right Shoulder',
  'Left Hip',
  'Right Hip',
  'Left Knee',
  'Right Knee',
]

interface CornerData {
  name: string
  enabled: boolean
}

interface BodyPartData {
  name: string
  enabled: boolean
}

const customCorners = ref<CornerData[]>([
  { name: 'Front Left', enabled: true },
  { name: 'Front Center', enabled: true },
  { name: 'Front Right', enabled: true },
  { name: 'Mid Left', enabled: true },
  { name: 'Mid Center', enabled: true },
  { name: 'Mid Right', enabled: true },
  { name: 'Back Left', enabled: true },
  { name: 'Back Center', enabled: true },
  { name: 'Back Right', enabled: true },
])

const customBodyParts = ref<BodyPartData[]>([
  { name: 'Left Shoulder', enabled: true },
  { name: 'Right Shoulder', enabled: true },
  { name: 'Left Hip', enabled: true },
  { name: 'Right Hip', enabled: true },
  { name: 'Left Knee', enabled: true },
  { name: 'Right Knee', enabled: true },
])

const corners = computed(() => customCorners.value.filter(corner => corner.enabled).map(corner => corner.name))
const bodyParts = computed(() => customBodyParts.value.filter(part => part.enabled).map(part => part.name))

const progressPercentage = computed(() => {
  if (intervalTime.value === 0) return 0
  return ((intervalTime.value - timeRemaining.value) / intervalTime.value) * 100
})

const formatTime = (ms: number): string => {
  if (ms >= 1000) {
    const seconds = Math.floor(ms / 1000)
    const remainingMs = ms % 1000
    if (remainingMs === 0) {
      return `${seconds}s`
    } else {
      return `${seconds}.${Math.floor(remainingMs / 100)}s`
    }
  } else {
    return `${ms}ms`
  }
}

const selectRandomCorner = async () => {
  try {
    isPlaying.value = true
    audioStatus.value = null
    
    // Select random corner or body part based on training mode
    if (trainingMode.value === 'court') {
      const availableCorners = corners.value
      if (availableCorners.length === 0) {
        throw new Error('No corners available')
      }
      
      const randomIndex = Math.floor(Math.random() * availableCorners.length)
      const selectedCornerName = availableCorners[randomIndex]
      
      // In number mode, find the corner index and use the number
      if (numberMode.value) {
        const cornerIndex = customCorners.value.findIndex(corner => corner.name === selectedCornerName)
        selectedCorner.value = cornerIndex !== -1 ? (cornerIndex + 1).toString() : selectedCornerName
      } else {
        selectedCorner.value = selectedCornerName
      }
    } else {
      const availableBodyParts = bodyParts.value
      if (availableBodyParts.length === 0) {
        throw new Error('No body parts available')
      }
      
      const randomIndex = Math.floor(Math.random() * availableBodyParts.length)
      const selectedBodyPartName = availableBodyParts[randomIndex]
      
      // In number mode, find the body part index and use the number
      if (numberMode.value) {
        const bodyPartIndex = customBodyParts.value.findIndex(part => part.name === selectedBodyPartName)
        selectedCorner.value = bodyPartIndex !== -1 ? (bodyPartIndex + 1).toString() : selectedBodyPartName
      } else {
        selectedCorner.value = selectedBodyPartName
      }
    }
    
    // Play audio for the selected corner
    await playCornerAudio(selectedCorner.value)
    
    audioStatus.value = {
      type: 'playing',
      message: `Playing audio for ${selectedCorner.value} corner`
    }
    
    // Reset after audio finishes
    setTimeout(() => {
      isPlaying.value = false
      audioStatus.value = null
    }, 3000)
    
  } catch (error) {
    console.error('Error playing audio:', error)
    isPlaying.value = false
    audioStatus.value = {
      type: 'error',
      message: 'Failed to play audio. Please check your browser settings.'
    }
  }
}

const resetToDefaultCorners = () => {
  customCorners.value = defaultCorners.map(name => ({ name, enabled: true }))
}

const resetToDefaultBodyParts = () => {
  customBodyParts.value = defaultBodyParts.map(name => ({ name, enabled: true }))
}

const toggleCorner = (index: number) => {
  customCorners.value[index].enabled = !customCorners.value[index].enabled
}

const enableAllCorners = () => {
  customCorners.value.forEach(corner => corner.enabled = true)
}

const disableAllCorners = () => {
  customCorners.value.forEach(corner => corner.enabled = false)
}

const toggleBodyPart = (index: number) => {
  customBodyParts.value[index].enabled = !customBodyParts.value[index].enabled
}

const enableAllBodyParts = () => {
  customBodyParts.value.forEach(part => part.enabled = true)
}

const disableAllBodyParts = () => {
  customBodyParts.value.forEach(part => part.enabled = false)
}

const stopAudio = () => {
  stopAudioPlayer()
  isPlaying.value = false
  audioStatus.value = null
}

const startInterval = () => {
  if (intervalTime.value < 100) return
  
  isIntervalRunning.value = true
  timeRemaining.value = intervalTime.value
  
  const runInterval = () => {
    if (!isIntervalRunning.value) return
    
    selectRandomCorner()
    
    // Start countdown timer
    timeRemaining.value = intervalTime.value
    
    const countdown = () => {
      if (!isIntervalRunning.value) return
      
      timeRemaining.value -= 100 // Update every 100ms for smoother display
      
      if (timeRemaining.value <= 0) {
        // Time to select next corner
        runInterval()
      } else {
        timerId.value = window.setTimeout(countdown, 100)
      }
    }
    
    timerId.value = window.setTimeout(countdown, 100)
  }
  
  // Start the first interval immediately
  runInterval()
}

const stopInterval = () => {
  isIntervalRunning.value = false
  
  if (timerId.value) {
    clearTimeout(timerId.value)
    timerId.value = null
  }
  
  if (intervalId.value) {
    clearInterval(intervalId.value)
    intervalId.value = null
  }
  
  timeRemaining.value = 0
}

// Cleanup on component unmount
onUnmounted(() => {
  stopInterval()
  // Remove keyboard event listener
  document.removeEventListener('keydown', handleKeydown)
})

// Add keyboard event listener for space bar control
const handleKeydown = (event: KeyboardEvent) => {
  // Only handle space bar key
  if (event.code === 'Space') {
    event.preventDefault() // Prevent page scrolling
    
    // Toggle interval based on current state
    if (isIntervalRunning.value) {
      stopInterval()
    } else {
      // Only start if we have a valid interval time and at least one target enabled
      const hasEnabledTargets = trainingMode.value === 'court' 
        ? corners.value.length > 0 
        : bodyParts.value.length > 0
      
      if (intervalTime.value >= 100 && hasEnabledTargets) {
        startInterval()
      }
    }
  }
}

// Add keyboard event listener when component mounts
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})
</script> 