import unittest

from agent import Agent


class AgentTests(unittest.TestCase):
    def test_agent_emits_execution_path_and_answer(self):
        response = Agent().run("计算 3 * 7")
        self.assertEqual(response.answer, "计算结果：21")
        self.assertEqual([item["target"] for item in response.events], ["规划器", "工具注册表", "计算器", "记忆", "最终回答"])
        self.assertEqual(response.events[3]["variables"]["tool_result"], "21")

    def test_chat_task_skips_calculator(self):
        response = Agent().run("帮我开始学习")
        self.assertIn("可以试试", response.answer)
        self.assertNotIn("计算器", [item["target"] for item in response.events])
