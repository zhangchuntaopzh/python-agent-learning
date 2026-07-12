"""终端版本入口。"""

from agent import Agent


def main() -> None:
    agent = Agent()
    print("基础 Agent 已启动；输入“退出”结束。")
    while True:
        task = input("你：").strip()
        if task == "退出":
            return
        if task:
            response = agent.run(task)
            print(f"Agent：{response.answer}")


if __name__ == "__main__":
    main()
