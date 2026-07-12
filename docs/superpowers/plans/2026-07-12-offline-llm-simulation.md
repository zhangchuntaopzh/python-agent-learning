# Offline LLM Simulation Node Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an offline, deterministic LLM API simulation node that visibly participates in Agent planning and response generation when enabled.

**Architecture:** `LLMSimulator` returns structured local request/response records without network access. `Agent.run(task, use_llm_simulation=False)` emits request and response events around the planner and final answer only when the flag is true. The server accepts the flag and the page exposes it as a checkbox.

**Tech Stack:** Python 3.10+ standard library, unittest, HTML, CSS, native JavaScript.

## Global Constraints

- No network, API Key, environment-variable access, or external packages.
- The switch defaults to disabled.
- API-display variables are shortened by the existing 80-character event summary boundary.
- All visible labels are Simplified Chinese.

### Task 1: Simulated API contract and Agent events

**Files:** Create `agent_学习资料/basic_agent/llm_simulator.py`; modify `agent.py`; create `tests/test_llm_simulator.py`; modify `tests/test_agent.py`.

**Interfaces:** `LLMSimulator.complete(purpose: str, messages: list[dict[str, str]]) -> LLMResponse`, where `LLMResponse` has `model`, `response`, and `messages`. `Agent.run(task: str, use_llm_simulation: bool = False) -> AgentResponse`.

- [ ] Write tests asserting `complete("plan", [{"role":"user","content":"计算 3 * 7"}])` returns `model == "learning-llm-simulator-v1"`, and asserting simulated Agent events include `规划器 → 大模型模拟 → 规划器` and `记忆 → 大模型模拟 → 最终回答`, with a `model` and `response` variable.
- [ ] Run `cd agent_学习资料/basic_agent && python3 -m unittest tests.test_llm_simulator tests.test_agent -v`; expect import or assertion failure.
- [ ] Implement deterministic `LLMSimulator` and wrap existing planning/final-answer sections with request and response events only when `use_llm_simulation` is true. The regular planner and formatter remain the source of functional output.
- [ ] Rerun the command; expect PASS. Commit with message `feat: add offline llm simulation events`.

### Task 2: API flag and visual node

**Files:** Modify `web_server.py`, `static/index.html`, `static/app.js`, `static/style.css`; modify `tests/test_web_server.py`; modify `tests/test_layout.py`.

**Interfaces:** `POST /api/run` accepts `{"task":"...", "use_llm_simulation": true}`. The page submits checkbox state and has SVG node `大模型模拟`.

- [ ] Write a server test posting `use_llm_simulation: true` and asserting returned events include target `大模型模拟`; write a layout test asserting paths `规划器|大模型模拟`, `大模型模拟|规划器`, `记忆|大模型模拟`, and `大模型模拟|最终回答` exist.
- [ ] Run `cd agent_学习资料/basic_agent && python3 -m unittest tests.test_web_server tests.test_layout -v`; expect failure.
- [ ] Pass the Boolean flag through `web_server.py`; add an unchecked native checkbox labelled `启用大模型模拟（离线，无需 API Key）`; add the node and non-overlapping paths; send checkbox state in app.js. The existing event player needs no special branch because it already uses source-target path IDs.
- [ ] Run the same test command and manually submit a task with the checkbox enabled; expect PASS, highlighted model node and API-summary variables. Commit with message `feat: show offline llm simulation node`.

### Task 3: Teach and package the feature

**Files:** Modify `agent_学习资料/README.md`, `agent_学习资料/教程.md`; recreate `dist/python-agent-学习资料.zip`.

- [ ] Document the switch, its zero-network guarantee, `model/messages/response` variables, and the difference between a simulation and a real API call.
- [ ] Run `cd agent_学习资料/basic_agent && python3 -m unittest discover -s tests -v`; expect all tests PASS. Recreate the ZIP while excluding `__pycache__` and `.pyc`, then run `unzip -t dist/python-agent-学习资料.zip`.
- [ ] Commit with message `docs: explain offline llm simulation`.
