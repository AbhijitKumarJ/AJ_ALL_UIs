# main.py

import customtkinter as ctk
from chat_tab import ChatTab
from model_management_tab import ModelManagementTab
from huggingface_tab import HuggingFaceTab
from config_tab import ConfigTab
from api_inference_providers import OllamaProvider, OpenAIProvider, GroqProvider, ClaudeProvider, GeminiProvider
from transformer_inference import TransformerInference
from ollama_model_manager import OllamaModelManager
import json
import os

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

class AdvancedLLMChatManager(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Advanced LLM Chat Manager")
        self.geometry("1000x700")

        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self.config = self.load_config()
        self.initialize_providers()

        self.transformer_inference = TransformerInference()
        self.ollama_model_manager = OllamaModelManager(self.ollama_provider)

        self.create_widgets()

    def load_config(self):
        config_file = "config.json"
        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                return json.load(f)
        return {}

    def initialize_providers(self):
        self.ollama_provider = OllamaProvider()
        self.openai_provider = OpenAIProvider(self.config.get("openai_api_key", "gpt-3.5-turbo"))
        self.groq_provider = GroqProvider(self.config.get("groq_api_key", "llama3-8b-8192"))
        self.claude_provider = ClaudeProvider(self.config.get("anthropic_api_key", "claude-3-opus-20240229"))
        self.gemini_provider = GeminiProvider(self.config.get("google_api_key", "gemini-1.5-flash"))

    def create_widgets(self):
        self.tabview = ctk.CTkTabview(self)
        self.tabview.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")

        self.chat_tab = ChatTab(self.tabview.add("Chat"), 
                                [self.ollama_provider, self.openai_provider, self.groq_provider, 
                                 self.claude_provider, self.gemini_provider],
                                self.transformer_inference)
        self.model_tab = ModelManagementTab(self.tabview.add("Model Management"), 
                                            self.ollama_provider, self.ollama_model_manager)
        self.hf_tab = HuggingFaceTab(self.tabview.add("HuggingFace"))
        self.config_tab = ConfigTab(self.tabview.add("Configuration"))

        # Set default provider and model if configured
        if self.config.get("default_provider") and self.config.get("default_model"):
            self.chat_tab.set_default_provider_and_model(
                self.config["default_provider"],
                self.config["default_model"]
            )

    def run(self):
        self.mainloop()

if __name__ == "__main__":
    app = AdvancedLLMChatManager()
    app.run()