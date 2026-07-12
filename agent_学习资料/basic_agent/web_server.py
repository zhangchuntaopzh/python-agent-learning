"""仅供本机学习使用的网页服务。"""

import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from agent import Agent


STATIC_DIR = Path(__file__).with_name("static")


class AgentHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_POST(self) -> None:
        if self.path != "/api/run":
            self.send_error(404, "未找到接口")
            return
        try:
            size = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(size).decode("utf-8"))
            task = str(payload.get("task", "")).strip()
            use_llm_simulation = payload.get("use_llm_simulation") is True
        except (ValueError, json.JSONDecodeError):
            self._json({"error": "请求格式不正确。"}, 400)
            return
        if not task:
            self._json({"error": "请输入任务。"}, 400)
            return
        response = Agent().run(task, use_llm_simulation=use_llm_simulation)
        self._json({"answer": response.answer, "events": response.events})

    def _json(self, payload: dict[str, object], status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def create_server(port: int = 8000) -> ThreadingHTTPServer:
    return ThreadingHTTPServer(("127.0.0.1", port), AgentHandler)


def main() -> None:
    server = create_server()
    print("打开 http://127.0.0.1:8000 查看 Agent 流程图；按 Ctrl+C 停止服务。")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n服务已停止。")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
