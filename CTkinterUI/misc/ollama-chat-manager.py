import customtkinter as ctk
import tkinter as tk
from tkinter import messagebox
import requests
import threading
import subprocess

ctk.set_appearance_mode("Dark")  # Modes: "System" (standard), "Dark", "Light"
ctk.set_default_color_theme("blue")  # Themes: "blue" (standard), "green", "dark-blue"

class OllamaChatManager(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Ollama Chat Manager")
        self.geometry("900x600")

        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self.create_widgets()
        self.load_models()

    def create_widgets(self):
        # Create a tabview for tabbed interface
        self.tabview = ctk.CTkTabview(self)
        self.tabview.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")

        # Chat tab
        self.chat_tab = self.tabview.add("Chat")
        self.chat_tab.grid_columnconfigure(0, weight=1)
        self.chat_tab.grid_rowconfigure(0, weight=1)

        self.chat_area = ctk.CTkTextbox(self.chat_tab, wrap="word", state="disabled")
        self.chat_area.grid(row=0, column=0, padx=10, pady=(10, 0), sticky="nsew")

        self.input_frame = ctk.CTkFrame(self.chat_tab)
        self.input_frame.grid(row=1, column=0, padx=10, pady=10, sticky="ew")
        self.input_frame.grid_columnconfigure(0, weight=1)

        self.message_entry = ctk.CTkEntry(self.input_frame, placeholder_text="Type your message...")
        self.message_entry.grid(row=0, column=0, padx=(0, 10), sticky="ew")

        self.send_button = ctk.CTkButton(self.input_frame, text="Send", command=self.send_message)
        self.send_button.grid(row=0, column=1)

        self.model_var = ctk.StringVar()
        self.model_dropdown = ctk.CTkOptionMenu(self.chat_tab, variable=self.model_var)
        self.model_dropdown.grid(row=2, column=0, pady=10)

        # Model Management tab
        self.model_tab = self.tabview.add("Model Management")
        self.model_tab.grid_columnconfigure(0, weight=1)
        self.model_tab.grid_rowconfigure(0, weight=1)

        self.model_list = tk.Listbox(self.model_tab, bg=self.model_tab.cget('fg_color'), 
                                     fg='white', selectbackground='#1f538d')
        self.model_list.grid(row=0, column=0, padx=10, pady=10, sticky="nsew")

        self.refresh_button = ctk.CTkButton(self.model_tab, text="Refresh Models", command=self.load_models)
        self.refresh_button.grid(row=1, column=0, pady=5)

        self.pull_frame = ctk.CTkFrame(self.model_tab)
        self.pull_frame.grid(row=2, column=0, pady=10)

        self.pull_entry = ctk.CTkEntry(self.pull_frame, placeholder_text="Enter model name")
        self.pull_entry.grid(row=0, column=0, padx=(0, 10))

        self.pull_button = ctk.CTkButton(self.pull_frame, text="Pull Model", command=self.pull_model)
        self.pull_button.grid(row=0, column=1)

        # HuggingFace Download tab
        self.hf_tab = self.tabview.add("HuggingFace Download")
        self.hf_tab.grid_columnconfigure(0, weight=1)

        self.hf_entry = ctk.CTkEntry(self.hf_tab, placeholder_text="Enter HuggingFace repository ID")
        self.hf_entry.grid(row=0, column=0, padx=20, pady=(20, 10), sticky="ew")

        self.hf_button = ctk.CTkButton(self.hf_tab, text="Download from HuggingFace", command=self.download_from_hf)
        self.hf_button.grid(row=1, column=0, padx=20, pady=10)

    def load_models(self):
        try:
            response = requests.get("http://localhost:11434/api/tags")
            models = response.json()["models"]
            self.model_list.delete(0, tk.END)
            model_names = [model["name"] for model in models]
            self.model_dropdown.configure(values=model_names)
            for model_name in model_names:
                self.model_list.insert(tk.END, model_name)
            if models:
                self.model_var.set(models[0]["name"])
        except requests.RequestException:
            messagebox.showerror("Error", "Failed to fetch models. Is Ollama running?")

    def send_message(self):
        message = self.message_entry.get()
        if not message:
            return

        self.chat_area.configure(state="normal")
        self.chat_area.insert(tk.END, f"You: {message}\n")
        self.chat_area.configure(state="disabled")
        self.chat_area.see(tk.END)
        self.message_entry.delete(0, tk.END)

        threading.Thread(target=self.get_response, args=(message,), daemon=True).start()

    def get_response(self, message):
        try:
            response = requests.post("http://localhost:11434/api/generate", 
                                     json={"model": self.model_var.get(), "prompt": message})
            response_text = response.json()["response"]
            self.chat_area.configure(state="normal")
            self.chat_area.insert(tk.END, f"AI: {response_text}\n\n")
            self.chat_area.configure(state="disabled")
            self.chat_area.see(tk.END)
        except requests.RequestException:
            self.chat_area.configure(state="normal")
            self.chat_area.insert(tk.END, "Error: Failed to get response from Ollama.\n\n")
            self.chat_area.configure(state="disabled")
            self.chat_area.see(tk.END)

    def pull_model(self):
        model_name = self.pull_entry.get()
        if not model_name:
            messagebox.showwarning("Warning", "Please enter a model name.")
            return

        def pull():
            try:
                subprocess.run(["ollama", "pull", model_name], check=True)
                self.load_models()
                messagebox.showinfo("Success", f"Model {model_name} pulled successfully.")
            except subprocess.CalledProcessError:
                messagebox.showerror("Error", f"Failed to pull model {model_name}.")

        threading.Thread(target=pull, daemon=True).start()

    def download_from_hf(self):
        repo_id = self.hf_entry.get()
        if not repo_id:
            messagebox.showwarning("Warning", "Please enter a HuggingFace repository ID.")
            return

        def download():
            try:
                # This is a placeholder. You'd need to implement the actual download logic.
                # For example, using the huggingface_hub library or custom API calls.
                messagebox.showinfo("Info", f"Downloading from {repo_id}. This feature is not fully implemented.")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to download: {str(e)}")

        threading.Thread(target=download, daemon=True).start()

if __name__ == "__main__":
    app = OllamaChatManager()
    app.mainloop()
