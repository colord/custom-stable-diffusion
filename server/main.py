from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import model

app = FastAPI()

origins = ['http://localhost:5173']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = model.setup_pipeline()

class Image(BaseModel):
    prompt: str
    negative_prompt: str
    width: int
    height: int
    steps: int

@app.get("/")
async def root():
    return {"message": "Server running..."}

@app.post("/create-image/")
async def create_image(image: Image):
    filename = model.generate_image(pipeline, image.prompt, image.negative_prompt, image.width, image.height, image.steps)
    return {"image_url": f"http://localhost:8000/{filename}"}

@app.get("/images/{filename}")
async def get_image(filename):
    path = f"./images/{filename}"
    return StreamingResponse(open(path, "rb"), media_type="image/png")