from flask import Flask, request
from werkzeug.utils import secure_filename
import os
from random import randint

app = Flask(__name__)

APP_ROUTE = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(APP_ROUTE, "uploads")

access_key = os.environ["ACCESS_KEY"]


@app.route("/", methods=["get"])
def index_page():
    return app.send_static_file("index.html")


@app.route("/upload", methods=["post"])
def upload_endpoint():
    if not request.headers.get("key", "") == access_key:
        return "Invalid access key", 401

    session = randint(0, 9999999)
    session_path = os.path.join(UPLOADS_DIR, str(session))
    os.makedirs(session_path)

    for name, file in request.files.items():
        file_name = secure_filename(name)
        file.save(os.path.join(session_path, file_name))
        file.close()
    return "Success", 200


if __name__ == "__main__":
    app.run(port=5000, debug=True)
