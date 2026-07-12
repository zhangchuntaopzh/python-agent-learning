"""离线的大模型 API 模拟器，只生成可教学的确定性响应。"""

from dataclasses import dataclass


@dataclass(frozen=True)
class LLMResponse:
    model: str
    messages: list[dict[str, str]]
    response: str


class LLMSimulator:
    model_name = "learning-llm-simulator-v1"

    def complete(self, purpose: str, messages: list[dict[str, str]]) -> LLMResponse:
        if purpose == "plan":
            text = "本地模拟：已阅读任务，建议由规划器选择合适工具。"
        else:
            text = "本地模拟：已阅读执行结果，建议生成简洁的最终回答。"
        return LLMResponse(self.model_name, [dict(message) for message in messages], text)
