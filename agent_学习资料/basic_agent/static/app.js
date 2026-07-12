const state = { events: [], index: -1, timer: null };
const NODE_LAYOUT = { "用户输入":[50,80,150,60], "规划器":[280,80,150,60], "工具注册表":[510,80,150,60], "大模型模拟":[280,260,150,60], "计算器":[980,180,150,60], "知识库":[980,400,150,60], "记忆":[570,420,160,60], "最终回答":[200,420,150,60] };
const CONNECTIONS = Object.keys({ "用户输入|规划器":1,"规划器|工具注册表":1,"规划器|大模型模拟":1,"大模型模拟|规划器":1,"工具注册表|计算器":1,"工具注册表|知识库":1,"计算器|记忆":1,"知识库|记忆":1,"工具注册表|记忆":1,"记忆|大模型模拟":1,"大模型模拟|最终回答":1,"记忆|最终回答":1 });
function intersectsNode(segment, node, endpoints) { return !endpoints.includes(node) && segment.x1 < node[0] + node[2] && segment.x2 > node[0] && segment.y1 < node[1] + node[3] && segment.y2 > node[1]; }
function buildPath(source, target) {
  const a = NODE_LAYOUT[source], b = NODE_LAYOUT[target];
  const x1 = a[0] + a[2] / 2, y1 = a[1] + a[3] / 2;
  const x2 = b[0] + b[2] / 2, y2 = b[1] + b[3] / 2;
  const index = CONNECTIONS.indexOf(`${source}|${target}`);
  const bend = 70 + (index % 4) * 32;
  const direction = index % 2 ? -1 : 1;
  const cx1 = x1 + direction * bend;
  const cx2 = x2 - direction * bend;
  return `M${x1} ${y1} C${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
}
function routeAll() { CONNECTIONS.forEach(key => { const [source,target]=key.split("|"); const path=document.getElementById(key); if (path) path.setAttribute("d", buildPath(source,target)); }); }
const task = document.querySelector("#task");
const status = document.querySelector("#status");
const variables = document.querySelector("#variables");
const answer = document.querySelector("#answer");
const packet = document.querySelector("#packet");
const packetLabel = document.querySelector("#packet-label");
const llmSimulation = document.querySelector("#llm-simulation");
const codeDialog=document.querySelector("#code-dialog"), codeTitle=document.querySelector("#code-title"), codeFile=document.querySelector("#code-file"), codeContent=document.querySelector("#code-content");
const CODE_MAP={"用户输入":["main.py","task = input('你：').strip()"],"规划器":["planner.py","def create_plan(self, task):\n    if task.startswith('计算 '):\n        return Plan('calculate', 'calculator', task[3:], '使用计算器求值')"],"工具注册表":["tools.py","def run(self, tool_name, tool_input):\n    return self.tools[tool_name](tool_input)"],"大模型模拟":["llm_simulator.py","def complete(self, purpose, messages):\n    return LLMResponse(self.model_name, messages, '本地模拟响应')"],"计算器":["tools.py","tree = ast.parse(expression, mode='eval')\n# 仅允许白名单语法节点"],"知识库":["tools.py","def knowledge_base(question):\n    return ToolResult(True, 'Agent 是能感知、规划、行动的程序。')"],"记忆":["memory.py","self._items.append({'role': role, 'content': content})"],"最终回答":["agent.py","return AgentResponse(answer, events)"]};
routeAll();
document.querySelectorAll('.module').forEach(node=>node.addEventListener('click',()=>{const [file,code]=CODE_MAP[node.dataset.module];codeTitle.textContent=node.dataset.module;codeFile.textContent=file;codeContent.textContent=code;codeDialog.showModal();}));
document.querySelector('#close-code').addEventListener('click',()=>codeDialog.close());
codeDialog.addEventListener('click',event=>{if(event.target===codeDialog) codeDialog.close();});
document.addEventListener('keydown',event=>{if(event.key==='Escape') codeDialog.close();});

function pathFor(source, target) { return document.getElementById(`${source}|${target}`); }
function stop() { clearInterval(state.timer); state.timer = null; }
function reset() {
  stop(); state.index = -1; packet.setAttribute("visibility", "hidden"); packetLabel.setAttribute("visibility", "hidden");
  document.querySelectorAll(".module").forEach(node => node.classList.remove("is-active"));
  document.querySelectorAll("path[id]").forEach(path => path.classList.remove("is-active"));
  status.textContent = state.events.length ? "已重置到运行前。" : "尚未运行任务。";
  variables.textContent = "等待播放。";
}
function movePacket(source, target, values) {
  const path = pathFor(source, target);
  if (!path) { packet.setAttribute("visibility", "hidden"); packetLabel.setAttribute("visibility", "hidden"); return; }
  const point = path.getPointAtLength(path.getTotalLength() / 2);
  packet.setAttribute("cx", point.x); packet.setAttribute("cy", point.y); packet.setAttribute("visibility", "visible");
  const text = Object.entries(values).map(([key, value]) => `${key}: ${value}`).join(" · ");
  packetLabel.textContent = text; packetLabel.setAttribute("x", point.x); packetLabel.setAttribute("y", point.y - 16); packetLabel.setAttribute("visibility", "visible");
  packet.classList.remove("packet-travel"); void packet.getBoundingClientRect(); packet.classList.add("packet-travel");
  variables.textContent = text;
}
function showEvent(index) {
  if (index < 0 || index >= state.events.length) return;
  state.index = index; const event = state.events[index];
  document.querySelectorAll(".module").forEach(node => {
    node.classList.toggle("is-active", node.dataset.module === event.target);
    node.querySelectorAll(".running-label").forEach(label => label.remove());
  });
  const activeNode = document.querySelector(`[data-module="${event.target}"]`);
  const rect = activeNode.querySelector("rect");
  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("class", "running-label"); label.setAttribute("x", Number(rect.getAttribute("x")) + Number(rect.getAttribute("width")) / 2);
  label.setAttribute("y", Number(rect.getAttribute("y")) + 18); label.textContent = "▶ 正在运行"; activeNode.append(label);
  document.querySelectorAll("path[id]").forEach(path => path.classList.remove("is-active"));
  pathFor(event.source, event.target)?.classList.add("is-active");
  movePacket(event.source, event.target, event.variables);
  status.textContent = `第 ${event.step} / ${state.events.length} 步：${event.target} 正在运行`;
}
function play() {
  stop(); if (!state.events.length) return;
  if (state.index >= state.events.length - 1) state.index = -1;
  showEvent(state.index + 1);
  state.timer = setInterval(() => { if (state.index >= state.events.length - 1) return stop(); showEvent(state.index + 1); }, 900);
}
document.querySelector("#task-form").addEventListener("submit", async event => {
  event.preventDefault(); stop(); status.textContent = "正在请求 Agent…";
  try {
    const response = await fetch("/api/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task: task.value, use_llm_simulation: llmSimulation.checked }) });
    const data = await response.json(); if (!response.ok) throw new Error(data.error);
    state.events = data.events; answer.textContent = data.answer; reset(); play();
  } catch (error) { status.textContent = `运行失败：${error.message}`; }
});
document.querySelector("#play").addEventListener("click", play);
document.querySelector("#pause").addEventListener("click", stop);
document.querySelector("#previous").addEventListener("click", () => { stop(); showEvent(Math.max(0, state.index - 1)); });
document.querySelector("#next").addEventListener("click", () => { stop(); showEvent(Math.min(state.events.length - 1, state.index + 1)); });
document.querySelector("#reset").addEventListener("click", reset);
document.querySelectorAll("[data-example]").forEach(button => button.addEventListener("click", () => { task.value = button.dataset.example; }));
