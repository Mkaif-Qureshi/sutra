from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import os
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_mistralai import ChatMistralAI
from dotenv import load_dotenv

load_dotenv()

# Configure API keys
if "MISTRAL_API_KEY" not in os.environ:
    raise EnvironmentError("MISTRAL_API_KEY is not set in environment variables.")
if "HUGGINGFACEHUB_API_TOKEN" not in os.environ:
    raise EnvironmentError("HUGGINGFACEHUB_API_TOKEN is not set in environment variables.")

# Initialize the Mistral AI LLM
llm = ChatMistralAI(
    model="mistral-large-latest",
    temperature=0,
)

# Define the prompt template
prompt_template = PromptTemplate(
    input_variables=["flowJson", "purpose"],
    template=(
        "You are a Surta Solidity developer tasked with generating a smart contract based on the provided flow JSON "
        "and the specified purpose. The flow JSON describes the structure of the contract, including its states, "
        "functions, and logic. Generate a complete Solidity code block that implements this contract while adhering "
        "to best practices. Additionally, provide a brief explanation of the contract and its logic.\n\n"
        "Purpose: {purpose}\n"
        "Flow JSON: {flowJson}\n\n"
        "Generated Solidity Code:\n"
        "Explanation:\n"
    ),
)

# Create an LLMChain for generating the Solidity code
solidity_chain = LLMChain(llm=llm, prompt=prompt_template)

# Define the FastAPI router
router = APIRouter()

# Request model
class ContractRequest(BaseModel):
    flowJson: Dict[str, Any]
    purpose: str

# Response model
class ContractResponse(BaseModel):
    file_name: str
    solidity_code: str
    explanation: str

@router.post("/generate-solidity", response_model=ContractResponse)
async def generate_solidity(request: ContractRequest):
    """
    Endpoint to generate Solidity code based on the provided flow JSON and purpose.
    """
    try:
        # Generate Solidity code using the LLM chain
        response = solidity_chain.run(flowJson=request.flowJson, purpose=request.purpose)

        # Determine the file name (you can customize this based on the purpose or flow)
        file_name = f"{request.purpose.replace(' ', '_')}_contract.sol"
        
        # Generate explanation (this could be parsed from the response if needed)
        explanation = "The generated code follows the provided flow structure and purpose. The code includes functions, events, and state variables as defined in the flow."

        # Return the response with file_name, solidity_code, and explanation
        return {"file_name": file_name, "solidity_code": response, "explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
