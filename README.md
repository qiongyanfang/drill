# 🏸 Badminton Court Simulator

A Vue.js TypeScript application that simulates a badminton court and plays audio for randomly selected corners. This project is perfect for badminton training drills and practice sessions.

## Features

- **Visual Badminton Court**: Beautiful 3D-style court representation with realistic design
- **Random Corner Selection**: Click a button to randomly select one of the four corners
- **Continuous Mode**: Set an interval timer for automatic continuous corner selection
- **Audio Feedback**: Text-to-speech announces the selected corner name
- **Interactive UI**: Modern, responsive design with smooth animations
- **Real-time Feedback**: Visual highlighting of the selected corner with pulsing animation
- **Timer Display**: Visual countdown timer and progress bar for continuous mode
- **Corner Configuration**: Enable/disable and rename corners in a 3x3 grid layout for different training scenarios
- **Number Mode**: Display corners as numbers (1-9) instead of text names for a cleaner interface
- **Body Training Mode**: Switch to human body training with 6 body parts (shoulders, hips, knees)

## Training Modes

### Court Training Layout

The application features nine corners in a 3x3 grid:
- **Front Left** - Top left corner
- **Front Right** - Top right corner  
- **Back Left** - Bottom left corner
- **Back Right** - Bottom right corner
- **Center Front** - Top center position
- **Center Back** - Bottom center position
- **Mid Left** - Left center position
- **Mid Right** - Right center position
- **Center** - Center position

### Body Training Layout

The application features six body parts in a 2x3 grid:
- **Left Shoulder** - Top left position
- **Right Shoulder** - Top right position
- **Left Hip** - Middle left position
- **Right Hip** - Middle right position
- **Left Knee** - Bottom left position
- **Right Knee** - Bottom right position

## Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Web Speech API** - Browser-based text-to-speech functionality

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will open in your browser at `http://localhost:3000`

### Building for Production

Build the project for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

### Manual Mode
1. **Start the Application**: Run the development server and open in your browser
2. **Choose Training Mode**: Select between "Court Training" or "Body Training"
3. **Select a Target**: Click the "Select Random Corner" button (works for both modes)
4. **Listen to Audio**: The application will announce the selected target name
5. **Visual Feedback**: The selected target will be highlighted with an orange pulsing animation
6. **Stop Audio**: Use the "Stop Audio" button to stop the current audio playback

### Continuous Mode
1. **Set Interval Time**: Enter the desired interval time in milliseconds (100-60000ms, e.g., 5000ms = 5 seconds)
2. **Start Continuous Mode**: Click "Start Continuous Mode" to begin automatic corner selection
3. **Monitor Progress**: Watch the countdown timer and progress bar
4. **Stop Continuous Mode**: Click "Stop Continuous Mode" to end the automatic selection
5. **Audio Feedback**: Each selected corner will be announced with text-to-speech

### Configuration
1. **Choose Training Mode**: Switch between Court Training and Body Training modes
2. **Enable/Disable Targets**: Use checkboxes to enable or disable specific targets
3. **Rename Targets**: Edit the name fields to customize target labels
4. **Enable All**: Click "Enable All" to activate all targets
5. **Disable All**: Click "Disable All" to deactivate all targets
6. **Reset Names**: Click "Reset Names" to restore default target names
7. **Grid Layouts**: 
   - Court: 9 corners in a 3x3 grid format
   - Body: 6 body parts in a 2x3 grid format

### Number Mode
1. **Toggle Number Mode**: Check the "Number Mode" checkbox to display targets as numbers
2. **Clean Interface**: Numbers provide a minimal, distraction-free display
3. **Audio Announcements**: Target numbers are announced when selected
4. **Visual Highlighting**: Selected numbers are highlighted with the same orange animation
5. **Easy Switching**: Toggle between text names and numbers at any time
6. **Mode Specific**: 
   - Court: Numbers 1-9 for corners
   - Body: Numbers 1-6 for body parts

## Browser Compatibility

This application uses the Web Speech API for text-to-speech functionality. It works best in:
- Chrome/Chromium browsers
- Edge (Chromium-based)
- Safari (limited support)
- Firefox (limited support)

## Project Structure

```
src/
├── components/
│   ├── BadmintonCourt.vue    # Visual court component
│   └── HumanBody.vue         # Visual human body component
├── composables/
│   └── useAudioPlayer.ts     # Audio playback logic
├── App.vue                   # Main application component
├── main.ts                   # Application entry point
├── style.css                 # Global styles
└── vite-env.d.ts            # TypeScript declarations
```

## Customization

### Adding New Corners

To add more corners, modify the `corners` array in `App.vue`:

```typescript
const corners = [
  'Front Left',
  'Front Right', 
  'Back Left',
  'Back Right',
  'Center Front',  // New corner
  'Center Back'    // New corner
]
```

### Modifying Audio Settings

Adjust speech settings in `useAudioPlayer.ts`:

```typescript
utterance.rate = 0.8    // Speech rate (0.1 to 10)
utterance.pitch = 1.0   // Pitch (0 to 2)
utterance.volume = 1.0  // Volume (0 to 1)
```

### Styling Changes

The court appearance can be customized by modifying the CSS in `BadmintonCourt.vue` and `style.css`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please check the browser console for error messages and ensure your browser supports the Web Speech API. 