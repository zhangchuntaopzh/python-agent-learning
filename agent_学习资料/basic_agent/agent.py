"""Agent 编排器：连接规划、工具、记忆和运行事件。"""

from dataclasses import dataclass

from events import EventCollector
from llm_simulator import LLMSimulator
from memory import Memory
from planner import Plan, Planner
from tools import ToolRegistry


TOOL_LABELS = {"calculator": "计算器", "knowledge_base": "知识库"}


@dataclass(frozen=True)
class AgentResponse:
    answer: str
    events: list[dict[str, object]]


class Agent:
    def __init__(self) -> None:
        self.planner = Planner()
        self.tools = ToolRegistry()
        self.memory = Memory()
        self.llm = LLMSimulator()

    def run(self, task: str, use_llm_simulation: bool = False) -> AgentResponse:
        collector = EventCollector()
        collector.add("用户输入", "规划器", {"task": task})
        if use_llm_simulation:
            planning_response = self.llm.complete("plan", [{"role": "user", "content": task}])
            collector.add("规划器", "大模型模拟", {
                "model": planning_response.model,
                "messages": planning_response.messages,
            })
            collector.add("大模型模拟", "规划器", {"response": planning_response.response})
        plan = self.planner.create_plan(task)
        collector.add("规划器", "工具注册表", {"plan": plan.description, "tool_name": plan.tool_name or "无"})
        if plan.tool_name:
            label = TOOL_LABELS[plan.tool_name]
            collector.add("工具注册表", label, {"tool_input": plan.tool_input or ""})
            result = self.tools.run(plan.tool_name, plan.tool_input or "")
            answer = self._format_tool_answer(plan, result.ok, result.content)
            collector.add(label, "记忆", {"tool_result": result.content})
        else:
            answer = "可以试试“什么是 agent？”或“计算 12 * 3”。"
            collector.add("工具注册表", "记忆", {"answer": answer})
        self.memory.add("user", task)
        self.memory.add("assistant", answer)
        if use_llm_simulation:
            answer_response = self.llm.complete("answer", [{"role": "assistant", "content": answer}])
            collector.add("记忆", "大模型模拟", {
                "model": answer_response.model,
                "messages": answer_response.messages,
            })
            collector.add("大模型模拟", "最终回答", {"response": answer_response.response, "answer": answer})
        else:
            collector.add("记忆", "最终回答", {"answer": answer})
        return AgentResponse(answer, [event.to_dict() for event in collector.events()])

    @staticmethod
    def _format_tool_answer(plan: Plan, ok: bool, content: str) -> str:
        if not ok:
            return f"工具执行失败：{content}"
        if plan.intent == "calculate":
            return f"计算结果：{content}"
        return content
