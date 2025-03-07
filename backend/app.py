from flask import Flask, jsonify, send_file, Response
from flask_cors import CORS
import os
from googleapiclient.discovery import build
from dotenv import load_dotenv
import requests
from io import BytesIO

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
                fields="files(id, name, thumbnailLink, createdTime)",
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
            # Get the thumbnail link or create a fallback
            thumbnail = item.get("thumbnailLink")
            if not thumbnail:
                thumbnail = (
                    f"https://drive.google.com/thumbnail?id={item['id']}&sz=w320-h180"
                )

            clips.append(
                {
                    "id": item["id"],
                    "name": item["name"],
                    "thumbnail": thumbnail,
                    "created": item["createdTime"],
                    "download_link": download_link,
                    "stream_link": stream_link,
                }
            )

        return jsonify(clips)

    except Exception as e:
        print(f"Error: {str(e)}")  # Add this for debugging
        return jsonify({"error": str(e)}), 500


@app.route("/api/proxy-thumbnail/<file_id>", methods=["GET"])
def proxy_thumbnail(file_id):
    try:
        # Create a Google Drive thumbnail URL
        thumbnail_url = f"https://drive.google.com/thumbnail?id={file_id}&sz=w320-h180"

        # Add headers to mimic a browser request
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
            "Referer": "https://drive.google.com/",
        }

        # Fetch the thumbnail through your server (acting as a proxy)
        response = requests.get(thumbnail_url, headers=headers, stream=True)

        if response.status_code == 200:
            # Stream the response directly to the client
            def generate():
                for chunk in response.iter_content(chunk_size=4096):
                    yield chunk

            # Create a streaming response
            proxy_response = Response(
                generate(),
                content_type=response.headers.get("content-type", "image/jpeg"),
            )

            # Add cache headers
            proxy_response.headers["Cache-Control"] = "public, max-age=86400"

            # Add CORS headers
            proxy_response.headers["Access-Control-Allow-Origin"] = "*"
            proxy_response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
            proxy_response.headers["Access-Control-Allow-Headers"] = (
                "Origin, Accept, Content-Type, X-Requested-With"
            )

            return proxy_response
        else:
            print(f"Failed to fetch thumbnail: {response.status_code}")
            # Return a default image if thumbnail not available
            return send_file("static/default-thumbnail.jpg", mimetype="image/jpeg")

    except Exception as e:
        print(f"Error fetching thumbnail: {str(e)}")
        # Return a default image on error
        return send_file("static/default-thumbnail.jpg", mimetype="image/jpeg")


# Add a simple test route
@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "API is working!"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
