"""Z dvoklikom odpri lokalni učni zvezek ITFR."""
import os
import socket
import subprocess
import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.error import URLError
from urllib.request import Request, urlopen


DIST = Path(__file__).resolve().parent / "dist"
HOST = "127.0.0.1"


class WorkbookServer(ThreadingHTTPServer):
    def server_bind(self):
        if os.name == "nt":
            self.allow_reuse_address = False
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()


def open_workbook(url):
    if webbrowser.open_new_tab(url):
        return
    if os.name == "nt":
        for variable in ("ProgramFiles(x86)", "ProgramFiles", "LOCALAPPDATA"):
            folder = os.environ.get(variable)
            if folder:
                edge = Path(folder) / "Microsoft/Edge/Application/msedge.exe"
                if edge.is_file():
                    subprocess.Popen([str(edge), "--new-window", url])
                    return
    raise RuntimeError(f"Odpri učni zvezek v brskalniku na {url}")


class WorkbookHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("X-ITFR-Zvezek", "1")
        super().end_headers()


def main():
    if not (DIST / "index.html").is_file():
        raise FileNotFoundError(f"Učni zvezek manjka v mapi {DIST}")

    handler = partial(WorkbookHandler, directory=str(DIST))
    for port in range(8080, 8091):
        url = f"http://{HOST}:{port}/"
        try:
            server = WorkbookServer((HOST, port), handler)
        except OSError:
            try:
                with urlopen(Request(url, method="HEAD"), timeout=1) as response:
                    running = response.headers.get("X-ITFR-Zvezek") == "1"
            except (URLError, OSError, ValueError):
                continue
            if running:
                open_workbook(url)
                return
            continue
        with server:
            worker = Thread(target=server.serve_forever, daemon=True)
            worker.start()
            print(f"Učni zvezek je na voljo na {url}", flush=True)
            print("Za ustavitev strežnika zapri to okno ali pritisni Ctrl+C.")
            try:
                open_workbook(url)
                while worker.is_alive():
                    worker.join(1)
            except KeyboardInterrupt:
                pass
            finally:
                server.shutdown()
            return
    raise RuntimeError("Vrata 8080–8090 so zasedena.")


if __name__ == "__main__":
    try:
        main()
    except (OSError, RuntimeError) as error:
        input(f"{error}\nZa izhod pritisni Enter.")
