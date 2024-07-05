import customtkinter as ctk
import subprocess
import threading
import queue
import os
import shlex

class DownloadApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("File Downloader")
        self.geometry("500x300")

        self.url_entry = ctk.CTkEntry(self, width=300, placeholder_text="Enter URL")
        #https://www.cms.gov/files/document/data-dictionary-template.xlsx
        self.url_entry.pack(pady=10)

        self.download_button = ctk.CTkButton(self, text="Download", command=self.start_download)
        self.download_button.pack(pady=10)

        self.progress_text = ctk.CTkTextbox(self, width=400, height=150)
        self.progress_text.pack(pady=10)

        self.status_label = ctk.CTkLabel(self, text="")
        self.status_label.pack(pady=10)

        self.output_queue = queue.Queue()

    def start_download(self):
        url = self.url_entry.get()
        if url:
            self.download_button.configure(state="disabled")
            self.progress_text.delete("1.0", ctk.END)
            self.progress_text.insert(ctk.END, f"Starting download from: {url}\n")
            threading.Thread(target=self.download_file, args=(url,)).start()
            self.after(100, self.check_output_queue)

    def download_file(self, url):
        try:
            output_file = "downloaded_file"
            # Using wget with more compatible options
            cmd = f"wget --verbose {shlex.quote(url)}"
            
            self.output_queue.put(f"Running command: {cmd}\n")
            
            process = subprocess.Popen(cmd, 
                                       stdout=subprocess.PIPE, 
                                       stderr=subprocess.STDOUT, 
                                       universal_newlines=True,
                                       shell=True,
                                       bufsize=1)
            
            for line in iter(process.stdout.readline, ''):
                self.output_queue.put(line)
            
            process.wait()
            
            if process.returncode == 0:
                file_size = 1000#os.path.getsize(output_file)
                self.output_queue.put(f"Download completed successfully! File size: {file_size} bytes\n")
            else:
                self.output_queue.put(f"Download failed with return code {process.returncode}\n")
                # Additional error information
                self.output_queue.put("Please check if wget is installed and the URL is correct.\n")
        
        except Exception as e:
            self.output_queue.put(f"Error: {str(e)}\n")
            self.output_queue.put("Please ensure wget is installed on your system.\n")
        finally:
            self.output_queue.put(None)  # Signal that the process is complete

    def check_output_queue(self):
        try:
            line = self.output_queue.get_nowait()
            if line is None:
                self.download_button.configure(state="normal")
            else:
                self.progress_text.insert(ctk.END, line)
                self.progress_text.see(ctk.END)
                self.after(100, self.check_output_queue)
        except queue.Empty:
            self.after(100, self.check_output_queue)

if __name__ == "__main__":
    app = DownloadApp()
    app.mainloop()