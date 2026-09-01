from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit


class LocalCortexHandler(SimpleHTTPRequestHandler):
    """Serve the static site and keep support pages at their clean URLs."""

    def do_GET(self):
        path = urlsplit(self.path).path

        if path in ("/privacy", "/support"):
            self.send_response(301)
            self.send_header("Location", path + "/")
            self.end_headers()
            return

        clean_pages = {
            "/privacy/": "/privacy.html",
            "/support/": "/support.html",
        }
        if path in clean_pages:
            original_path = self.path
            parsed = urlsplit(self.path)
            self.path = clean_pages[path]
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