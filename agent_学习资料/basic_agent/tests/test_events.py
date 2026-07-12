import unittest

from events import EventCollector


class EventTests(unittest.TestCase):
    def test_event_steps_increment_and_values_are_summarized(self):
        event = EventCollector().add("用户输入", "规划器", {"task": "x" * 100})
        self.assertEqual(event.step, 1)
        self.assertEqual(len(event.to_dict()["variables"]["task"]), 80)
        self.assertTrue(event.to_dict()["variables"]["task"].endswith("…"))
