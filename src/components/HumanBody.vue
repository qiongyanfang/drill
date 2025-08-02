<template>
  <div class="human-body">
    <div class="body-wrapper">
      <!-- Human body outline -->
      <div class="body-outline">
        <!-- Body parts grid -->
        <div class="body-parts-grid">
          <div 
            v-for="(part, index) in bodyParts" 
            :key="index"
            class="body-part"
            :class="{ 
              active: isPartActive(part.name),
              disabled: !part.enabled
            }"
          >
            <span class="part-label">
              {{ part.name || `Part ${index + 1}` }}
            </span>
          </div>
        </div>
        
        <!-- Body outline lines -->
        <div class="body-lines">
          <!-- Head outline -->
          <div class="head-outline"></div>
          
          <!-- Torso outline -->
          <div class="torso-outline"></div>
          
          <!-- Arms outline -->
          <div class="arm left-arm"></div>
          <div class="arm right-arm"></div>
          
          <!-- Legs outline -->
          <div class="leg left-leg"></div>
          <div class="leg right-leg"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BodyPartData {
  name: string
  enabled: boolean
}

interface Props {
  selectedPart: string
  isPlaying: boolean
  bodyParts: BodyPartData[]
}

const props = defineProps<Props>()

const isPartActive = (partName: string): boolean => {
  return props.selectedPart === partName && props.isPlaying
}
</script>

<style scoped>
.human-body {
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
}

.body-wrapper {
  position: relative;
  width: 400px;
  height: 600px;
  transform: rotateX(5deg);
  transform-style: preserve-3d;
}

.body-outline {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #FFE4B5, #F5DEB3);
  border: 4px solid #DEB887;
  border-radius: 50px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 2px 10px rgba(255, 255, 255, 0.2);
}

.body-parts-grid {
  position: absolute;
  top: 15%;
  left: 0;
  right: 0;
  bottom: 20%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 15%;
  padding: 40px;
  z-index: 6;
}

.body-part {
  width: 100%;
  height: 100%;
  border: 3px solid #DEB887;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 50px;
  min-height: 50px;
  position: relative;
}

/* Position body parts specifically */
.body-part:nth-child(1) { /* Left Shoulder */
  grid-column: 1;
  grid-row: 1;
  top: -10px;
  left: -10px;
}

.body-part:nth-child(2) { /* Right Shoulder */
  grid-column: 2;
  grid-row: 1;
  top: -10px;
  right: -10px;
}

.body-part:nth-child(3) { /* Left Hip */
  grid-column: 1;
  grid-row: 2;
  bottom: 10px;
  left: -10px;
}

.body-part:nth-child(4) { /* Right Hip */
  grid-column: 2;
  grid-row: 2;
  bottom: 10px;
  right: -10px;
}

.body-part:nth-child(5) { /* Left Knee */
  grid-column: 1;
  grid-row: 3;
  bottom: -10px;
  left: -10px;
}

.body-part:nth-child(6) { /* Right Knee */
  grid-column: 2;
  grid-row: 3;
  bottom: -10px;
  right: -10px;
}

.body-part.active {
  background: linear-gradient(45deg, #FF9800, #F57C00);
  border-color: #E65100;
  box-shadow: 
    0 0 20px rgba(255, 152, 0, 0.6),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  animation: partPulse 1s infinite;
  transform: scale(1.1);
}

@keyframes partPulse {
  0%, 100% { 
    box-shadow: 
      0 0 20px rgba(255, 152, 0, 0.6),
      inset 0 2px 10px rgba(255, 255, 255, 0.3);
  }
  50% { 
    box-shadow: 
      0 0 30px rgba(255, 152, 0, 0.8),
      inset 0 2px 10px rgba(255, 255, 255, 0.5);
  }
}

.part-label {
  font-size: 0.8rem;
  font-weight: bold;
  color: #6d3107;
  text-align: center;
  line-height: 1.2;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.body-part.active .part-label {
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.body-part.disabled {
  opacity: 0.3;
  background: rgba(128, 128, 128, 0.2);
  border-color: #999;
  cursor: not-allowed;
}

.body-part.disabled .part-label {
  color: #999;
  text-shadow: none;
}

.body-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
}

.head-outline {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  border: 3px solid #DEB887;
  border-radius: 50%;
  background: rgba(255, 228, 181, 0.3);
}

.torso-outline {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 200px;
  border: 3px solid #DEB887;
  border-radius: 60px;
  background: rgba(255, 228, 181, 0.3);
}

.arm {
  position: absolute;
  width: 20px;
  height: 120px;
  border: 2px solid #DEB887;
  border-radius: 10px;
  background: rgba(255, 228, 181, 0.3);
}

.left-arm {
  top: 25%;
  left: 25%;
  transform: rotate(15deg);
}

.right-arm {
  top: 25%;
  right: 25%;
  transform: rotate(-15deg);
}

.leg {
  position: absolute;
  width: 35px;
  height: 200px;
  border: 2px solid #DEB887;
  border-radius: 12px;
  background: rgba(255, 228, 181, 0.3);
}

.left-leg {
  bottom: 15%;
  left: 35%;
  transform: rotate(5deg);
}

.right-leg {
  bottom: 15%;
  right: 35%;
  transform: rotate(-5deg);
}

@media (max-width: 768px) {
  .body-wrapper {
    width: 300px;
    height: 450px;
  }
  
  .body-parts-grid {
    gap: 10%;
    padding: 30px;
  }
  
  .body-part {
    min-width: 40px;
    min-height: 40px;
  }
  
  .part-label {
    font-size: 0.6rem;
  }
  
  .head-outline {
    width: 60px;
    height: 60px;
  }
  
  .torso-outline {
    width: 90px;
    height: 150px;
  }
  
  .arm {
    width: 15px;
    height: 90px;
  }
  
  .leg {
    width: 20px;
    height: 130px;
  }
}

@media (max-width: 480px) {
  .body-wrapper {
    width: 250px;
    height: 375px;
  }
  
  .body-parts-grid {
    gap: 8%;
    padding: 25px;
  }
  
  .body-part {
    min-width: 35px;
    min-height: 35px;
  }
  
  .part-label {
    font-size: 0.8rem;
  }
  
  .head-outline {
    width: 50px;
    height: 50px;
  }
  
  .torso-outline {
    width: 75px;
    height: 125px;
  }
  
  .arm {
    width: 12px;
    height: 75px;
  }
  
  .leg {
    width: 16px;
    height: 150px;
  }
}
</style> 