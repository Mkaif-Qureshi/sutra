# Sutra Backend  

The backend for **Sutra**, an AI-powered visual smart contract builder, built with **FastAPI**. This backend handles API requests, contract compilation, AI-powered learning, and integration with the frontend for smart contract deployment on the blockchain.  

## Features  
- RESTful APIs for managing smart contract operations.  
- AI integration for contract learning and code generation.  
- Smart contract compilation and deployment functionality.  
- Secure and scalable architecture with CORS middleware support.  

## Requirements  

- **Python** (>=3.8 recommended)  
- **FastAPI**  
- **Uvicorn** (for running the development server)  

## Getting Started
Clone the repository:
```
git clone https://github.com/your-username/sutra-backend.git
cd sutra-backend
```

Install dependencies:

```
pip install -r requirements.txt
``` 

Environment Variables:

The backend requires a `.env` file for storing sensitive API keys and configuration values. Follow the steps below to set up your environment variables:  

1. Create a `.env` file in the root directory of your project.  
2. Add the following variables to your `.env` file:  

```env
MISTRAL_API_KEY=your_mistral_api_key_here
HUGGINGFACEHUB_API_TOKEN=your_huggingface_api_token_here
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Run the server:
```
uvicorn app:app --reload
```

Access the API documentation:

Swagger UI: http://127.0.0.1:8000/docs

Redoc: http://127.0.0.1:8000/redoc

