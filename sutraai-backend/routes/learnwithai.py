from fastapi import APIRouter, HTTPException
import os
import google.generativeai as genai
from groq import Groq
import json
from pydantic import BaseModel

# Configure the Gemini API key
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))  # Replace with your actual API key

# Configure the Groq API key
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Initialize the API router
router = APIRouter()

# Initialize the Gemini model
try:
    gemini_model = genai.GenerativeModel("gemini-1.5-flash")  # Replace with the correct model version
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Failed to initialize Gemini AI model: {str(e)}")

# Define the request body schema
class TopicRequest(BaseModel):
    topic: str

# Define the route for generating educational resources
@router.post("/resources")
async def generate_resources(request: TopicRequest):
    try:
        # Create the prompt for educational resources
        prompt = f"""
        You are an AI expert helping to provide structured educational resources. I need a detailed response on the topic "{request.topic}". 
        Please divide your response into the following sections:
        
        1. **Introduction**: A brief overview of the topic.
        2. **Top Websites**: A list of 3-5 reputable websites that provide high-quality tutorials or resources for learning this topic. Include their URLs and a brief description.
        3. **Recommended YouTube Videos**: Suggest 3-5 YouTube videos or channels or playlists that are excellent for learning this topic. Include their titles and links.
        4. **Additional Resources**: Mention any other relevant resources, such as books or online courses, that can help someone become proficient in this topic.
        
        Make the response informative and concise.
        """

        # Query the Gemini model for educational resources
        response = gemini_model.generate_content(prompt)

        # Return the response
        return {"topic": request.topic, "resources": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating resources: {str(e)}")

@router.post("/mindmap")
async def generate_mindmap_markdown(request: TopicRequest):
    try:
        # Few-shot learning examples
        prompt = f"""
        You are an AI expert in creating educational tools. Generate a hierarchical mind map in Markdown format for the topic "{request.topic}".
        Example:
        - **Physics**
          - **Mechanics**
            - Kinematics
            - Dynamics
          - **Thermodynamics**
            - Heat
            - Work
        Now generate a similar mind map for the topic "{request.topic}".
        """

        # Query the AI model for mind map generation
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
        )

        # Extract the Markdown response
        response_markdown = chat_completion.choices[0].message.content
        
        # Return the Markdown mind map
        return {"topic": request.topic, "mindmap_markdown": response_markdown}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating Markdown mind map: {str(e)}")
