import requests
import os
from groq import Groq

api_key = ""

g=Groq(api_key=api_key)
#print(g.models.list().data)
for m in g.models.list().data:
    print(m.to_json())


# {
#   "id": "gemma2-9b-it",
#   "created": 1693721698,
#   "object": "model",
#   "owned_by": "Google",
#   "active": true,
#   "context_window": 8192
# }
# {
#   "id": "gemma-7b-it",
#   "created": 1693721698,
#   "object": "model",
#   "owned_by": "Google",
#   "active": true,
#   "context_window": 8192
# }
# {
#   "id": "llama3-70b-8192",
#   "created": 1693721698,
#   "object": "model",
#   "owned_by": "Meta",
#   "active": true,
#   "context_window": 8192
# }
# {
#   "id": "llama3-8b-8192",
#   "created": 1693721698,
#   "object": "model",
#   "owned_by": "Meta",
#   "active": true,
#   "context_window": 8192
# }
# {
#   "id": "mixtral-8x7b-32768",
#   "created": 1693721698,
#   "object": "model",
#   "owned_by": "Mistral AI",
#   "active": true,
#   "context_window": 32768
# }
# {
#   "id": "whisper-large-v3",
#   "created": 1693721698,
#   "object": "model",
#   "owned_by": "OpenAI",
#   "active": true,
#   "context_window": 1500
# }