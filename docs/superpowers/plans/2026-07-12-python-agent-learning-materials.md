# Python Agent 学习资料与动态流程演示 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建零基础中文教程，以及可离线运行、动态可视化真实执行流程的 Python 基础 Agent。

**Architecture:** 核心 Agent 使用独立的标准库模块：规划器生成计划，工具注册表执行受限工具，记忆保存记录，事件收集器生成运行事件。本地 HTTP 服务将真实事件 JSON 返回静态页面；页面按顺序高亮模块、播放连线光点并显示变量摘要。

**Tech Stack:** Python 3.10+；标准库 `ast`、`dataclasses`、`http.server`、`json`、`unittest`；HTML、CSS、原生 JavaScript。

## Global Constraints

- Python 3.10+；无第三方依赖、API Key 或互联网。
- 不执行任意 Python、shell 命令或读取用户文件。
- 用户可见内容为简体中文；变量名与代码为英文。
- 变量展示截断上限为 80 个字符。
- 页面支持自动播放、暂停、上一步、下一步、重置和窄屏布局。
- 核心行为有 `unittest` 测试；页面动画有手动验收清单。

## File Structure

`agent_学习资料/` 包含 `README.md`、`教程.md`，以及 `basic_agent/`。后者包含 `agent.py`、`events.py`、`main.py`、`memory.py`、`planner.py`、`tools.py`、`web_server.py`、`static/index.html`、`static/style.css`、`static/app.js` 和 `tests/`。

### Task 1: 事件、记忆与规则规划

**Files:** Create `basic_agent/events.py`, `memory.py`, `planner.py`, `tests/__init__.py`, `tests/test_events.py`, `tests/test_memory.py`, `tests/test_planner.py`.

**Interfaces:** `RunEvent(step, source, target, variables)` with `to_dict()`; `EventCollector.add(source, target, variables)` and `events()`; `Memory.add(role, content)` and `recent(limit=5)`; `Plan(intent, tool_name, tool_input, description)`; `Planner.create_plan(task)`.

- [ ] Write tests asserting first event step is 1, a 100-character variable becomes a 79-character prefix plus `…`, memory returns its latest entry, `计算 (12 + 3) * 2` creates `Plan("calculate", "calculator", "(12 + 3) * 2", "使用计算器求值")`, and `什么是 agent？` chooses `knowledge_base`.
- [ ] Run `cd agent_学习资料/basic_agent && python3 -m unittest tests.test_events tests.test_memory tests.test_planner -v`; expect import failures.
- [ ] Implement frozen dataclasses; event steps must use `len(self._events) + 1`; planner routes only `计算 ` prefix and questions containing `什么是` or `agent`, else returns `Plan("chat", None, None, "直接给出学习提示")`.
- [ ] Rerun the same command; expect PASS, then commit `feat: add agent planning memory and events`.

### Task 2: 受限工具注册表

**Files:** Create `basic_agent/tools.py`, `tests/test_tools.py`.

**Interfaces:** `ToolResult(ok, content)` and `ToolRegistry.run(tool_name, tool_input)`.

- [ ] Write tests asserting calculator input `(12 + 3) * 2` returns `(True, "30")`; injection-like `__import__('os').system('pwd')` returns `ok=False` with `只支持数字`; and the knowledge-base explanation includes `感知`.
- [ ] Run `cd agent_学习资料/basic_agent && python3 -m unittest tests.test_tools -v`; expect import failure.
- [ ] Implement `safe_calculate` with `ast.parse(..., mode="eval")`, permitting only Expression, BinOp, UnaryOp, Add, Sub, Mult, Div, FloorDiv, Mod, Pow, USub, UAdd, Constant; reject all other nodes before evaluating with empty builtins. Register `calculator` and deterministic `knowledge_base`; unknown names return `未找到工具：<name>`.
- [ ] Rerun tests; expect PASS, then commit `feat: add safe agent tools`.

### Task 3: Agent 循环与命令行入口

**Files:** Create `basic_agent/agent.py`, `main.py`, `tests/test_agent.py`.

**Interfaces:** `Agent.run(task) -> AgentResponse`, with `answer: str` and `events: list[dict[str, object]]`.

- [ ] Write a test where `Agent().run("计算 3 * 7")` answers `计算结果：21`, emits target sequence `规划器`, `工具注册表`, `计算器`, `记忆`, `最终回答`, and includes `tool_result: 21` in the third event. Add test that a chat task does not call the calculator.
- [ ] Run `cd agent_学习资料/basic_agent && python3 -m unittest tests.test_agent -v`; expect import failure.
- [ ] Implement `Agent.run`: emit `用户输入→规划器`, `规划器→工具注册表`; when needed emit `工具注册表→工具标签`, `工具标签→记忆`; save both messages; emit `记忆→最终回答`. Tool errors become readable answers. Implement `main.py` input loop and `退出` handling.
- [ ] Run `python3 -m unittest discover -s tests -v` plus `printf '计算 2 + 2\n退出\n' | python3 main.py`; expect all PASS and `Agent：计算结果：4`, then commit `feat: add agent execution loop`.

### Task 4: 本地服务和动态流程图

**Files:** Create `basic_agent/web_server.py`, `static/index.html`, `static/style.css`, `static/app.js`, `tests/test_web_server.py`.

**Interfaces:** `POST /api/run` accepts `{"task": "计算 3 * 7"}` and returns `{"answer": "计算结果：21", "events": [...]}`; `python3 web_server.py` serves `http://127.0.0.1:8000`.

- [ ] Write an HTTP test that starts the local server, posts the calculation, and asserts answer is `计算结果：21` and first event target is `规划器`.
- [ ] Run `cd agent_学习资料/basic_agent && python3 -m unittest tests.test_web_server -v`; expect import failure.
- [ ] Implement `SimpleHTTPRequestHandler`, bind to `127.0.0.1`, validate a non-empty task, call actual `Agent().run(task)`, and set JSON UTF-8 content type. The page draws nodes `用户输入`、`规划器`、`工具注册表`、`计算器`、`知识库`、`记忆`、`最终回答`, with valid-route SVG paths.
- [ ] Implement `showEvent(index)`: remove active state; activate current target; move `.packet` along source-target path; render `key: value` summaries; display `第 n / total 步：模块正在运行`. Add native `运行`、`自动播放`、`暂停`、`上一步`、`下一步`、`重置` buttons. Use `packetTravel` CSS keyframes, `▶ 正在运行` text, and responsive layout under 600px.
- [ ] Run HTTP test and launch service. Manual check at `http://127.0.0.1:8000`: task `计算 3 * 7` shows sequential events, moving packet, variable summary and functional controls. Commit `feat: visualize agent execution`.

### Task 5: 中文教程与最终验收

**Files:** Create `agent_学习资料/README.md`, `agent_学习资料/教程.md`.

**Interfaces:** Documents consume actual file names and commands and produce standalone beginner materials.

- [ ] Write README with `cd agent_学习资料/basic_agent`, `python3 web_server.py`, browser address `http://127.0.0.1:8000`, and examples `什么是 agent？`, `计算 (12 + 3) * 2`, `帮我开始学习`.
- [ ] Write `教程.md`: Agent definition; 感知—规划—行动—观察—记忆 loop; architecture; calculation event table; each module’s purpose/input/output/key code; AST safety; visual controls; add knowledge; add a tool; rule versus LLM planner; API-upgrade pseudocode; exercises with answers.
- [ ] Run `cd agent_学习资料/basic_agent && python3 -m unittest discover -s tests -v && printf '什么是 agent？\n退出\n' | python3 main.py`; expect tests PASS and an Agent explanation. Run `rg -n 'TODO|TBD|待定' agent_学习资料`; expect no results. Commit `docs: add beginner agent learning materials`.
