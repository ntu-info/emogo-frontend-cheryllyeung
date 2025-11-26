[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/1M59WghA)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21786659&assignment_repo_type=AssignmentRepo)

## App URI
https://expo.dev/accounts/cheryllyeung/projects/expo-router-mwe/builds/e999c83d-7030-45e6-900b-4cdc823eccd7

# EmoGo - Experience Sampling App

A multimodal emotion tracking app that collects structured and unstructured data through experience sampling methodology.

## Features

### Multimodal Data Collection

1. **Structured Active Data - Emotion Questionnaire**
   - 8 emotion options with intensity rating (1-10)
   - Optional text notes
   - Recorded on user interaction

2. **Unstructured Active Data - 1-Second Vlog**
   - Front-facing camera recording
   - Automatic 1-second duration
   - Saved to device media library

3. **Structured Passive Data - GPS Location**
   - Automatic location capture on each record
   - Latitude and longitude coordinates
   - Requires location permissions

4. **Active Data - Daily Notifications**
   - 3 scheduled notifications per day (10:00, 15:00, 20:00)
   - Prompts users to record emotions
   - Supports experience sampling methodology

## Tech Stack

- **Framework**: React Native with Expo Router
- **Database**: SQLite (expo-sqlite)
- **Notifications**: expo-notifications
- **Camera**: expo-camera
- **Location**: expo-location
- **File System**: expo-file-system
- **Media Library**: expo-media-library
- **Sharing**: expo-sharing

## Installation

```bash
npm install
```

## Running the App

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## Data Export

The app includes a data export feature that creates a JSON file containing:
- All emotion records
- Location data (if available)
- Video recording status
- Timestamps
- Export metadata

Export location: Device's document directory or shared via system share sheet

## Database Schema

```sql
CREATE TABLE emotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  emotion_name TEXT NOT NULL,
  emotion_emoji TEXT NOT NULL,
  emotion_color TEXT NOT NULL,
  intensity INTEGER NOT NULL,
  note TEXT,
  latitude REAL,
  longitude REAL,
  video_path TEXT,
  timestamp TEXT NOT NULL
);
```

## Permissions Required

- **Camera**: For recording 1-second vlogs
- **Microphone**: For audio in vlogs
- **Location**: For GPS coordinates
- **Media Library**: For saving video files
- **Notifications**: For daily reminders

## Project Structure

```
emogo-frontend/
├── app/
│   ├── (tabs)/
│   │   ├── index.js          # Emotion tracking screen
│   │   ├── settings.js       # History & export screen
│   │   └── _layout.js        # Tab navigation
│   ├── _layout.js            # Root layout
│   └── index.js              # Entry redirect
├── components/
│   └── VlogRecorder.js       # Camera recording component
├── utils/
│   ├── database.js           # SQLite operations
│   ├── notifications.js      # Notification scheduling
│   └── location.js           # GPS utilities
├── app.json                  # Expo configuration
└── package.json              # Dependencies
```

## Deployment

### For Homework Assignment

Follow these steps to deploy for the assignment:

1. **Configure EAS Build** (first time only):
   ```bash
   eas build:configure
   ```

2. **Build Android Preview APK**:
   ```bash
   eas build --platform android --profile preview
   ```
   This will generate an APK file that can be easily shared and installed (~15 mins build time).

3. **Get the Sharable Link**:
   - Visit your project page on Expo website
   - Click the [Install] button on your build
   - Copy the `https://expo.dev/...` link
   - Add this link to the "App URI" section at the top of this README

### For Your Own Device Testing

**Option 1: Expo Go (Quick Testing)**
```bash
npm start
```
Then scan the QR code with Expo Go app.

**Option 2: Development Build (Full Features)**
```bash
# For iPhone
eas build --platform ios --profile preview

# For Android
eas build --platform android --profile preview
```

## Submission Checklist

- [x] Expo packages installed (notifications, sqlite, camera, location, file-system, media-library, sharing)
- [x] Daily 3x notifications implemented
- [x] Emotion questionnaire (structured active data)
- [x] 1-second vlog recording (unstructured active data)
- [x] GPS location capture (structured passive data)
- [x] SQLite database for data storage
- [x] Data export functionality
- [ ] At least 3 data records with >12 hours interval (needs real device testing)
- [ ] Android APK built and link added to README
- [ ] GitHub repository with source code
- [ ] H-AI conversation logs included

## Testing Data Collection

To test the app properly:
1. Install the app on your device (via Expo Go or development build)
2. Record first emotion with all features (emotion, intensity, note, vlog, location)
3. Wait 12+ hours
4. Record second emotion
5. Wait 12+ hours
6. Record third emotion
7. Export data and save to `data/` folder
8. Verify all records are captured with proper timestamps

## Export Data Format

```json
{
  "exportDate": "2025-11-26T...",
  "totalRecords": 3,
  "emotions": [
    {
      "id": 1,
      "emotion": "Happy",
      "emoji": "😊",
      "intensity": 8,
      "note": "Great day!",
      "location": {
        "latitude": 25.0330,
        "longitude": 121.5654
      },
      "hasVideo": true,
      "timestamp": "2025-11-26T10:00:00.000Z"
    }
  ]
}
```

## Development Notes

- App uses SQLite for reliable local storage
- Notifications are scheduled daily at fixed times
- Video recording automatically stops after 1 second
- Location is captured passively when saving emotions
- All data is exportable as JSON

## License

MIT
