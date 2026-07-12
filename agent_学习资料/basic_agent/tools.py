"""Agent 可调用的受限工具。"""

import ast
from dataclasses import dataclass


@dataclass(frozen=True)
class ToolResult:
    ok: bool
    content: str


ALLOWED_NODES = (
    ast.Expression, ast.BinOp, ast.UnaryOp, ast.Add, ast.Sub, ast.Mult,
    ast.Div, ast.FloorDiv, ast.Mod, ast.Pow, ast.USub, ast.UAdd, ast.Constant,
)


def safe_calculate(expression: str) -> ToolResult:
    try:
        tree = ast.parse(expression, mode="eval")
    except SyntaxError:
        return ToolResult(False, "计算表达式格式不正确。")
    if any(not isinstance(node, ALLOWED_NODES) for node in ast.walk(tree)):
        return ToolResult(False, "计算器只支持数字、括号和基本运算符。")
    try:
        value = eval(compile(tree, "<calculator>", "eval"), {"__builtins__": {}}, {})
    except (ArithmeticError, ValueError):
        return ToolResult(False, "计算时出现错误，请检查表达式。")
    return ToolResult(True, str(value))


def knowledge_base(question: str) -> ToolResult:
    return ToolResult(True, "Agent 是能感知任务、规划步骤、调用工具、观察结果并保存记忆的程序。")


class ToolRegistry:
    def run(self, tool_name: str, tool_input: str) -> ToolResult:
        if tool_name == "calculator":
            return safe_calculate(tool_input)
        if tool_name == "knowledge_base":
            return knowledge_base(tool_input)
        return ToolResult(False, f"未找到工具：{tool_name}")
