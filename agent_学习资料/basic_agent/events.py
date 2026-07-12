"""运行事件：把 Agent 的内部步骤变成可视化页面能理解的数据。"""

from dataclasses import dataclass


def summarize(value: object, limit: int = 80) -> str:
    """将变量转换成适合界面显示的短文本。"""
    text = str(value)
    return text if len(text) <= limit else text[: limit - 1] + "…"


@dataclass(frozen=True)
class RunEvent:
    step: int
    source: str
    target: str
    variables: dict[str, object]

    def to_dict(self) -> dict[str, object]:
        return {
            "step": self.step,
            "source": self.source,
            "target": self.target,
            "variables": {key: summarize(value) for key, value in self.variables.items()},
        }


class EventCollector:
    def __init__(self) -> None:
        self._events: list[RunEvent] = []

    def add(self, source: str, target: str, variables: dict[str, object]) -> RunEvent:
        event = RunEvent(len(self._events) + 1, source, target, variables)
        self._events.append(event)
        return event

    def events(self) -> list[RunEvent]:
        return list(self._events)
