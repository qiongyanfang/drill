<template>
  <div class="badminton-court">
    <div class="court-wrapper">
      <!-- Court outline -->
      <div class="court-outline">
                 <!-- 3x3 Grid corners -->
         <div class="corners-grid">
           <div 
             v-for="(corner, index) in corners" 
             :key="index"
             class="corner"
             :class="{ 
               active: isCornerActive(corner.name),
               disabled: !corner.enabled
             }"
           >
                           <span class="corner-label">
                {{ props.numberMode ? (index + 1).toString() : (corner.name || `Corner ${index + 1}`) }}
              </span>
           </div>
         </div>
        
                 <!-- Court lines -->
         <div class="court-lines">
           <!-- Center line -->
           <div class="center-line"></div>
           
           <!-- Service lines -->
           <div class="service-line front-service"></div>
           <div class="service-line back-service"></div>
           
           <!-- Middle lines -->
           <div class="middle-line left-middle"></div>
           <div class="middle-line right-middle"></div>
         </div>
        
        <!-- Net -->
        <div class="net">
          <div class="net-posts">
            <div class="net-post left"></div>
            <div class="net-post right"></div>
          </div>
          <div class="net-mesh"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CornerData {
  name: string
  enabled: boolean
}

interface Props {
  selectedCorner: string
  isPlaying: boolean
  corners: CornerData[]
  numberMode: boolean
}

const props = defineProps<Props>()

const isCornerActive = (cornerName: string): boolean => {
  if (props.numberMode) {
    // In number mode, compare by index + 1
    const cornerIndex = props.corners.findIndex(corner => corner.name === cornerName)
    const cornerNumber = (cornerIndex + 1).toString()
    return props.selectedCorner === cornerNumber && props.isPlaying
  } else {
    return props.selectedCorner === cornerName && props.isPlaying
  }
}


</script>

<style scoped>
.badminton-court {
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
}

.court-wrapper {
  position: relative;
  width: 600px;
  height: 400px;
  transform: rotateX(10deg);
  transform-style: preserve-3d;
}

.court-outline {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #2E7D32, #388E3C);
  border: 4px solid #1B5E20;
  border-radius: 10px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 2px 10px rgba(255, 255, 255, 0.1);
}

.corners-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 25%;
  padding: 20px;
  z-index: 6;
}

.corner {
  width: 100%;
  height: 100%;
  border: 3px solid #1B5E20;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 60px;
  min-height: 60px;
}

.corner.active {
  background: linear-gradient(45deg, #FF9800, #F57C00);
  border-color: #E65100;
  box-shadow: 
    0 0 20px rgba(255, 152, 0, 0.6),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  animation: cornerPulse 1s infinite;
  transform: scale(1.1);
}

@keyframes cornerPulse {
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

.corner-label {
  font-size: 0.7rem;
  font-weight: bold;
  color: #1B5E20;
  text-align: center;
  line-height: 1.2;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.corner.active .corner-label {
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.corner.disabled {
  opacity: 0.3;
  background: rgba(128, 128, 128, 0.2);
  border-color: #999;
  cursor: not-allowed;
}

.corner.disabled .corner-label {
  color: #999;
  text-shadow: none;
}



.court-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
}

.center-line {
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  width: 2px;
  background: white;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}

.service-line {
  position: absolute;
  top: 20%;
  left: 0;
  right: 0;
  height: 2px;
  background: white;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}

.front-service {
  top: 20%;
  transform: translateY(-20%);
}

.back-service {
  top: 80%;
  transform: translateY(-80%);
}

.middle-line {
  position: absolute;
  top: 0;
  height: 100%;
  width: 2px;
  background: white;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);

  &.left-middle {
    left: 8%;
  }

  &.right-middle {
    right: 8%;
  }
}

.net {
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 60px;
  z-index: 10;
}

.net-posts {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

.net-post {
  width: 8px;
  height: 60px;
  background: linear-gradient(to bottom, #8D6E63, #5D4037);
  border-radius: 4px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.net-mesh {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 40px;
  background: repeating-linear-gradient(
    to bottom,
    #8D6E63 0px,
    #8D6E63 2px,
    transparent 2px,
    transparent 4px
  );
  box-shadow: 0 0 10px rgba(141, 110, 99, 0.5);
}

@media (max-width: 768px) {
  .court-wrapper {
    width: 400px;
    height: 300px;
  }
  
  .corners-grid {
    gap: 8px;
    padding: 15px;
  }
  
  .corner {
    min-width: 50px;
    min-height: 50px;
  }
  
  .corner-label {
    font-size: 0.6rem;
  }
}

@media (max-width: 480px) {
  .court-wrapper {
    width: 300px;
    height: 200px;
  }
  
  .corners-grid {
    gap: 5px;
    padding: 10px;
  }
  
  .corner {
    min-width: 35px;
    min-height: 35px;
  }
  
  .corner-label {
    font-size: 0.5rem;
  }
}
</style> 