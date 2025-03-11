from http.server import BaseHTTPRequestHandler
import json
import os
import requests


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Set CORS headers
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        try:
            # Get API key and folder ID
            api_key = os.environ.get("GOOGLE_DRIVE_API_KEY")
            folder_id = os.environ.get("GOOGLE_DRIVE_FOLDER_ID")

            # Call Google Drive API
            url = f"https://www.googleapis.com/drive/v3/files"
            params = {
                "q": f"'{folder_id}' in parents and trashed=false and mimeType contains 'video/'",
                "fields": "files(id,name,thumbnailLink,createdTime)",
                "key": api_key,
            }

            response = requests.get(url, params=params)
            data = response.json()

            # Process the results
            clips = []
            for item in data.get("files", []):
                clips.append(
                    {
                        "id": item["id"],
                        "name": item["name"],
                        "thumbnail": item.get("thumbnailLink", ""),
                        "created": item["createdTime"],
                        "download_link": f"https://drive.google.com/uc?export=download&id={item['id']}",
                        "stream_link": f"https://drive.google.com/file/d/{item['id']}/preview",
                    }
                )

            self.wfile.write(json.dumps(clips).encode())

        except Exception as e:
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header(
            "Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept"
        )
        self.end_headers()
