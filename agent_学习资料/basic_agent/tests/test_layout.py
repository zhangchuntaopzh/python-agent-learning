import unittest
from pathlib import Path


class FlowLayoutTests(unittest.TestCase):
    def test_tool_result_paths_leave_nodes_before_turning(self):
        page = (Path(__file__).parent.parent / "static" / "index.html").read_text(encoding="utf-8")
        self.assertIn('id="计算器|记忆" class="connection" d="M865 250 H900 V365 H650"', page)
        self.assertIn('id="知识库|记忆" class="connection" d="M865 330 H920 V365 H650"', page)
