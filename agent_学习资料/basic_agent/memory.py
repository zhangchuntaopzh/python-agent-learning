"""最小会话记忆：仅保存当前运行期间的对话。"""


class Memory:
    def __init__(self) -> None:
        self._items: list[dict[str, str]] = []

    def add(self, role: str, content: str) -> None:
        self._items.append({"role": role, "content": content})

    def recent(self, limit: int = 5) -> list[dict[str, str]]:
        return [dict(item) for item in self._items[-limit:]]
