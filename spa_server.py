#!/usr/bin/env python3
"""Static file server with SPA fallback for clean URL routing."""
import http.server
import os
import socketserver
import sys
import urllib.parse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
ROOT = os.path.dirname(os.path.abspath(__file__))


class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        path = urllib.parse.unquote(self.path.split("?", 1)[0])
        rel = path.lstrip("/")
        if rel:
            fs_path = os.path.join(ROOT, rel)
            if os.path.isfile(fs_path):
                return super().do_GET()
            if os.path.isdir(fs_path) and os.path.isfile(os.path.join(fs_path, "index.html")):
                return super().do_GET()
            if os.path.basename(rel) and "." in os.path.basename(rel):
                return super().do_GET()
        self.path = "/index.html"
        return super().do_GET()


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), SPAHandler) as httpd:
        print(f"Serving SPA on http://0.0.0.0:{PORT}/ (fallback → index.html)")
        httpd.serve_forever()
