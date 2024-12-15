from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from solcx import compile_source, install_solc
from web3 import Web3
import os
import json
from groq import Groq  # Make sure this is the correct import for the Groq library you're using

# Initialize the FastAPI router
router = APIRouter()

# Configure the Groq API key
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))  # Ensure that GROQ_API_KEY is set in environment

# Install the specified Solidity compiler version
try:
    install_solc("0.8.0")  # Adjust the version based on your requirements
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Solidity compiler installation failed: {e}")

# Web3 Provider Setup for Mantle Network
MANTLE_RPC_URL = os.getenv("MANTLE_RPC_URL", "https://mantle.drpc.org")
web3 = Web3(Web3.HTTPProvider(MANTLE_RPC_URL))

# Check connection to Mantle network
if not web3.is_connected():
    raise HTTPException(status_code=500, detail=f"Failed to connect to Mantle network at {MANTLE_RPC_URL}. Check the RPC URL and network status.")

# Define the request model for /compile
class CompileRequest(BaseModel):
    solidity_code: str

# Define the response model for /compile
class CompileResponse(BaseModel):
    abi: list
    bytecode: str

# Define the compile endpoint
@router.post("/compile", response_model=CompileResponse)
async def compile_contract(request: CompileRequest):
    try:
        # Compile the Solidity code
        compiled_sol = compile_source(
            request.solidity_code,
            output_values=["abi", "bin"],
            solc_version="0.8.0",  # Ensure this matches the installed solc version
        )

        # Extract the contract name and data
        contract_id, contract_data = next(iter(compiled_sol.items()))

        # Return the ABI and bytecode
        return {
            "abi": contract_data["abi"],
            "bytecode": contract_data["bin"],
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Compilation failed: {str(e)}")

# Define the request model for /deploy
class DeployRequest(BaseModel):
    signed_tx: str

# Define the response model for /deploy
class DeployResponse(BaseModel):
    contract_address: str

# Define the deploy endpoint
@router.post("/deploy", response_model=DeployResponse)
async def deploy_contract(request: DeployRequest):
    try:
        # Send the signed transaction
        tx_hash = web3.eth.send_raw_transaction(request.signed_tx)

        # Wait for the transaction receipt
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

        # Return the deployed contract address
        return {"contract_address": tx_receipt.contractAddress}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Deployment failed: {str(e)}")

# Define the request model for /security
class SecurityRequest(BaseModel):
    solidity_code: str

# Define the response model for /security
class SecurityResponse(BaseModel):
    issues: list  # List of security issues
    suggestions: list  # List of suggestions

# Define the /security endpoint
@router.post("/security", response_model=SecurityResponse)
async def check_security(request: SecurityRequest):
    try:
        # Prepare prompt for the LLM to detect security issues
        prompt = f"""
        You are a security expert in Solidity smart contracts. Review the following Solidity code and identify any potential security issues. Then, provide suggestions to resolve them.

        Solidity Code:
        {request.solidity_code}

        Please respond with:
        - **Issues**: A list of identified security issues in the contract.
        - **Suggestions**: A list of recommendations to mitigate or fix the issues.
        """

        # Query the AI model for security analysis
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",  # Replace with your specific LLM model
        )

        # Extract and return the response content as-is
        response_content = chat_completion.choices[0].message.content
        return {"response": response_content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Security check failed: {str(e)}")
