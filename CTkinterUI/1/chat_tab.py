# chat_tab.py

import customtkinter as ctk
import tkinter as tk
from tkinter import messagebox
import threading
import asyncio
from base_inference_provider import BaseProvider

class ChatTab:
    def __init__(self, parent, providers, transformer_inference):
        self.parent = parent
        self.providers = {provider.__class__.__name__: provider for provider in providers}
        self.transformer_inference = transformer_inference

        self.parent.grid_columnconfigure(0, weight=1)
        self.parent.grid_rowconfigure(0, weight=1)

        self.create_widgets()
        self.message_being_processed = False

    def create_widgets(self):
        self.chat_area = ctk.CTkTextbox(self.parent, wrap="word", state="disabled")
        self.chat_area.grid(row=0, column=0, columnspan=2, padx=10, pady=(10, 0), sticky="nsew")

        self.input_frame = ctk.CTkFrame(self.parent)
        self.input_frame.grid(row=1, column=0, columnspan=2, padx=10, pady=10, sticky="ew")
        self.input_frame.grid_columnconfigure(0, weight=1)

        self.message_entry = ctk.CTkTextbox(self.input_frame, height=60, wrap="word")
        self.message_entry.grid(row=0, column=0, padx=(0, 10), sticky="ew")
        self.message_entry.bind("<Control-Return>", self.send_message)

        self.send_button = ctk.CTkButton(self.input_frame, text="Send", command=self.send_message)
        self.send_button.grid(row=0, column=1)

        self.provider_var = ctk.StringVar(value="OllamaProvider")
        self.provider_dropdown = ctk.CTkOptionMenu(self.parent, values=list(self.providers.keys()), variable=self.provider_var)
        self.provider_dropdown.grid(row=2, column=0, pady=10)

        self.model_var = ctk.StringVar()
        self.model_dropdown = ctk.CTkOptionMenu(self.parent, variable=self.model_var)
        self.model_dropdown.grid(row=2, column=1, pady=10)

        self.provider_var.trace_add("write", self.update_models)
        self.update_models()

    def update_models(self, *args):
        provider = self.providers[self.provider_var.get()]
        if hasattr(provider, 'get_models'):
            models = provider.get_models()
            self.model_dropdown.configure(values=[model['name'] for model in models])
            if models:
                self.model_var.set(models[0]['name'])
        else:
            self.model_dropdown.configure(values=["default"])
            self.model_var.set("default")

    def send_message(self, event=None):
        if self.message_being_processed:
            messagebox.showinfo("Processing", "Please wait for the current message to be processed.")
            return

        message = self.message_entry.get("1.0", tk.END).strip()
        if not message:
            return

        self.message_being_processed = True
        self.display_user_message(message)
        self.message_entry.delete("1.0", tk.END)

        provider = self.providers[self.provider_var.get()]
        model = self.model_var.get()

        self.display_processing_indicator()

        threading.Thread(target=self.process_message, args=(provider, model, message), daemon=True).start()

    def process_message(self, provider, model, message):
        if isinstance(provider, BaseProvider):
            provider.get_response(message, model, self.update_response)
        else:
            response = self.transformer_inference.generate(message, model)
            self.update_response(response)

    def display_user_message(self, message):
        self.chat_area.configure(state="normal")
        self.chat_area.insert(tk.END, f"You: {message}\n\n")
        self.chat_area.configure(state="disabled")
        self.chat_area.see(tk.END)

    def display_processing_indicator(self):
        self.chat_area.configure(state="normal")
        self.chat_area.insert(tk.END, "AI: Processing...\n")
        self.chat_area.configure(state="disabled")
        self.chat_area.see(tk.END)

    def update_response(self, response):
        self.chat_area.configure(state="normal")
        self.chat_area.delete("end-2l", "end-1c")  # Remove "Processing..." line
        self.chat_area.insert(tk.END, f"AI: {response}\n\n")
        self.chat_area.configure(state="disabled")
        self.chat_area.see(tk.END)
        self.message_being_processed = False

    def run_async(self, coro):
        asyncio.run_coroutine_threadsafe(coro, asyncio.get_event_loop())

    def set_default_provider_and_model(self, provider, model):
        if provider in self.providers:
            self.provider_var.set(provider)
            self.update_models()
            if model in self.model_dropdown.cget("values"):
                self.model_var.set(model)