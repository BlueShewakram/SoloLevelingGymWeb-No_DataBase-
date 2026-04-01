# Solo Leveling Gym — Simple Backend Server
# Serves the frontend files. Can be expanded later for API features.
# Run: python BackEnd.py

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

PORT = 8000

class GymHandler(SimpleHTTPRequestHandler):
    """Serves files from the SoloLevelingGym directory."""

    def __init__(self, *args, **kwargs):
        # Serve from the directory where this script is located
        directory = os.path.dirname(os.path.abspath(__file__))
        super().__init__(*args, directory=directory, **kwargs)

    def do_GET(self):
        # Redirect root to FrontEnd.html
        if self.path == '/':
            self.path = '/FrontEnd.html'
        return super().do_GET()

    def end_headers(self):
        # Enable CORS for development
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    server = HTTPServer(('localhost', PORT), GymHandler)
    print(f"")
    print(f"  SOLO LEVELING GYM SERVER")
    print(f"  ================================")
    print(f"  Server running at: http://localhost:{PORT}")
    print(f"  Open your browser and begin your hunt!")
    print(f"  Press Ctrl+C to stop.")
    print(f"  ================================")
    print(f"")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer shut down. Rest well, hunter.")
        server.server_close()
