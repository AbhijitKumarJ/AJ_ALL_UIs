# model_management_tab.py

import customtkinter as ctk
import tkinter as tk
from tkinter import messagebox
import threading
import subprocess
import re

class ModelManagementTab:
    def __init__(self, parent, ollama_provider, ollama_model_manager):
        self.parent = parent
        self.ollama_provider = ollama_provider
        self.ollama_model_manager = ollama_model_manager

        self.parent.grid_columnconfigure(0, weight=1)
        self.parent.grid_rowconfigure(0, weight=1)

        self.create_widgets()

    def create_widgets(self):
        self.model_list = tk.Listbox(self.parent, bg=self.parent.cget('fg_color'), 
                                     fg='white', selectbackground='#1f538d')
        self.model_list.grid(row=0, column=0, columnspan=2, padx=10, pady=10, sticky="nsew")

        self.refresh_button = ctk.CTkButton(self.parent, text="Refresh Models", command=self.load_models)
        self.refresh_button.grid(row=1, column=0, pady=5)

        self.delete_button = ctk.CTkButton(self.parent, text="Delete Selected", command=self.delete_selected_model)
        self.delete_button.grid(row=1, column=1, pady=5)

        self.pull_frame = ctk.CTkFrame(self.parent)
        self.pull_frame.grid(row=2, column=0, columnspan=2, pady=10)

        self.pull_entry = ctk.CTkEntry(self.pull_frame, placeholder_text="Enter model name")
        self.pull_entry.grid(row=0, column=0, padx=(0, 10))

        self.pull_button = ctk.CTkButton(self.pull_frame, text="Pull Model", command=self.pull_model)
        self.pull_button.grid(row=0, column=1)

        self.progress_bar = ctk.CTkProgressBar(self.parent)
        self.progress_bar.grid(row=3, column=0, columnspan=2, padx=10, pady=5, sticky="ew")
        self.progress_bar.set(0)

        self.progress_label = ctk.CTkLabel(self.parent, text="")
        self.progress_label.grid(row=4, column=0, columnspan=2)

        self.preset_label = ctk.CTkLabel(self.parent, text="Model Presets:")
        self.preset_label.grid(row=5, column=0, columnspan=2, pady=(10, 0))

        self.preset_text = ctk.CTkTextbox(self.parent, height=100)
        self.preset_text.grid(row=6, column=0, columnspan=2, padx=10, pady=10, sticky="ew")

        self.load_models()
        self.update_presets()

    def load_models(self):
        models = self.ollama_provider.get_models()
        self.model_list.delete(0, tk.END)
        for model in models:
            self.model_list.insert(tk.END, model["name"])

    def pull_model(self):
        model_name = self.pull_entry.get()
        if not model_name:
            messagebox.showwarning("Warning", "Please enter a model name.")
            return
        threading.Thread(target=self._pull_model_thread, args=(model_name,), daemon=True).start()

    def _pull_model_thread(self, model_name):
        try:
            process = subprocess.Popen(["ollama", "pull", model_name], 
                                       stdout=subprocess.PIPE, 
                                       stderr=subprocess.STDOUT,
                                       universal_newlines=True)
            
            for line in process.stdout:
                self.update_progress(line)

            process.wait()
            if process.returncode == 0:
                self.parent.after(0, lambda: messagebox.showinfo("Success", f"Model {model_name} pulled successfully."))
                self.parent.after(0, self.load_models)
            else:
                self.parent.after(0, lambda: messagebox.showerror("Error", f"Failed to pull model {model_name}."))
        except Exception as e:
            self.parent.after(0, lambda: messagebox.showerror("Error", f"An error occurred: {str(e)}"))

        self.parent.after(0, self.reset_progress)

    def update_progress(self, line):
        progress_match = re.search(r'(\d+)%', line)
        if progress_match:
            progress = int(progress_match.group(1)) / 100
            self.parent.after(0, lambda: self.progress_bar.set(progress))
        self.parent.after(0, lambda: self.progress_label.configure(text=line.strip()))

    def reset_progress(self):
        self.progress_bar.set(0)
        self.progress_label.configure(text="")

    def delete_selected_model(self):
        selected = self.model_list.curselection()
        if not selected:
            messagebox.showwarning("Warning", "Please select a model to delete.")
            return
        model_name = self.model_list.get(selected[0])
        self.ollama_model_manager.delete_model(model_name, self.load_models)

    def update_presets(self):
        presets = self.ollama_model_manager.get_model_presets()
        self.preset_text.delete('1.0', tk.END)
        for model, settings in presets.items():
            self.preset_text.insert(tk.END, f"{model}:\n")
            for key, value in settings.items():
                self.preset_text.insert(tk.END, f"  {key}: {value}\n")
            self.preset_text.insert(tk.END, "\n")