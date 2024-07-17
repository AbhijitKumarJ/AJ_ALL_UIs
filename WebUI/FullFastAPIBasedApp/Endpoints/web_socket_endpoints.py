import os
import shlex
import signal
from fastapi import WebSocket, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import asyncio

# Create an APIRouter
router = APIRouter()

# Global variable to store the current process
current_process = None

async def read_stream(stream, websocket):
    while True:
        line = await stream.readline()
        if line:
            await websocket.send_text(line.decode())
        else:
            break

@router.websocket("/terminal")
async def terminal_websocket(websocket: WebSocket):
    global current_process
    await websocket.accept()
    
    home_dir = os.path.expanduser("~")
    profile_script = os.path.join(home_dir, ".bash_profile")
    
    while True:
        command = await websocket.receive_text()
        
        full_command = f"""
        source {profile_script} 2>/dev/null || true
        export PATH="/run/host/usr/local/bin:$PATH"
        echo "Current PATH: $PATH"
        echo "Executing user command:"
        {command}
        """
        
        current_process = await asyncio.create_subprocess_shell(
            f"bash -l -c {shlex.quote(full_command)}",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            preexec_fn=os.setsid  # This allows us to send signals to the entire process group
        )

        try:
            stdout_task = asyncio.create_task(read_stream(current_process.stdout, websocket))
            stderr_task = asyncio.create_task(read_stream(current_process.stderr, websocket))
            
            await asyncio.gather(stdout_task, stderr_task)
            await current_process.wait()
        except asyncio.CancelledError:
            if current_process:
                os.killpg(os.getpgid(current_process.pid), signal.SIGTERM)
                await websocket.send_text("\n[Command interrupted]\n")
        finally:
            current_process = None
        
        await websocket.send_text("[Command execution completed]\n")

@router.websocket("/interrupt")
async def interrupt_websocket(websocket: WebSocket):
    global current_process
    await websocket.accept()
    
    while True:
        await websocket.receive_text()  # Wait for any message
        if current_process:
            os.killpg(os.getpgid(current_process.pid), signal.SIGTERM)
            await websocket.send_text("Command interrupted")
        else:
            await websocket.send_text("No command running")