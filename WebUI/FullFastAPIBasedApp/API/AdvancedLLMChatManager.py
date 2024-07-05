from .api_inference_providers import OllamaProvider, OpenAIProvider, GroqProvider, ClaudeProvider, GeminiProvider
#from .ollama_model_manager import OllamaModelManager
import json
import os

class AdvancedLLMChatManager():
    def __init__(self):
        self.config = self.load_config()
        self.initialize_providers()

        #self.transformer_inference = TransformerInference()
        #self.ollama_model_manager = OllamaModelManager(self.ollama_provider)

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

    def get_providers(self):
        return ["Ollama", "Groq", "Claude", "OpenAI", "Gemini"]