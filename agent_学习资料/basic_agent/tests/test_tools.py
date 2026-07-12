import unittest

from tools import ToolRegistry


class ToolTests(unittest.TestCase):
    def test_calculator_evaluates_arithmetic(self):
        result = ToolRegistry().run("calculator", "(12 + 3) * 2")
        self.assertEqual((result.ok, result.content), (True, "30"))

    def test_calculator_rejects_calls(self):
        result = ToolRegistry().run("calculator", "__import__('os').system('pwd')")
        self.assertFalse(result.ok)
        self.assertIn("只支持数字", result.content)

    def test_knowledge_base_explains_agent(self):
        result = ToolRegistry().run("knowledge_base", "什么是 agent？")
        self.assertTrue(result.ok)
        self.assertIn("感知", result.content)
