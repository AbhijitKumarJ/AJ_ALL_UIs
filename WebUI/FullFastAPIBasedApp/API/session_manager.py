# session_manager.py
from datetime import datetime
from user_manager import UserManager

class SessionManager:
    def __init__(self, user_manager: UserManager):
        self.user_manager = user_manager

    def create_session(self, user_id: str, session_name: str) -> str:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        folder_name = f"{timestamp}_{session_name}"
        self.user_manager.add_user_session(user_id, session_name, folder_name)
        return folder_name

    def get_session_folder(self, user_id: str, session_name: str) -> Optional[str]:
        sessions = self.user_manager.get_user_sessions(user_id)
        return sessions.get(session_name) if sessions else None
