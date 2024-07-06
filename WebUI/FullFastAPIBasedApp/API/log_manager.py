# log_manager.py
import os
import json
from datetime import datetime
from typing import Dict, Any

class LogManager:
    def __init__(self, log_type: str):
        self.log_type = log_type

    def ensure_directory(self, path: str):
        os.makedirs(path, exist_ok=True)

    def get_session_directory(self, user_id: str) -> str:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        directory = f"userfiles/logs/{user_id}/{timestamp}"
        self.ensure_directory(directory)
        return directory

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

    def log_entry(self, user_id: str, data: Dict[str, Any]):
        session_dir = self.get_session_directory(user_id)
        log_file = f"{session_dir}/{self.log_type}_log.json"
        self.append_to_json_file(log_file, data)

    def get_log(self, user_id: str):
        user_logs_dir = f"userfiles/logs/{user_id}"
        if not os.path.exists(user_logs_dir):
            return None

        sessions = sorted(os.listdir(user_logs_dir), reverse=True)
        if not sessions:
            return None

        latest_session = sessions[0]
        log_file = f"{user_logs_dir}/{latest_session}/{self.log_type}_log.json"

        if not os.path.exists(log_file):
            return None

        with open(log_file, 'r') as file:
            log_data = json.load(file)

        return {"user_id": user_id, "session": latest_session, f"{self.log_type}_log": log_data}
