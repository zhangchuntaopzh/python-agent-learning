import unittest

from planner import Planner


class PlannerTests(unittest.TestCase):
    def test_routes_calculation(self):
        plan = Planner().create_plan("计算 (12 + 3) * 2")
        self.assertEqual((plan.intent, plan.tool_name, plan.tool_input), ("calculate", "calculator", "(12 + 3) * 2"))

    def test_routes_agent_question(self):
        self.assertEqual(Planner().create_plan("什么是 agent？").tool_name, "knowledge_base")
