from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from langchain_community.vectorstores import Chroma
from langchain_openai import ChatOpenAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv
import os

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

app = FastAPI()
router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    question: str


PROMPT_TEMPLATE = """
You are a helpful STEM tutor assistant for students.
Use the provided document context to answer the question accurately.
If the document context doesn't fully cover the question,
you may also use your general STEM knowledge — but say so clearly.

Document Context:
{context}

Student Question: {input}

Answer:
"""


@router.post("")
async def chat(request: ChatRequest):
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    chroma_path = "./chroma_db"
    os.makedirs(chroma_path, exist_ok=True)
    vectorstore = Chroma(
        persist_directory=chroma_path,
        embedding_function=embeddings
    )

    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

    llm = ChatOpenAI(
        model="google/gemini-2.0-flash-001",
        temperature=0.3,
        openai_api_key=OPENROUTER_API_KEY,
        openai_api_base=OPENROUTER_BASE_URL,
    )

    prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs) if docs else "No documents available."

    chain = (
        {"context": retriever | format_docs, "input": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    answer = chain.invoke(request.question)
    return {"answer": answer}


app.include_router(router)
