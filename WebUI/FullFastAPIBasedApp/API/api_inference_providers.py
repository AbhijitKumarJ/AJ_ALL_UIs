# api_inference_providers.py

import requests
import google.generativeai as genai
from anthropic import Anthropic
import openai
from groq import Groq
from .base_inference_provider import BaseProvider



class OllamaProvider(BaseProvider):
    def __init__(self, base_url="http://localhost:11434"):
        self.base_url = base_url

    def get_response(self, message, model, callback):
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={"model": model, "prompt": message, "stream": False},
            )
            response_text = response.json()["response"]
            callback(response_text)
        except requests.RequestException:
            callback("Error: Failed to get response from Ollama.")

    def get_models(self):
        try:
            response = requests.get(f"{self.base_url}/api/tags")
            return response.json()["models"]
        except requests.RequestException:
            return []


class OpenAIProvider(BaseProvider):
    def __init__(self, api_key):
        self.client = openai.OpenAI(api_key=api_key)

    def get_response(self, message, model, callback):
        try:
            response = self.client.chat.completions.create(
                model=model, messages=[{"role": "user", "content": message}]
            )
            callback(response.choices[0].message.content)
        except Exception as e:
            callback(f"Error: {str(e)}")

    def get_models(self):
        try:
            response = [
                {"name": "gpt-3.5-turbo"},
                {"name": "gpt-3.5-turbo-1106"},
                {"name": "gpt-4-turbo"},
                {"name": "gpt-4"},
                {"name": "gpt-4o"}
            ]
            return response
        except requests.RequestException:
            return []


class GroqProvider(BaseProvider):
    def __init__(self, api_key):
        self.client = Groq(api_key=api_key)

    def get_response(self, message, model, callback):
        try:
            response = self.client.chat.completions.create(
                model=model, messages=[{"role": "user", "content": message}]
            )
            callback(response.choices[0].message.content)
        except Exception as e:
            callback(f"Error: {str(e)}")

    def get_models(self):
        try:
            #latest_model_list = self.client.models.data
            response = [
                {"name": "llama3-8b-8192"},
                {"name": "gemma2-9b-it"},
                {"name": "gemma-7b-it"},
                {"name": "llama3-70b-8192"},
                {"name": "mixtral-8x7b-32768"} #,
                #{"id": "whisper-large-v3"},
            ]
            return response
        except requests.RequestException:
            return []


class ClaudeProvider(BaseProvider):
    def __init__(self, api_key):
        self.client = Anthropic(api_key=api_key)

    def get_response(self, message, model, callback):
        try:
            response = self.client.completions.create(
                model=model, prompt=message, max_tokens_to_sample=1000
            )
            callback(response.completion)
        except Exception as e:
            callback(f"Error: {str(e)}")

    def get_models(self):
        try:
            response = [
                {"name": "claude-3-haiku-20240307"},
                {"name": "claude-3-sonnet-20240229"},
                {"name": "claude-3-opus-20240229"}
            ]
            return response
        except requests.RequestException:
            return []

class GeminiProvider(BaseProvider):
    def __init__(self, api_key):
        genai.configure(api_key=api_key)

    def get_response(self, message, model, callback):
        try:
            model = genai.GenerativeModel(model)
            response = model.generate_content(message)
            callback(response.text)
        except Exception as e:
            callback(f"Error: {str(e)}")

    def get_models(self):
        try:
            response = [
                {"name": "gemini-1.5-flash"},
                {"name": "gemini-1.0-pro"}
            ]
            return response
        except requests.RequestException:
            return []
