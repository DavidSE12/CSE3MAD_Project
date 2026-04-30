from dotenv import load_dotenv
from document_processor import process_and_store

load_dotenv()

DOCUMENTS = [
    "documents/STEMM_Lab_Summary.pdf",
    # "documents/another.pdf",
]

if __name__ == "__main__":
    for path in DOCUMENTS:
        print(f"Processing '{path}'...")
        process_and_store(path)
        print("Done.")
