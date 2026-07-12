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

    def test_llm_simulation_emits_request_and_response_events(self):
        response = Agent().run("计算 3 * 7", use_llm_simulation=True)
        links = [(item["source"], item["target"]) for item in response.events]
        self.assertIn(("规划器", "大模型模拟"), links)
        self.assertIn(("大模型模拟", "规划器"), links)
        self.assertIn(("记忆", "大模型模拟"), links)
        self.assertIn(("大模型模拟", "最终回答"), links)
        model_event = next(item for item in response.events if item["target"] == "大模型模拟")
        self.assertEqual(model_event["variables"]["model"], "learning-llm-simulator-v1")
        self.assertIn("response", next(item["variables"] for item in response.events if item["source"] == "大模型模拟"))
