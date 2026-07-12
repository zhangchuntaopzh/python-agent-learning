"""规则规划器：用可读规则模拟 Agent 的决策过程。"""

from dataclasses import dataclass


@dataclass(frozen=True)
class Plan:
    intent: str
    tool_name: str | None
    tool_input: str | None
    description: str


class Planner:
    def create_plan(self, task: str) -> Plan:
        normalized = task.strip()
        if normalized.startswith("计算 "):
            return Plan("calculate", "calculator", normalized[3:].strip(), "使用计算器求值")
        if "什么是" in normalized or "agent" in normalized.lower():
            return Plan("knowledge", "knowledge_base", normalized, "查询内置知识库")
        return Plan("chat", None, None, "直接给出学习提示")
