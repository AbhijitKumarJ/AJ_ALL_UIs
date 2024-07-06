# user_manager.py
import json
import os
from typing import Any, Dict, List, Optional


class UserManager:
    def __init__(self, users_file: str = "./userfiles/users.json"):
        self.users_file = users_file
        self.ensure_users_file()

    def ensure_users_file(self):
        if not os.path.exists(self.users_file):
            with open(self.users_file, "w") as f:
                json.dump({}, f)

    def get_users(self) -> Dict[str, Dict]:
        self.ensure_users_file()
        with open(self.users_file, "r") as f:
            return json.load(f)

    def add_user(self, user_id: str) -> Any:
        users = self.get_users()
        if user_id not in users:
            users[user_id] = {"sessions": {}}
            with open(self.users_file, "w") as f:
                json.dump(users, f, indent=2)
        return users

    def get_user_sessions(self, user_id: str) -> Optional[Dict[str, str]]:
        users = self.get_users()
        return users.get(user_id, {}).get("sessions")

    def add_user_session(
        self, user_id: str, session_name: str, folder_name: str
    ) -> None:
        users = self.get_users()
        if user_id not in users:
            users = self.add_user(user_id)
        users[user_id]["sessions"][session_name] = folder_name
        with open(self.users_file, "w") as f:
            json.dump(users, f, indent=2)
