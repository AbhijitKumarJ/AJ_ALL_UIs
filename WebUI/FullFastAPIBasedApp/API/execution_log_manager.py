# execution_log_manager.py
from datetime import datetime

from .api_entities import LogEntry
from .log_manager import LogManager


class ExecutionLogManager(LogManager):
    def __init__(self):
        super().__init__("execution")

    def log_execution(self, log_entry: LogEntry):
        data = {
            "user_id": log_entry.user_id,
            "log_type": log_entry.log_type,
            "content": log_entry.content,
            "timestamp": log_entry.timestamp or datetime.now(),
        }
        self.log_entry(log_entry.user_id, data)
