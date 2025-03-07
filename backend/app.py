from flask import Flask, jsonify
from flask_cors import CORS
import os
from googleapiclient.discovery import build
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure CORS with explicit options
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)


def get_drive_service():
    # Using API key authentication
    api_key = os.getenv("GOOGLE_DRIVE_API_KEY")
    return build("drive", "v3", developerKey=api_key)


@app.route("/api/clips", methods=["GET"])
def get_clips():
    try:
        # Initialize the Drive API
        service = get_drive_service()

        # ID of the folder containing your Fortnite clips
        folder_id = os.getenv("GOOGLE_DRIVE_FOLDER_ID")

        # Query files in the specified folder
        query = (
            f"'{folder_id}' in parents and trashed=false and mimeType contains 'video/'"
        )
        results = (
            service.files()
            .list(
                q=query,
                pageSize=50,
                fields="files(id, name, webViewLink, thumbnailLink, createdTime)",
            )
            .execute()
        )

        items = results.get("files", [])

        clips = []
        for item in items:
            # Create a direct download link
            download_link = (
                f"https://drive.google.com/uc?export=download&id={item['id']}"
            )
            # Create a streaming link
            stream_link = f"https://drive.google.com/file/d/{item['id']}/preview"

            clips.append(
                {
                    "id": item["id"],
                    "name": item["name"],
                    "thumbnail": item.get("thumbnailLink", ""),
                    "created": item["createdTime"],
                    "download_link": download_link,
                    "stream_link": stream_link,
                }
            )

        return jsonify(clips)

    except Exception as e:
        print(f"Error: {str(e)}")  # Add this for debugging
        return jsonify({"error": str(e)}), 500


# Add a simple test route
@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "API is working!"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
