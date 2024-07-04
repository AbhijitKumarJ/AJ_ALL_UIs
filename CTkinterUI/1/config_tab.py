# config_tab.py

import customtkinter as ctk
import json
import os
from tkinter import messagebox

class ConfigTab:
    def __init__(self, parent):
        self.parent = parent
        self.parent.grid_columnconfigure(0, weight=1)
        self.config_file = "config.json"
        self.config = self.load_config()
        self.create_widgets()

    def create_widgets(self):
        self.api_keys_frame = ctk.CTkFrame(self.parent)
        self.api_keys_frame.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")

        self.api_keys = {
            "OpenAI": ctk.CTkEntry(self.api_keys_frame),
            "Groq": ctk.CTkEntry(self.api_keys_frame),
            "Anthropic": ctk.CTkEntry(self.api_keys_frame),
            "Google": ctk.CTkEntry(self.api_keys_frame),
        }

        for i, (key, entry) in enumerate(self.api_keys.items()):
            label = ctk.CTkLabel(self.api_keys_frame, text=f"{key} API Key:")
            label.grid(row=i, column=0, padx=10, pady=5, sticky="e")
            entry.grid(row=i, column=1, padx=10, pady=5, sticky="ew")
            entry.insert(0, self.config.get(f"{key.lower()}_api_key", ""))

        self.default_frame = ctk.CTkFrame(self.parent)
        self.default_frame.grid(row=1, column=0, padx=20, pady=20, sticky="nsew")

        self.default_provider = ctk.CTkOptionMenu(self.default_frame, values=["Ollama", "OpenAI", "Groq", "Anthropic", "Google"])
        self.default_provider.set(self.config.get("default_provider", "Ollama"))
        self.default_provider.grid(row=0, column=1, padx=10, pady=5)

        self.default_model = ctk.CTkEntry(self.default_frame)
        self.default_model.insert(0, self.config.get("default_model", ""))
        self.default_model.grid(row=1, column=1, padx=10, pady=5)

        ctk.CTkLabel(self.default_frame, text="Default Provider:").grid(row=0, column=0, padx=10, pady=5, sticky="e")
        ctk.CTkLabel(self.default_frame, text="Default Model:").grid(row=1, column=0, padx=10, pady=5, sticky="e")

        self.save_button = ctk.CTkButton(self.parent, text="Save Configuration", command=self.save_config)
        self.save_button.grid(row=2, column=0, pady=20)

    def load_config(self):
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r') as f:
                return json.load(f)
        return {}

    def save_config(self):
        config = {
            "openai_api_key": self.api_keys["OpenAI"].get(),
            "groq_api_key": self.api_keys["Groq"].get(),
            "anthropic_api_key": self.api_keys["Anthropic"].get(),
            "google_api_key": self.api_keys["Google"].get(),
            "default_provider": self.default_provider.get(),
            "default_model": self.default_model.get()
        }
        with open(self.config_file, 'w') as f:
            json.dump(config, f, indent=2)
        messagebox.showinfo("Success", "Configuration saved successfully.")

