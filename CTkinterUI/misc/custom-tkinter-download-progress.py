import customtkinter as ctk
import requests
from threading import Thread

class DownloadApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("File Downloader")
        self.geometry("400x200")

        self.url_entry = ctk.CTkEntry(self, width=300, placeholder_text="Enter URL")
        self.url_entry.pack(pady=10)

        self.download_button = ctk.CTkButton(self, text="Download", command=self.start_download)
        self.download_button.pack(pady=10)

        self.progress_bar = ctk.CTkProgressBar(self, width=300)
        self.progress_bar.set(0)
        self.progress_bar.pack(pady=10)

        self.status_label = ctk.CTkLabel(self, text="")
        self.status_label.pack(pady=10)

    def start_download(self):
        url = self.url_entry.get()
        if url:
            self.download_button.configure(state="disabled")
            Thread(target=self.download_file, args=(url,)).start()

    def download_file(self, url):
        try:
            response = requests.get(url, stream=True)
            total_size = int(response.headers.get('content-length', 0))
            block_size = 1024
            downloaded = 0

            with open("downloaded_file", "wb") as file:
                for data in response.iter_content(block_size):
                    file.write(data)
                    downloaded += len(data)
                    progress = (downloaded / total_size) if total_size > 0 else 0
                    self.update_progress(progress)

            self.status_label.configure(text="Download completed!")
        except Exception as e:
            self.status_label.configure(text=f"Error: {str(e)}")
        finally:
            self.download_button.configure(state="normal")

    def update_progress(self, progress):
        self.progress_bar.set(progress)
        self.status_label.configure(text=f"{progress:.1%} downloaded")

if __name__ == "__main__":
    app = DownloadApp()
    app.mainloop()
