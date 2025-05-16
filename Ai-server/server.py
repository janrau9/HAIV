# server.py
import os
import subprocess
from flask import Flask, request, jsonify, abort
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow external calls

# Load your secret key from env (set SECRET_KEY before running)
SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("Please set SECRET_KEY environment variable")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json(force=True)
    prompt = data.get("prompt")
    key    = data.get("secret_key")

    # Basic auth
    if key != SECRET_KEY:
        abort(401, description="Invalid secret key")

    if not prompt:
        abort(400, description="Missing 'prompt' in JSON body")

    # Call your local LLM script, e.g. a shell script or Python module
    # Here we assume you have an executable `./run_llm.sh` that reads
    # the prompt as its first arg and prints the completion to stdout.
    try:
        proc = subprocess.run(
            ["./run.py", prompt],
            check=True,
            capture_output=True,
            text=True
        )
        generated = proc.stdout.strip()
    except subprocess.CalledProcessError as e:
        abort(500, description=f"LLM script error: {e.stderr}")

    return jsonify({
        "prompt": prompt,
        "completion": generated
    })

if __name__ == "__main__":
    # Listen on all interfaces, port 5000
    app.run(host="0.0.0.0", port=5000)