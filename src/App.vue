<template>
  <div class="container">
    <h1 class="title">🏸 Training Simulator</h1>

    <!-- Training Mode Selector -->
    <div class="training-mode-selector">
      <label class="mode-option">
        <input
          type="radio"
          v-model="trainingMode"
          value="body"
          :disabled="isIntervalRunning || isPlaying"
          class="mode-radio"
        />
        <span class="mode-text">👤 Body</span>
      </label>
      <label class="mode-option">
        <input
          type="radio"
          v-model="trainingMode"
          value="court"
          :disabled="isIntervalRunning || isPlaying"
          class="mode-radio"
        />
        <span class="mode-text">🏸 Court</span>
      </label>
    </div>
    <div class="controls-container">
      <div class="interval-controls"  v-show="!isIntervalRunning">
        <div class="interval-input-group">
          <label for="interval-time">Interval Time (ms):</label>
          <input
            id="interval-time"
            v-model.number="intervalTime"
            type="number"
            min="100"
            max="60000"
            step="100"
            :disabled="isIntervalRunning"
            class="interval-input"
            @keydown.up.prevent="intervalTime = Math.min(intervalTime + 100, 60000)"
            @keydown.down.prevent="intervalTime = Math.max(intervalTime - 100, 100)"
          />
        </div>
        <div class="interval-input-group">
          <label for="total-time">Total Time (minutes):</label>
          <input
            id="total-time"
            v-model.number="totalTimeMinutes"
            type="number"
            min="1"
            max="120"
            step="1"
            :disabled="isIntervalRunning"
            class="interval-input"
            @keydown.up.prevent="totalTimeMinutes = Math.min(totalTimeMinutes + 1, 120)"
            @keydown.down.prevent="totalTimeMinutes = Math.max(totalTimeMinutes - 1, 1)"
          />
        </div>
      </div>
      <!-- Display Mode Toggle -->
      <div class="display-mode-toggle" v-show="!isIntervalRunning">
        <label class="mode-label">
          <input
            type="checkbox"
            v-model="numberMode"
            :disabled="isIntervalRunning || isPlaying"
            class="mode-checkbox"
          />
          <span class="mode-text">Show {{ trainingMode === "court" ? "corners" : "body parts" }} as Numbers</span>
        </label>
      </div>
      <div class="corner-customization" v-show="!isIntervalRunning">
        <h3 @click="toggleCustomizationVisibility" class="customization-header">
          {{
            trainingMode === "court"
              ? "Corner Customzied Names"
              : "Body Part Customzied Names"
          }}
          <span class="toggle-icon">{{
            isCustomizationVisible ? "▲" : "▼"
          }}</span>
        </h3>
        <div v-if="isCustomizationVisible" class="corner-customization-content">
          <div v-if="isCustomizationVisible" class="corner-inputs" :class="{
            'court-mode': trainingMode === 'court',
            'body-mode': trainingMode === 'body'
          }">
            <!-- Combined Configuration -->
            <div
              v-for="(item, index) in trainingMode === 'court' ? customCorners : customBodyParts"
              :key="`item-${index}`"
              class="corner-input-group"
            >
              <div
                class="corner-controls"
              >
                <input
                  :id="`item-toggle-${index}`"
                  type="checkbox"
                  :checked="item.enabled"
                  @change="trainingMode === 'court' ? toggleCorner(index) : toggleBodyPart(index)"
                  :disabled="isIntervalRunning || isPlaying"
                  class="corner-toggle"
                />
                <label
                  :for="`item-toggle-${index}`"
                  class="corner-toggle-label"
                >
                  {{ item.enabled ? "✓" : "✗" }} {{ item.name }}
                </label>
              </div>
              <input
                :id="`item-${index}`"
                v-model="item.name"
                type="text"
                :disabled="isIntervalRunning || isPlaying"
                class="corner-input"
                placeholder="Enter name"
              />
            </div>
          </div>
          <div class="corner-actions">
            <button
              @click="trainingMode === 'court' ? resetToDefaultCorners() : resetToDefaultBodyParts()"
              :disabled="isIntervalRunning || isPlaying"
              class="btn btn-secondary"
            >
              {{ trainingMode === 'court' ? 'Use Default Names' : 'Reset Names' }}
            </button>
            <button
              @click="trainingMode === 'court' ? enableAllCorners() : enableAllBodyParts()"
              :disabled="isIntervalRunning || isPlaying"
              class="btn btn-secondary"
            >
              Enable All
            </button>
            <button
              @click="trainingMode === 'court' ? disableAllCorners() : disableAllBodyParts()"
              :disabled="isIntervalRunning || isPlaying"
              class="btn btn-secondary"
            >
              Disable All
            </button>
          </div>
        </div>
      </div>

      <div class="interval-buttons">
          <button
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
      <div v-show="false" class="keyboard-hint">💡 Press <kbd>Space</kbd> to start/stop</div>
    </div>

    <div class="court-container">
      <BadmintonCourt
        v-if="trainingMode === 'court'"
        :selectedCorner="selectedCorner"
        :isPlaying="isPlaying"
        :corners="customCorners"
       />
      <HumanBody
        v-if="trainingMode === 'body'"
        :selectedPart="selectedCorner"
        :isPlaying="isPlaying"
        :bodyParts="customBodyParts"
      />
    </div>
    <div v-if="selectedCorner" class="selected-corner">
      Selected {{ trainingMode === "court" ? "Corner" : "Body Part" }}:
      {{ selectedCorner }}
    </div>
         <div v-if="isIntervalRunning" class="interval-status">
       <div class="timer-display">
         <div>Next {{ trainingMode === "court" ? "corner" : "body part" }} in: {{ formatTime(timeRemaining) }}</div>
         <div>Total time remaining: {{ formatTotalTime(totalTimeRemaining) }}</div>
       </div>
       <div class="progress-bar">
         <div
           class="progress-fill"
           :style="{ width: progressPercentage + '%' }"
         ></div>
       </div>
       <div class="total-progress-bar">
         <div
           class="total-progress-fill"
           :style="{ width: totalProgressPercentage + '%' }"
         ></div>
       </div>
     </div>
    <div v-if="false && audioStatus" :class="['audio-status', audioStatus.type]">
      {{ audioStatus.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted, watch } from "vue";
import BadmintonCourt from "./components/BadmintonCourt.vue";
import HumanBody from "./components/HumanBody.vue";
import { useAudioPlayer } from "./composables/useAudioPlayer";

const selectedCorner = ref<string>("");
const isPlaying = ref(false);
const audioStatus = ref<{ type: "playing" | "error"; message: string } | null>(
  null
);

// Interval timer state
const intervalTime = ref(1000); // Default to 1 second
const totalTimeMinutes = ref(10); // Default to 10 minutes
const isIntervalRunning = ref(false);
const timeRemaining = ref(0);
const totalTimeRemaining = ref(0);
const intervalId = ref<number | null>(null);
const timerId = ref<number | null>(null);

const { playCornerAudio, stopAudio: stopAudioPlayer } = useAudioPlayer();

const isCustomizationVisible = ref(false);
const numberMode = ref(true);
const trainingMode = ref<"court" | "body">("body");

const toggleCustomizationVisibility = () => {
  isCustomizationVisible.value = !isCustomizationVisible.value;
};

const defaultCorners = [
  "Front Left",
  "Front Center",
  "Front Right",
  "Mid Left",
  "Mid Center",
  "Mid Right",
  "Back Left",
  "Back Center",
  "Back Right",
];

const defaultBodyParts = [
  "Left Shoulder",
  "Right Shoulder",
  "Left Hip",
  "Right Hip",
  "Left Knee",
  "Right Knee",
];

interface CornerData {
  name: string;
  enabled: boolean;
}

interface BodyPartData {
  name: string;
  enabled: boolean;
}

const customCorners = ref<CornerData[]>(defaultCorners.map((_name, index) => ({ name: (index + 1).toString(), enabled: true, index: index + 1 })));

const customBodyParts = ref<BodyPartData[]>(defaultBodyParts.map((_name, index) => ({ name: (index + 1).toString(), enabled: true, index: index + 1 })));

watch(numberMode, (newValue) => {
  if (newValue) {
    customCorners.value.forEach((corner, index) => {
      corner.name = (index + 1).toString();
    });
    customBodyParts.value.forEach((part, index) => {
      part.name = (index + 1).toString();
    });
  } else {
    customCorners.value = defaultCorners.map((name) => ({ name, enabled: true }));
    customBodyParts.value = defaultBodyParts.map((name) => ({ name, enabled: true }));
  }
});

const corners = computed(() =>
  customCorners.value
    .filter((corner) => corner.enabled)
    .map((corner) => corner.name)
);
const bodyParts = computed(() =>
  customBodyParts.value.filter((part) => part.enabled).map((part) => part.name)
);

const progressPercentage = computed(() => {
  if (intervalTime.value === 0) return 0;
  return (
    ((intervalTime.value - timeRemaining.value) / intervalTime.value) * 100
  );
});

const totalProgressPercentage = computed(() => {
  const totalTimeMs = totalTimeMinutes.value * 60 * 1000;
  if (totalTimeMs === 0) return 0;
  return ((totalTimeMs - totalTimeRemaining.value) / totalTimeMs) * 100;
});

const formatTime = (ms: number): string => {
  if (ms >= 1000) {
    const seconds = Math.floor(ms / 1000);
    const remainingMs = ms % 1000;
    if (remainingMs === 0) {
      return `${seconds}s`;
    } else {
      return `${seconds}.${Math.floor(remainingMs / 100)}s`;
    }
  } else {
    return `${ms}ms`;
  }
};

const formatTotalTime = (ms: number): string => {
  const minutes = Math.floor(ms / (60 * 1000));
  const seconds = Math.floor((ms % (60 * 1000)) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const randomStats = ref<{ [key: string]: number }>({});

const selectRandomCorner = async () => {
  try {
    isPlaying.value = true;
    audioStatus.value = null;

    // Determine available items and their corresponding custom list based on training mode
    const isCourtMode = trainingMode.value === "court";
    const availableItems = isCourtMode ? corners.value : bodyParts.value;
    const customList = isCourtMode ? customCorners.value : customBodyParts.value;

    if (availableItems.length === 0) {
      throw new Error(isCourtMode ? "No corners available" : "No body parts available");
    }

    // Use cryptographically secure random number generation for better randomness
    const randomIndex = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * availableItems.length);
    const selectedItemName = availableItems[randomIndex];

    randomStats.value[selectedItemName] = (randomStats.value[selectedItemName] ?? 0) + 1;
    // console.log("selectedItemName", { randomStats: randomStats.value });

    // In number mode, find the item index and use the number
    if (numberMode.value) {
      const itemIndex = customList.findIndex((item) => item.name === selectedItemName);
      selectedCorner.value = itemIndex !== -1 ? (itemIndex + 1).toString() : selectedItemName;
    } else {
      selectedCorner.value = selectedItemName;
    }

    // Play audio for the selected item
    await playCornerAudio(selectedCorner.value);

    audioStatus.value = {
      type: "playing",
      message: `Playing audio for ${selectedCorner.value} ${isCourtMode ? "corner" : "body part"}`,
    };

    // Reset after audio finishes
    setTimeout(() => {
      isPlaying.value = false;
      audioStatus.value = null;
    }, 3000);
  } catch (error) {
    console.error("Error playing audio:", error);
    isPlaying.value = false;
    audioStatus.value = {
      type: "error",
      message: "Failed to play audio. Please check your browser settings.",
    };
  }
};

const resetToDefaultCorners = () => {
  customCorners.value = defaultCorners.map((name) => ({ name, enabled: true }));
  numberMode.value = false;
};

const resetToDefaultBodyParts = () => {
  customBodyParts.value = defaultBodyParts.map((name) => ({
    name,
    enabled: true,
  }));
  numberMode.value = false;
};

const toggleCorner = (index: number) => {
  customCorners.value[index].enabled = !customCorners.value[index].enabled;
};

const enableAllCorners = () => {
  customCorners.value.forEach((corner) => (corner.enabled = true));
};

const disableAllCorners = () => {
  customCorners.value.forEach((corner) => (corner.enabled = false));
};

const toggleBodyPart = (index: number) => {
  customBodyParts.value[index].enabled = !customBodyParts.value[index].enabled;
};

const enableAllBodyParts = () => {
  customBodyParts.value.forEach((part) => (part.enabled = true));
};

const disableAllBodyParts = () => {
  customBodyParts.value.forEach((part) => (part.enabled = false));
};

const stopAudio = () => {
  stopAudioPlayer();
  isPlaying.value = false;
  audioStatus.value = null;
};

const startInterval = () => {
  if (intervalTime.value < 100) return;

  isIntervalRunning.value = true;
  timeRemaining.value = intervalTime.value;
  totalTimeRemaining.value = totalTimeMinutes.value * 60 * 1000; // Convert minutes to milliseconds

  const runInterval = () => {
    if (!isIntervalRunning.value) return;

    selectRandomCorner();

    // Start countdown timer
    timeRemaining.value = intervalTime.value;

    const countdown = () => {
      if (!isIntervalRunning.value) return;

      timeRemaining.value -= 100; // Update every 100ms for smoother display
      totalTimeRemaining.value -= 100; // Update total time remaining

      // Check if total time has been reached
      if (totalTimeRemaining.value <= 0) {
        stopInterval();
        return;
      }

      if (timeRemaining.value <= 0) {
        // Time to select next corner
        runInterval();
      } else {
        timerId.value = window.setTimeout(countdown, 100);
      }
    };

    timerId.value = window.setTimeout(countdown, 100);
  };

  // Start the first interval immediately
  runInterval();
};

const stopInterval = () => {
  isIntervalRunning.value = false;

  if (timerId.value) {
    clearTimeout(timerId.value);
    timerId.value = null;
  }

  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }

  timeRemaining.value = 0;
  totalTimeRemaining.value = 0;
};

// Cleanup on component unmount
onUnmounted(() => {
  stopInterval();
  // Remove keyboard event listener
  document.removeEventListener("keydown", handleKeydown);
});

// Add keyboard event listener for space bar control
const handleKeydown = (event: KeyboardEvent) => {
  // Only handle space bar key
  if (event.code === "Space") {
    event.preventDefault(); // Prevent page scrolling

    // Toggle interval based on current state
    if (isIntervalRunning.value) {
      stopInterval();
    } else {
      // Only start if we have a valid interval time and at least one target enabled
      const hasEnabledTargets =
        trainingMode.value === "court"
          ? corners.value.length > 0
          : bodyParts.value.length > 0;

      if (intervalTime.value >= 100 && hasEnabledTargets) {
        startInterval();
      }
    }
  }
};

// Add keyboard event listener when component mounts
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});
</script>
