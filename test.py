from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from dotenv import load_dotenv
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.settings import Settings
from llama_index.llms.openai import OpenAI

load_dotenv()

embed_model = OpenAIEmbedding(model="text-embedding-3-large")
llm = OpenAI()

Settings.llm = llm
Settings.embed_model = embed_model

# Translate html to text
import html2text
import os


def extract_text(html_file_path):
    html = open(html_file_path).read()
    return html2text.html2text(html)


def get_transformed_files():
    file_paths = [
        f"./ai-experiments/data/{file}" for file in os.listdir("./ai-experiments/data")
    ]

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


file_paths = get_transformed_files()
documents = SimpleDirectoryReader(input_files=file_paths).load_data()

index = VectorStoreIndex.from_documents(documents)
chat_engine = index.as_chat_engine()


def chat(question):
    response = chat_engine.chat(question)
    print(response)
    return response


chat("What's the discord link?")
