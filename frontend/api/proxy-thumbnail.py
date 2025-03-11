from http.server import BaseHTTPRequestHandler
import requests
import os
from urllib.parse import parse_qs


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Get file ID from query string
            query_components = parse_qs(self.path.split("?")[-1])
            file_id = query_components.get("id", [""])[0]

            if not file_id:
                # Try to get it from path
                path_parts = self.path.split("/")
                file_id = path_parts[-1]

            # Create a Google Drive thumbnail URL
            thumbnail_url = (
                f"https://drive.google.com/thumbnail?id={file_id}&sz=w320-h180"
            )

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
                self.send_response(200)
                self.send_header("Content-type", "image/jpeg")
                self.send_header("Cache-Control", "public, max-age=86400")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(response.content)
            else:
                # Return a default response for error
                self.send_response(404)
                self.send_header("Content-type", "text/plain")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(b"Thumbnail not available")

        except Exception as e:
            self.send_response(500)
            self.send_header("Content-type", "text/plain")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(f"Error fetching thumbnail: {str(e)}".encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header(
            "Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept"
        )
        self.end_headers()
