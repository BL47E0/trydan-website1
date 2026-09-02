import os

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from flask import Flask, request
from flask_cors import CORS
from werkzeug.utils import secure_filename

load_dotenv()

app = Flask(__name__)
CORS(app)

SUBSYSTEMS = {
    "chassis",
    "drivetrain",
    "engine",
    "electronics",
    "braking",
    "steering"
}

CATEGORIES = {
    "bom",
    "cad",
    "reports",
    "images"
}

MAX_FILE_SIZES = {
    "bom": 25 * 1024 * 1024,
    "cad": 100 * 1024 * 1024,
    "reports": 25 * 1024 * 1024,
    "images": 10 * 1024 * 1024
}


B2_KEY_ID = os.getenv("B2_KEY_ID")
B2_APPLICATION_KEY = os.getenv("B2_APPLICATION_KEY")
B2_BUCKET_NAME = os.getenv("B2_BUCKET_NAME")
B2_ENDPOINT = os.getenv("B2_ENDPOINT")

s3 = boto3.client(
    "s3",
    endpoint_url=B2_ENDPOINT,
    aws_access_key_id=B2_KEY_ID,
    aws_secret_access_key=B2_APPLICATION_KEY,
    config=Config(signature_version="s3v4"),
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

@app.route("/files/<subsystem>/<category>", methods=["GET"])
def list_files(subsystem, category):
    if subsystem not in SUBSYSTEMS:
        return {"error": "Invalid subsystem"}, 400

    if category not in CATEGORIES:
        return {"error": "Invalid category"}, 400

    prefix = f"{subsystem}/{category}/"

    paginator = s3.get_paginator("list_objects_v2")

    files = []

    for page in paginator.paginate(
        Bucket=B2_BUCKET_NAME,
        Prefix=prefix
    ):
        for obj in page.get("Contents", []):
            files.append({
                "filename": obj["Key"].replace(prefix, "", 1),
                "size": obj["Size"],
                "last_modified": obj["LastModified"].isoformat()
            })

    return {
        "subsystem": subsystem,
        "category": category,
        "files": files
    }

@app.route("/download/<subsystem>/<category>/<filename>", methods=["GET"])
def download_file(subsystem, category, filename):
    if subsystem not in SUBSYSTEMS:
        return {"error": "Invalid subsystem"}, 400

    if category not in CATEGORIES:
        return {"error": "Invalid category"}, 400

    filename = secure_filename(filename)

    if not filename:
        return {"error": "Invalid filename"}, 400

    object_key = f"{subsystem}/{category}/{filename}"

    try:
        s3.head_object(
            Bucket=B2_BUCKET_NAME,
            Key=object_key
        )

        download_url = s3.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": B2_BUCKET_NAME,
                "Key": object_key
            },
            ExpiresIn=300
        )

        return {
            "filename": filename,
            "download_url": download_url,
            "expires_in": 300
        }

    except ClientError as e:
        error_code = e.response["Error"]["Code"]

        if error_code in ["404", "NoSuchKey", "NotFound"]:
            return {"error": "File not found"}, 404

        return {"error": "Could not generate download URL"}, 500


@app.route("/files/<subsystem>/<category>/<filename>", methods=["DELETE"])
def delete_file(subsystem, category, filename):
    if subsystem not in SUBSYSTEMS:
        return {"error": "Invalid subsystem"}, 400

    if category not in CATEGORIES:
        return {"error": "Invalid category"}, 400

    filename = secure_filename(filename)

    if not filename:
        return {"error": "Invalid filename"}, 400

    object_key = f"{subsystem}/{category}/{filename}"

    try:
        s3.head_object(
            Bucket=B2_BUCKET_NAME,
            Key=object_key
        )

        s3.delete_object(
            Bucket=B2_BUCKET_NAME,
            Key=object_key
        )

        return {
            "status": "success",
            "filename": filename,
            "path": object_key
        }

    except ClientError as e:
        error_code = e.response["Error"]["Code"]

        if error_code in ["404", "NoSuchKey", "NotFound"]:
            return {"error": "File not found"}, 404

        return {"error": "Could not delete file"}, 500

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
    
    if subsystem not in SUBSYSTEMS:
        return {"error": "Invalid subsystem"}, 400

    if category not in CATEGORIES:
        return {"error": "Invalid category"}, 400

    max_size = MAX_FILE_SIZES[category]

    file.seek(0, 2)
    file_size = file.tell()
    file.seek(0)

    if file_size > max_size:
        return {
            "error": f"File too large. Maximum size for {category} is {max_size // (1024 * 1024)} MB"
        }, 413

    filename = secure_filename(file.filename)

    if not filename:
        return {"error": "Invalid filename"}, 400

    object_key = f"{subsystem}/{category}/{filename}"

    s3.upload_fileobj(
        file,
        B2_BUCKET_NAME,
        object_key
    )

    return {
        "status": "success",
        "filename": filename,
        "path": object_key
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)