# huggingface_tab.py

import customtkinter as ctk
from tkinter import messagebox
import threading
import requests

class HuggingFaceTab:
    def __init__(self, parent):
        self.parent = parent
        self.parent.grid_columnconfigure(0, weight=1)
        self.create_widgets()
        self.downloaded_models = set()  # Set to keep track of downloaded models

    def create_widgets(self):
        self.search_entry = ctk.CTkEntry(self.parent, placeholder_text="Search models...")
        self.search_entry.grid(row=0, column=0, padx=20, pady=(20, 10), sticky="ew")

        self.search_button = ctk.CTkButton(self.parent, text="Search", command=self.search_models)
        self.search_button.grid(row=0, column=1, padx=(0, 20), pady=(20, 10))

        self.limit_label = ctk.CTkLabel(self.parent, text="Max results:")
        self.limit_label.grid(row=1, column=0, padx=(20, 5), pady=5, sticky="e")

        self.limit_entry = ctk.CTkEntry(self.parent, width=50)
        self.limit_entry.grid(row=1, column=1, padx=(0, 20), pady=5, sticky="w")
        self.limit_entry.insert(0, "10")  # Default value

        self.model_list = ctk.CTkScrollableFrame(self.parent)
        self.model_list.grid(row=2, column=0, columnspan=2, padx=20, pady=10, sticky="nsew")
        self.parent.grid_rowconfigure(2, weight=1)

        self.download_button = ctk.CTkButton(self.parent, text="Download Selected", command=self.download_selected)
        self.download_button.grid(row=3, column=0, columnspan=2, padx=20, pady=10)

    def search_models(self):
        query = self.search_entry.get()
        limit = self.limit_entry.get()
        try:
            limit = int(limit)
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid number for max results.")
            return
        threading.Thread(target=self._fetch_models, args=(query, limit), daemon=True).start()

    def _fetch_models(self, query, limit):
        try:
            response = requests.get(f"https://huggingface.co/api/models?search={query}&limit={limit}")
            models = response.json()
            self._display_models(models)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to fetch models: {str(e)}")

    def _display_models(self, models):
        for widget in self.model_list.winfo_children():
            widget.destroy()

        for model in models:
            frame = ctk.CTkFrame(self.model_list)
            frame.pack(fill="x", padx=5, pady=5)

            var = ctk.IntVar()
            checkbox = ctk.CTkCheckBox(frame, text=model['modelId'], variable=var)
            checkbox.pack(side="left")

            if model['modelId'] in self.downloaded_models:
                label = ctk.CTkLabel(frame, text="Downloaded", text_color="green")
                label.pack(side="right")

    def download_selected(self):
        selected_models = [child.cget("text") for child in self.model_list.winfo_children() 
                           if isinstance(child.winfo_children()[0], ctk.CTkCheckBox) and child.winfo_children()[0].get()]
        
        if not selected_models:
            messagebox.showwarning("No Selection", "Please select at least one model to download.")
            return

        for model in selected_models:
            if model not in self.downloaded_models:
                # Placeholder for actual download logic
                messagebox.showinfo("Download", f"Downloading {model}... (This is a placeholder)")
                self.downloaded_models.add(model)
            else:
                messagebox.showinfo("Already Downloaded", f"{model} is already downloaded.")

        self.search_models()  # Refresh the list to show updated status