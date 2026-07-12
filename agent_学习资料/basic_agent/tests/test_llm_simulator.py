import unittest

from llm_simulator import LLMSimulator


class LLMSimulatorTests(unittest.TestCase):
    def test_complete_returns_local_model_metadata(self):
        response = LLMSimulator().complete("plan", [{"role": "user", "content": "计算 3 * 7"}])
        self.assertEqual(response.model, "learning-llm-simulator-v1")
        self.assertIn("本地模拟", response.response)
        self.assertEqual(response.messages[0]["content"], "计算 3 * 7")
