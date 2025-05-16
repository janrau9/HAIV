# server.py
import os
import json
from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# ——————————————————————————————————————————————————————————
#  1. Load config & model at import time (so it isn’t reloaded per request)
# ——————————————————————————————————————————————————————————
SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("Environment variable SECRET_KEY must be set")

MODEL_ID = "ByteDance-Seed/Seed-Coder-8B-Instruct"
print(f"Loading model {MODEL_ID}… (this may take a minute)")
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    torch_dtype=torch.bfloat16,
    trust_remote_code=True
)
model.to("cuda")
model.eval()

# if running on cpu just exit
if not torch.cuda.is_available():
    print("CUDA not available, exiting.")
    exit(1)

print("Model loaded. Starting server.")

# ——————————————————————————————————————————————————————————
#  2. Flask app
# ——————————————————————————————————————————————————————————
app = Flask(__name__)
CORS(app)  # allow calls from any origin

@app.route("/generate", methods=["POST"])
def generate():
    print("Received request")
    payload = request.get_json(force=True)
    prompt = payload.get("prompt")
    key    = payload.get("secret_key")

    print(f"Prompt: {prompt}")
    print(f"Key: {key}")

    # — auth
    if key != SECRET_KEY:
        print("Invalid secret key")
        abort(401, description="Invalid secret key")
    if not prompt:
        print("Missing 'prompt' in JSON body")
        abort(400, description="Missing 'prompt'")

    # — prepare inputs
    messages = [{"role":"user","content":prompt}]
    inputs = tokenizer.apply_chat_template(
        messages,
        tokenize=True,
        return_tensors="pt",
        add_generation_prompt=True
    ).to(model.device)

    print(f"Inputs: {inputs}")

    # — generate
    print("cuda available:", torch.cuda.is_available())
    print("model on:", next(model.parameters()).device)
    outputs = model.generate(
        inputs,
        max_new_tokens=512,
        pad_token_id=tokenizer.pad_token_id
    )
    print(f"Outputs: {outputs}")
    completion = tokenizer.decode(
        outputs[0][inputs.shape[-1]:],
        skip_special_tokens=True
    )
    print(f"Completion: {completion}")

    return jsonify({
        "prompt": prompt,
        "completion": completion
    })

if __name__ == "__main__":
    # Listen on all interfaces so external networks can reach it
    app.run(host="0.0.0.0", port=5000)