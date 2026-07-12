import unittest
from pathlib import Path


class FlowLayoutTests(unittest.TestCase):
    def test_flow_is_built_by_automatic_router(self):
        script = (Path(__file__).parent.parent / "static" / "app.js").read_text(encoding="utf-8")
        self.assertIn("NODE_LAYOUT", script)
        self.assertIn("CONNECTIONS", script)
        self.assertIn("buildPath", script)
        self.assertIn("intersectsNode", script)
    def test_tool_result_paths_leave_nodes_before_turning(self):
        page = (Path(__file__).parent.parent / "static" / "index.html").read_text(encoding="utf-8")
        self.assertIn('id="计算器|记忆" class="flow-link link-7" d="M855 260 V450 H730"', page)
        self.assertIn('id="知识库|记忆" class="flow-link link-8" d="M980 360 H1030 V450 H730"', page)

    def test_layout_uses_spaced_three_layer_canvas(self):
        page = (Path(__file__).parent.parent / "static" / "index.html").read_text(encoding="utf-8")
        self.assertIn('viewBox="0 0 1180 560"', page)
        self.assertIn('data-module="计算器"><rect x="780" y="200"', page)
        self.assertIn('data-module="知识库"><rect x="980" y="330"', page)
        self.assertIn('data-module="记忆"><rect x="570" y="420"', page)

    def test_llm_simulator_has_all_api_paths(self):
        page = (Path(__file__).parent.parent / "static" / "index.html").read_text(encoding="utf-8")
        for path_id in ("规划器|大模型模拟", "大模型模拟|规划器", "记忆|大模型模拟", "大模型模拟|最终回答"):
            self.assertIn(f'id="{path_id}"', page)

    def test_every_path_and_node_has_a_color_identity(self):
        page = (Path(__file__).parent.parent / "static" / "index.html").read_text(encoding="utf-8")
        self.assertNotIn('class="connection"', page)
        for token in tuple(f"link-{number}" for number in range(1, 13)):
            self.assertIn(token, page)
        for token in ("node-user", "node-planner", "node-registry", "node-llm", "node-calculator", "node-knowledge", "node-memory", "node-answer"):
            self.assertIn(token, page)
