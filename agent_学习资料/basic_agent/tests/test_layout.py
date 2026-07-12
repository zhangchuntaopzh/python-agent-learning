import unittest
from pathlib import Path


class FlowLayoutTests(unittest.TestCase):
    def test_tool_result_paths_leave_nodes_before_turning(self):
        page = (Path(__file__).parent.parent / "static" / "index.html").read_text(encoding="utf-8")
        self.assertIn('id="计算器|记忆" class="connection" d="M865 250 H900 V365 H650"', page)
        self.assertIn('id="知识库|记忆" class="connection" d="M865 330 H920 V365 H650"', page)

    def test_llm_simulator_has_all_api_paths(self):
        page = (Path(__file__).parent.parent / "static" / "index.html").read_text(encoding="utf-8")
        for path_id in ("规划器|大模型模拟", "大模型模拟|规划器", "记忆|大模型模拟", "大模型模拟|最终回答"):
            self.assertIn(f'id="{path_id}"', page)
