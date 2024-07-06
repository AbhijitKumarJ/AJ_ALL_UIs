# log_manager.py
import os
import json
from datetime import datetime
from typing import Dict, Any, List

class LogManager:
    def __init__(self, log_type: str):
        self.log_type = log_type

    def ensure_directory(self, path: str):
        os.makedirs(path, exist_ok=True)

    def append_to_json_file(self, file_path: str, data: Dict[str, Any]):
        if os.path.exists(file_path):
            with open(file_path, 'r+') as file:
                file_data = json.load(file)
                file_data.append(data)
                file.seek(0)
                json.dump(file_data, file, default=str, indent=2)
        else:
            with open(file_path, 'w') as file:
                json.dump([data], file, default=str, indent=2)

    def log_entry(self, user_id: str, session_folder: str, data: Dict[str, Any]):
        log_dir = f"userfiles/logs/{user_id}/{session_folder}"
        self.ensure_directory(log_dir)
        log_file = f"{log_dir}/{self.log_type}_log.json"
        self.append_to_json_file(log_file, data)

    def get_log(self, user_id: str, session_folder: str) -> List[Dict[str, Any]]:
        log_file = f"userfiles/logs/{user_id}/{session_folder}/{self.log_type}_log.json"
        if not os.path.exists(log_file):
            return []
        with open(log_file, 'r') as file:
            return json.load(file)