import json
import threading
import unittest
import urllib.request

from web_server import create_server


class WebServerTests(unittest.TestCase):
    def test_run_endpoint_returns_real_events(self):
        server = create_server(0)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            request = urllib.request.Request(
                f"http://127.0.0.1:{server.server_port}/api/run",
                data='{"task":"计算 3 * 7"}'.encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(request) as response:
                payload = json.load(response)
        finally:
            server.shutdown()
            server.server_close()
        self.assertEqual(payload["answer"], "计算结果：21")
        self.assertEqual(payload["events"][0]["target"], "规划器")
