# main.py

import customtkinter as ctk
from chat_tab import ChatTab
from model_management_tab import ModelManagementTab
from huggingface_tab import HuggingFaceTab
from ollama_api import OllamaAPI
from model_manager import ModelManager
from huggingface_manager import HuggingFaceManager

ctk.set_appearance_mode("System")
ctk.set_default_color_theme("blue")

class OllamaChatManager(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Ollama Chat Manager")
        self.geometry("900x600")

        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self.ollama_api = OllamaAPI()
        self.model_manager = ModelManager()
        self.huggingface_manager = HuggingFaceManager()

        self.create_widgets()

    def create_widgets(self):
        self.tabview = ctk.CTkTabview(self)
        self.tabview.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")

        self.chat_tab = ChatTab(self.tabview.add("Chat"), self.ollama_api)
        self.model_tab = ModelManagementTab(self.tabview.add("Model Management"), self.ollama_api, self.model_manager)
        self.hf_tab = HuggingFaceTab(self.tabview.add("HuggingFace Download"), self.huggingface_manager)

if __name__ == "__main__":
    app = OllamaChatManager()
    app.mainloop()

# chat_tab.py

import customtkinter as ctk
import tkinter as tk

class ChatTab:
    def __init__(self, parent, ollama_api):
        self.parent = parent
        self.ollama_api = ollama_api

        self.parent.grid_columnconfigure(0, weight=1)
        self.parent.grid_rowconfigure(0, weight=1)

        self.create_widgets()

    def create_widgets(self):
        self.chat_area = ctk.CTkTextbox(self.parent, wrap="word", state="disabled")
        self.chat_area.grid(row=0, column=0, padx=10, pady=(10, 0), sticky="nsew")

        self.input_frame = ctk.CTkFrame(self.parent)
        self.input_frame.grid(row=1, column=0, padx=10, pady=10, sticky="ew")
        self.input_frame.grid_columnconfigure(0, weight=1)

        self.message_entry = ctk.CTkEntry(self.input_frame, placeholder_text="Type your message...")
        self.message_entry.grid(row=0, column=0, padx=(0, 10), sticky="ew")

        self.send_button = ctk.CTkButton(self.input_frame, text="Send", command=self.send_message)
        self.send_button.grid(row=0, column=1)

        self.model_var = ctk.StringVar()
        self.model_dropdown = ctk.CTkOptionMenu(self.parent, variable=self.model_var)
        self.model_dropdown.grid(row=2, column=0, pady=10)

        self.load_models()

    def send_message(self):
        message = self.message_entry.get()
        if not message:
            return

        self.chat_area.configure(state="normal")
        self.chat_area.insert(tk.END, f"You: {message}\n")
        self.chat_area.configure(state="disabled")
        self.chat_area.see(tk.END)
        self.message_entry.delete(0, tk.END)

        self.ollama_api.get_response(message, self.model_var.get(), self.display_response)

    def display_response(self, response):
        self.chat_area.configure(state="normal")
        self.chat_area.insert(tk.END, f"AI: {response}\n\n")
        self.chat_area.configure(state="disabled")
        self.chat_area.see(tk.END)

    def load_models(self):
        models = self.ollama_api.get_models()
        if models:
            self.model_dropdown.configure(values=[model["name"] for model in models])
            self.model_var.set(models[0]["name"])

# model_management_tab.py

import customtkinter as ctk
import tkinter as tk

class ModelManagementTab:
    def __init__(self, parent, ollama_api, model_manager):
        self.parent = parent
        self.ollama_api = ollama_api
        self.model_manager = model_manager

        self.parent.grid_columnconfigure(0, weight=1)
        self.parent.grid_rowconfigure(0, weight=1)

        self.create_widgets()

    def create_widgets(self):
        self.model_list = tk.Listbox(self.parent, bg=self.parent.cget('fg_color'), 
                                     fg='white', selectbackground='#1f538d')
        self.model_list.grid(row=0, column=0, padx=10, pady=10, sticky="nsew")

        self.refresh_button = ctk.CTkButton(self.parent, text="Refresh Models", command=self.load_models)
        self.refresh_button.grid(row=1, column=0, pady=5)

        self.pull_frame = ctk.CTkFrame(self.parent)
        self.pull_frame.grid(row=2, column=0, pady=10)

        self.pull_entry = ctk.CTkEntry(self.pull_frame, placeholder_text="Enter model name")
        self.pull_entry.grid(row=0, column=0, padx=(0, 10))

        self.pull_button = ctk.CTkButton(self.pull_frame, text="Pull Model", command=self.pull_model)
        self.pull_button.grid(row=0, column=1)

        self.load_models()

    def load_models(self):
        models = self.ollama_api.get_models()
        self.model_list.delete(0, tk.END)
        for model in models:
            self.model_list.insert(tk.END, model["name"])

    def pull_model(self):
        model_name = self.pull_entry.get()
        if not model_name:
            ctk.messagebox.showwarning("Warning", "Please enter a model name.")
            return
        self.model_manager.pull_model(model_name, self.load_models)

# huggingface_tab.py

import customtkinter as ctk

class HuggingFaceTab:
    def __init__(self, parent, huggingface_manager):
        self.parent = parent
        self.huggingface_manager = huggingface_manager

        self.parent.grid_columnconfigure(0, weight=1)

        self.create_widgets()

    def create_widgets(self):
        self.hf_entry = ctk.CTkEntry(self.parent, placeholder_text="Enter HuggingFace repository ID")
        self.hf_entry.grid(row=0, column=0, padx=20, pady=(20, 10), sticky="ew")

        self.hf_button = ctk.CTkButton(self.parent, text="Download from HuggingFace", command=self.download_from_hf)
        self.hf_button.grid(row=1, column=0, padx=20, pady=10)

    def download_from_hf(self):
        repo_id = self.hf_entry.get()
        if not repo_id:
            ctk.messagebox.showwarning("Warning", "Please enter a HuggingFace repository ID.")
            return
        self.huggingface_manager.download_model(repo_id)

# ollama_api.py

import requests
import threading
from tkinter import messagebox

class OllamaAPI:
    def __init__(self, base_url="http://localhost:11434"):
        self.base_url = base_url

    def get_models(self):
        try:
            response = requests.get(f"{self.base_url}/api/tags")
            return response.json()["models"]
        except requests.RequestException:
            messagebox.showerror("Error", "Failed to fetch models. Is Ollama running?")
            return []

    def get_response(self, message, model, callback):
        def _get_response():
            try:
                response = requests.post(f"{self.base_url}/api/generate", 
                                         json={"model": model, "prompt": message})
                response_text = response.json()["response"]
                callback(response_text)
            except requests.RequestException:
                callback("Error: Failed to get response from Ollama.")

        threading.Thread(target=_get_response, daemon=True).start()

# model_manager.py

import subprocess
import threading
from tkinter import messagebox

class ModelManager:
    def pull_model(self, model_name, callback):
        def _pull_model():
            try:
                subprocess.run(["ollama", "pull", model_name], check=True)
                messagebox.showinfo("Success", f"Model {model_name} pulled successfully.")
                callback()
            except subprocess.CalledProcessError:
                messagebox.showerror("Error", f"Failed to pull model {model_name}.")

        threading.Thread(target=_pull_model, daemon=True).start()

# huggingface_manager.py

from tkinter import messagebox

class HuggingFaceManager:
    def download_model(self, repo_id):
        # This is a placeholder. You'd need to implement the actual download logic.
        messagebox.showinfo("Info", f"Downloading from {repo_id}. This feature is not fully implemented.")
