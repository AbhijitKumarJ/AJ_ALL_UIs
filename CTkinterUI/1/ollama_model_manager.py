# ollama_model_manager.py

import subprocess
import threading
from tkinter import messagebox

class OllamaModelManager:
    def __init__(self, api_provider):
        self.api_provider = api_provider

    def pull_model(self, model_name, callback):
        def _pull_model():
            try:
                subprocess.run(["ollama", "pull", model_name], check=True)
                messagebox.showinfo("Success", f"Model {model_name} pulled successfully.")
                callback()
            except subprocess.CalledProcessError:
                messagebox.showerror("Error", f"Failed to pull model {model_name}.")

        threading.Thread(target=_pull_model, daemon=True).start()

    def delete_model(self, model_name, callback):
        if messagebox.askyesno("Confirm Deletion", f"Are you sure you want to delete the model '{model_name}'?"):
            def _delete_model():
                try:
                    subprocess.run(["ollama", "rm", model_name], check=True)
                    messagebox.showinfo("Success", f"Model {model_name} deleted successfully.")
                    callback()
                except subprocess.CalledProcessError:
                    messagebox.showerror("Error", f"Failed to delete model {model_name}.")

            threading.Thread(target=_delete_model, daemon=True).start()

    def get_model_presets(self):
        # This is a placeholder. In a real implementation, you'd fetch this from Ollama's API or a config file.
        return {
            "llama2": {"temperature": 0.7, "top_p": 0.9},
            "mistral": {"temperature": 0.8, "top_k": 40},
            "vicuna": {"temperature": 0.6, "repetition_penalty": 1.1}
        }
