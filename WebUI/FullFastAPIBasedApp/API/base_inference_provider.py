
class BaseProvider:
    def get_response(self, message, model, callback):
        raise NotImplementedError