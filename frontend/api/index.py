from flask import Flask, jsonify, Response, request as flask_request
from flask_cors import CORS
import os
import json
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)


@app.route("/api/clips", methods=["GET"])
def get_clips():
    try:
        # Get API key and folder ID from environment variables
        api_key = os.environ.get("GOOGLE_DRIVE_API_KEY")
        folder_id = os.environ.get("GOOGLE_DRIVE_FOLDER_ID")

        if not api_key or not folder_id:
            return jsonify({"error": "Missing API key or folder ID"}), 500

        # Use direct HTTP request instead of Google API client
        url = f"https://www.googleapis.com/drive/v3/files"
        params = {
            "q": f"'{folder_id}' in parents and trashed=false and mimeType contains 'video/'",
            "fields": "files(id,name,thumbnailLink,createdTime)",
            "key": api_key,
            "pageSize": 50,
        }

        response = requests.get(url, params=params)

        if response.status_code != 200:
            return jsonify({"error": f"Google Drive API error: {response.text}"}), 500

        data = response.json()
        items = data.get("files", [])

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
            "timestamp": str(datetime.now()),
            "env_vars": {
                "has_api_key": bool(os.environ.get("GOOGLE_DRIVE_API_KEY")),
                "has_folder_id": bool(os.environ.get("GOOGLE_DRIVE_FOLDER_ID")),
            },
        }
    )


# Vercel serverless function handler
def handler(request):
    with app.test_client() as client:
        ctx = app.test_request_context(
            path=request.path,
            method=request.method,
            headers={key: value for key, value in request.headers.items()},
            data=request.data,
            environ_base={"REMOTE_ADDR": request.headers.get("x-forwarded-for", "")},
        )
        with ctx:
            try:
                response = app.full_dispatch_request()
                return response
            except Exception as e:
                return jsonify({"error": str(e)}), 500


# For local development
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
