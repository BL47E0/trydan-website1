import requests

with open("test.txt", "rb") as file:
    response = requests.post(
        "http://127.0.0.1:5000/upload",
        files={"file": file},
        data={
            "subsystem": "braking",
            "category": "reports"
        }
    )

print(response.status_code)
print(response.json())