from backend.app import app


class StripAPIPrefix:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        path = environ.get("PATH_INFO", "")

        if path.startswith("/api"):
            environ["PATH_INFO"] = path[4:] or "/"

        return self.app(environ, start_response)


app.wsgi_app = StripAPIPrefix(app.wsgi_app)
