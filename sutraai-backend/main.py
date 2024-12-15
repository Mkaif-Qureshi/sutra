from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from routes.contract import router as contract_router  # Import the router from contract.py
from routes.learnwithai import router as learnwithai_router
from routes.compile import router as compile

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with specific origins if needed for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the contract router
app.include_router(contract_router, prefix="/contract")  # Optional prefix for namespacing
app.include_router(learnwithai_router, prefix="/learn")  # Optional prefix for namespacing
app.include_router(compile, prefix="/sol")  # Optional prefix for namespacing

@app.get("/")
def read_root():
    return {"message": "Welcome to SutraAI Backend"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    return {"filename": file.filename}
