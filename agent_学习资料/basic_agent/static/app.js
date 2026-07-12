const state = { events: [], index: -1, timer: null };
const task = document.querySelector("#task");
const status = document.querySelector("#status");
const variables = document.querySelector("#variables");
const answer = document.querySelector("#answer");
const packet = document.querySelector("#packet");
const packetLabel = document.querySelector("#packet-label");
const llmSimulation = document.querySelector("#llm-simulation");

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
