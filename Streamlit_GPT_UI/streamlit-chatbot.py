import streamlit as st
import requests
from transformers import pipeline
import ollama

# Function to get response from Ollama
def get_ollama_response(model, prompt):
    response = ollama.generate(model=model, prompt=prompt)
    return response['response']

# Function to get response from Hugging Face Transformers
def get_transformers_response(model, prompt):
    generator = pipeline('text-generation', model=model)
    response = generator(prompt, max_length=100, num_return_sequences=1)
    return response[0]['generated_text']

# Function to get response from API (example with OpenAI)
def get_api_response(api_key, prompt):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}]
    }
    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data)
    return response.json()['choices'][0]['message']['content']

# Streamlit UI
st.title("Multi-Model Chatbot")

# Sidebar for model selection
st.sidebar.header("Model Selection")
model_type = st.sidebar.radio("Choose Model Type", ["Ollama", "Transformers", "API"])

if model_type == "Ollama":
    model = st.sidebar.selectbox("Choose Ollama Model", ["llama2", "mistral", "vicuna"])
elif model_type == "Transformers":
    model = st.sidebar.selectbox("Choose Transformers Model", ["gpt2", "distilgpt2", "gpt2-medium"])
else:
    api_key = st.sidebar.text_input("Enter API Key", type="password")

# Domain selection
st.sidebar.header("Domain Selection")
domain = st.sidebar.selectbox("Choose Domain", ["General", "Technical", "Creative", "Business"])

# Chat interface
st.header("Chat Interface")
user_input = st.text_input("You:", key="user_input")

if st.button("Send"):
    if user_input:
        # Prepare prompt based on domain
        domain_prompts = {
            "General": "Answer the following question:",
            "Technical": "Provide a technical explanation for:",
            "Creative": "Generate a creative response to:",
            "Business": "Give a business-oriented answer to:"
        }
        prompt = f"{domain_prompts[domain]} {user_input}"

        # Get response based on selected model
        if model_type == "Ollama":
            response = get_ollama_response(model, prompt)
        elif model_type == "Transformers":
            response = get_transformers_response(model, prompt)
        else:
            if api_key:
                response = get_api_response(api_key, prompt)
            else:
                response = "Please enter an API key."

        st.text_area("Chatbot:", value=response, height=200, max_chars=None, key="response")
    else:
        st.warning("Please enter a message.")

# Display chat history (you'd need to implement chat history storage)
st.header("Chat History")
# Placeholder for chat history
st.text("Chat history will be displayed here.")
