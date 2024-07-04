# transformer_inference.py

from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

class TransformerInference:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.chat_templates = {
            "Qwen2": "<|im_start|>system\nYou are a helpful AI assistant.<|im_end|>\n<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant\n",
            "LLaMA3": "[INST] {prompt} [/INST]",
            "Phi3": "Instruct: {prompt}\nOutput:",
            "Gemma": "<start_of_turn>user\n{prompt}<end_of_turn>\n<start_of_turn>model\n"
        }

    def load_model(self, model_name):
        self.model = AutoModelForCausalLM.from_pretrained(model_name)
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)

    def generate(self, prompt, model_name, max_length=100):
        if not self.model or not self.tokenizer:
            return "Error: Model not loaded"

        template = self.chat_templates.get(model_name, "{prompt}")
        formatted_prompt = template.format(prompt=prompt)

        inputs = self.tokenizer(formatted_prompt, return_tensors="pt")
        with torch.no_grad():
            outputs = self.model.generate(**inputs, max_length=max_length)
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
