# Time Tracker & Productivity Analytics Chrome Extension

This project is a Chrome extension that tracks the time you spend on different websites, classifies them as productive or unproductive, and provides productivity analytics via a dashboard. All data is stored in a Node.js backend.

## Features
- Tracks time spent on each website
- Classifies sites as productive/unproductive
- Backend for data storage and analytics
- Dashboard for weekly productivity reports

## Folders
- `extension/` — Chrome extension source code
- `backend/` — Node.js/Express backend

## Getting Started
1. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
2. Start the backend server:
   ```
   node index.js
   ```
3. Load the `extension/` folder as an unpacked extension in Chrome.

## Customization
- Update `background.js` and `content.js` to refine tracking logic.
- Update backend logic in `backend/index.js` as needed.

---

For internship completion, this project demonstrates a full-stack Chrome extension with analytics and reporting capabilities.
