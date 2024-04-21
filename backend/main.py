import json
from time import sleep
from flask import Flask, Response, request, jsonify

from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from dotenv import load_dotenv
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.settings import Settings
from llama_index.llms.openai import OpenAI

# Translate html to text
import html2text
import os

load_dotenv()

embed_model = OpenAIEmbedding(model="text-embedding-3-large")
# model = "gpt-3.5-turbo"
# model = "gpt-4-turbo"
model = "gpt-4"
llm = OpenAI(model=model)

Settings.llm = llm
Settings.embed_model = embed_model
app = Flask(__name__)
FORCE_RELOAD = False

chat_engine = None


def extract_text(html_file_path):
    html = open(html_file_path).read()
    return html2text.html2text(html)


def get_transformed_files():
    folder_path = "../ai-experiments/data"
    file_paths = [f"{folder_path}/{file}" for file in os.listdir(folder_path)]

    out_file_paths = []
    for file_path in file_paths:
        if file_path.endswith(".html"):
            text = extract_text(file_path)
            with open(file_path.replace(".html", ".txt"), "w") as f:
                f.write(text)
                out_file_paths.append(file_path.replace(".html", ".txt"))
        else:
            out_file_paths.append(file_path)
    return list(set(out_file_paths))


def init():
    global chat_engine
    if FORCE_RELOAD or not chat_engine:
        print("RELOADED")
        file_paths = get_transformed_files()
        documents = SimpleDirectoryReader(input_files=file_paths).load_data()
        index = VectorStoreIndex.from_documents(documents)
        chat_engine = index.as_chat_engine()
    else:
        print("RELOAD SKIPPED")


def get_response(response_dict):
    response = jsonify(response_dict)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route("/reset", methods=["POST"])
def reset():
    chat_engine.reset()
    return get_response({"status": 1})


@app.route("/chat", methods=["POST"])
def chat():
    params = json.loads(request.data)
    response = chat_engine.chat(params["message"])
    return get_response({"status": 1, "result": str(response)})


# @app.route("/stream-chat", methods=["POST"])
# def stream_chat():
#     params = json.loads(request.data)

#     streaming_response = chat_engine.stream_chat(params["message"])

#     def generate():
#         for token in streaming_response.response_gen:
#             yield token

#     return Response(generate(), mimetype="text")


@app.route("/")
def root():
    return get_response({"message": "Root!", "chat_engine": str(chat_engine)})


init()
# flask --app main run --debug
