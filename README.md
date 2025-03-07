# Fortnite Clips Website

A web application to showcase Fortnite gameplay clips using React, Flask, and Google Drive API.

## Project Structure

- **Frontend**: React application with styled-components and framer-motion
- **Backend**: Flask API that connects to Google Drive

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file with your Google Drive API credentials:
   ```
   GOOGLE_DRIVE_API_KEY=your_api_key_here
   GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
   ```

6. Run the Flask application:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the React application:
   ```
   npm start
   ```

## Features

- Display Fortnite clips from Google Drive
- Smooth animations and transitions
- Video playback with custom player
- Responsive design

## Technologies Used

- React
- Flask
- Google Drive API
- styled-components
- framer-motion
