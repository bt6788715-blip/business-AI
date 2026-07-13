from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
import httpx
import uvicorn

app = FastAPI(title="Bizflow AI Backend")

# Enable CORS to support hosting the frontend on GitHub Pages while pointing to an external backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define request schemas
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    api_key: Optional[str] = None
    provider: str
    model: str
    system_prompt: str
    messages: List[Message]

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    provider = request.provider.lower()
    model = request.model
    
    # 1. Resolve API Key (check request body first, fallback to environment variables)
    api_key = request.api_key
    if not api_key:
        if provider == "gemini":
            api_key = os.environ.get("GEMINI_API_KEY")
        elif provider == "anthropic":
            api_key = os.environ.get("ANTHROPIC_API_KEY")
            
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail=f"No API key provided for {provider.capitalize()}. Please configure it in Settings or set it as an environment variable."
        )

    # 2. Forward request to the appropriate LLM provider
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            if provider == "gemini":
                # Convert messages list to Gemini Format
                gemini_contents = []
                for msg in request.messages:
                    # Map role: user -> user, assistant -> model
                    role = "model" if msg.role == "assistant" else "user"
                    gemini_contents.append({
                        "role": role,
                        "parts": [{"text": msg.content}]
                    })
                
                payload = {
                    "contents": gemini_contents,
                    "systemInstruction": {
                        "parts": [{"text": request.system_prompt}]
                    }
                }
                
                # Gemini REST URL
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
                
                res = await client.post(url, json=payload, headers={"Content-Type": "application/json"})
                
                if res.status_code != 200:
                    try:
                        error_detail = res.json().get("error", {}).get("message", res.text)
                    except Exception:
                        error_detail = res.text
                    return JSONResponse(status_code=res.status_code, content={"error": f"Gemini API Error: {error_detail}"})
                
                response_data = res.json()
                try:
                    reply_text = response_data["candidates"][0]["content"]["parts"][0]["text"]
                    return {"reply": reply_text}
                except (KeyError, IndexError):
                    return JSONResponse(status_code=500, content={"error": f"Failed to parse response from Gemini: {response_data}"})

            elif provider == "anthropic":
                # Prepare Claude payload
                # Note: System prompt is a root level parameter in Claude Messages API
                claude_messages = []
                for msg in request.messages:
                    claude_messages.append({
                        "role": "assistant" if msg.role == "assistant" else "user",
                        "content": msg.content
                    })
                
                payload = {
                    "model": model,
                    "max_tokens": 1024,
                    "system": request.system_prompt,
                    "messages": claude_messages
                }
                
                headers = {
                    "x-api-key": api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                }
                
                url = "https://api.anthropic.com/v1/messages"
                
                res = await client.post(url, json=payload, headers=headers)
                
                if res.status_code != 200:
                    try:
                        error_detail = res.json().get("error", {}).get("message", res.text)
                    except Exception:
                        error_detail = res.text
                    return JSONResponse(status_code=res.status_code, content={"error": f"Anthropic API Error: {error_detail}"})
                
                response_data = res.json()
                try:
                    reply_text = response_data["content"][0]["text"]
                    return {"reply": reply_text}
                except (KeyError, IndexError):
                    return JSONResponse(status_code=500, content={"error": f"Failed to parse response from Anthropic: {response_data}"})
            
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")
                
        except httpx.ConnectError:
            raise HTTPException(status_code=503, detail="Failed to connect to the AI model provider. Check your network connection.")
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Request to the AI model timed out. Please try again.")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# Mount static assets
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")

# Serve index.html at root
@app.get("/")
async def read_root():
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Bizflow AI server is running, but static files are missing."}

# Mount static files (served under root paths like /style.css, /app.js)
app.mount("/", StaticFiles(directory=static_dir), name="static")

if __name__ == "__main__":
    print("\n" + "="*50)
    print("Bizflow AI Business Workflow Agent Server starting...")
    print("Open the following URL in your web browser:")
    print(">> http://127.0.0.1:8000 <<")
    print("="*50 + "\n")
    uvicorn.run("ai_business_agent:app", host="127.0.0.1", port=8000, reload=False)
