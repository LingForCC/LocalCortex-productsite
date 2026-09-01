from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit


class LocalCortexHandler(SimpleHTTPRequestHandler):
    """Serve the static site and keep the privacy page at its clean URL."""

    def do_GET(self):
        path = urlsplit(self.path).path

        if path == "/privacy":
            self.send_response(301)
            self.send_header("Location", "/privacy/")
            self.end_headers()
            return

        if path == "/privacy/":
            original_path = self.path
            parsed = urlsplit(self.path)
            self.path = "/privacy.html"
            if parsed.query:
                self.path += "?" + parsed.query
            try:
                super().do_GET()
            finally:
                self.path = original_path
            return

        super().do_GET()


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 5000), LocalCortexHandler).serve_forever()