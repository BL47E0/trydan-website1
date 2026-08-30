import os

import boto3
from dotenv import load_dotenv
from flask import Flask, request

load_dotenv()

app = Flask(__name__)

B2_KEY_ID = os.getenv("B2_KEY_ID")
B2_APPLICATION_KEY = os.getenv("B2_APPLICATION_KEY")
B2_BUCKET_NAME = os.getenv("B2_BUCKET_NAME")
B2_ENDPOINT = os.getenv("B2_ENDPOINT")

s3 = boto3.client(
    "s3",
    endpoint_url=B2_ENDPOINT,
    aws_access_key_id=B2_KEY_ID,
    aws_secret_access_key=B2_APPLICATION_KEY,
)


@app.route("/")
def home():
    return "Trydan backend is running!"


@app.route("/test-storage")
def test_storage():
    response = s3.list_objects_v2(Bucket=B2_BUCKET_NAME)

    files = []

    for obj in response.get("Contents", []):
        files.append(obj["Key"])

    return {
        "status": "success",
        "bucket": B2_BUCKET_NAME,
        "files": files
    }


@app.route("/upload", methods=["POST"])
def upload_file():
    file = request.files.get("file")
    subsystem = request.form.get("subsystem")
    category = request.form.get("category")

    if not file:
        return {"error": "No file provided"}, 400

    if not subsystem:
        return {"error": "No subsystem provided"}, 400

    if not category:
        return {"error": "No category provided"}, 400

    object_key = f"{subsystem}/{category}/{file.filename}"

    s3.upload_fileobj(
        file,
        B2_BUCKET_NAME,
        object_key
    )

    return {
        "status": "success",
        "filename": file.filename,
        "path": object_key
    }

if __name__ == "__main__":
    app.run(debug=True)