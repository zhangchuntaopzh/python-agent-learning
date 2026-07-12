import unittest

from memory import Memory


class MemoryTests(unittest.TestCase):
    def test_recent_returns_latest_entry(self):
        memory = Memory()
        memory.add("user", "第一条")
        memory.add("assistant", "第二条")
        self.assertEqual(memory.recent(1), [{"role": "assistant", "content": "第二条"}])
