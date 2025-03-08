from flask import Flask, jsonify, Response
from flask_cors import CORS
import os
import json
from googleapiclient.discovery import build
import requests
from io import BytesIO
import datetime

app = Flask(__name__)
CORS(app)


# Google Drive API setup
def get_drive_service():
    api_key = os.environ.get("GOOGLE_DRIVE_API_KEY")
    return build("drive", "v3", developerKey=api_key)


@app.route("/api/clips", methods=["GET"])
def get_clips():
    try:
        # Initialize the Drive API
        service = get_drive_service()

        # ID of the folder containing your Fortnite clips
        folder_id = os.environ.get("GOOGLE_DRIVE_FOLDER_ID")

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
        print(f"Error: {str(e)}")
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

        # Fetch the thumbnail
        response = requests.get(thumbnail_url, headers=headers)

        if response.status_code == 200:
            # Return the image data
            return Response(
                response.content,
                mimetype="image/jpeg",
                headers={"Cache-Control": "public, max-age=86400"},
            )
        else:
            # Return a default response for error
            return "Thumbnail not available", 404

    except Exception as e:
        print(f"Error fetching thumbnail: {str(e)}")
        return "Error fetching thumbnail", 500


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify(
        {
            "status": "ok",
            "message": "API is working",
            "env_vars": {
                "has_api_key": bool(os.environ.get("GOOGLE_DRIVE_API_KEY")),
                "has_folder_id": bool(os.environ.get("GOOGLE_DRIVE_FOLDER_ID")),
            },
        }
    )


# This is the handler for Vercel serverless functions
def handler(request):
    with app.test_client() as client:
        return client.open(
            path=request.path,
            method=request.method,
            headers={key: value for key, value in request.headers.items()},
            data=request.data,
            environ_base={"REMOTE_ADDR": request.headers.get("x-forwarded-for", "")},
        )


# For local development
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
