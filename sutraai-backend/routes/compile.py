from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from solcx import compile_source, install_solc
from web3 import Web3
import os
import logging

# Initialize the FastAPI router
router = APIRouter()

# Set up logging for better error visibility
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("MantleConnection")

# Install the specified Solidity compiler version
try:
    install_solc("0.8.0")  # Adjust the version based on your requirements
    logger.info("Solidity compiler version 0.8.0 installed successfully.")
except Exception as e:
    logger.error(f"Solidity compiler installation failed: {e}")

# Web3 Provider Setup for Mantle Network
MANTLE_RPC_URL = os.getenv("MANTLE_RPC_URL", "https://mantle.drpc.org")
logger.debug(f"Connecting to Mantle RPC URL: {MANTLE_RPC_URL}")
web3 = Web3(Web3.HTTPProvider(MANTLE_RPC_URL))

# Check connection to Mantle network
if not web3.is_connected():
    logger.error(f"Failed to connect to Mantle network at {MANTLE_RPC_URL}. Check the RPC URL and network status.")
    raise Exception("Failed to connect to Mantle network.")
logger.info("Successfully connected to Mantle network.")

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
        logger.debug("Compiling Solidity code...")
        # Compile the Solidity code
        compiled_sol = compile_source(
            request.solidity_code,
            output_values=["abi", "bin"],
            solc_version="0.8.0",  # Ensure this matches the installed solc version
        )

        # Extract the contract name and data
        contract_id, contract_data = next(iter(compiled_sol.items()))
        logger.info(f"Contract compiled successfully: {contract_id}")

        # Return the ABI and bytecode
        return {
            "abi": contract_data["abi"],
            "bytecode": contract_data["bin"],
        }
    except Exception as e:
        logger.error(f"Compilation failed: {e}")
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
        logger.debug("Sending signed transaction to Mantle network...")
        # Send the signed transaction
        tx_hash = web3.eth.send_raw_transaction(request.signed_tx)

        # Wait for the transaction receipt
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        logger.info(f"Transaction successfully deployed: {tx_receipt.contractAddress}")

        # Return the deployed contract address
        return {"contract_address": tx_receipt.contractAddress}
    except Exception as e:
        logger.error(f"Deployment failed: {e}")
        raise HTTPException(status_code=400, detail=f"Deployment failed: {str(e)}")
