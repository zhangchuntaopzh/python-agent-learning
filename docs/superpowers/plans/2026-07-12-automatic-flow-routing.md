# Automatic Flow Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate orthogonal Agent-flow connections at runtime so paths avoid node boxes and one another.

**Architecture:** `app.js` owns a node layout map and connection lane assignments. A router builds SVG paths from node edges through dedicated horizontal or vertical channels; `index.html` contains only the SVG root and dynamically created paths/nodes. Existing event playback uses the same source-target IDs.

**Tech Stack:** HTML, CSS, native JavaScript, Python unittest static-page checks.

## Global Constraints

- Routes must not cross a non-endpoint node boundary.
- Each connection has an exclusive channel coordinate.
- No third-party packages or network access.

### Task 1: Routing data and collision checks

**Files:** Modify `agent_学习资料/basic_agent/static/app.js`; modify `tests/test_layout.py`.

- [ ] Add a failing test asserting `app.js` defines `NODE_LAYOUT`, `CONNECTIONS`, `buildPath`, and `intersectsNode`, and that `index.html` no longer stores static `<path id=` elements.
- [ ] Run `cd agent_学习资料/basic_agent && python3 -m unittest tests.test_layout -v`; expect failure.
- [ ] Implement layout rectangles, one route record per source-target edge, and `intersectsNode(segment, node, endpoints)` used to reject a route that enters a non-endpoint rectangle.
- [ ] Rerun the test; expect PASS. Commit `feat: add automatic flow router`.

### Task 2: Runtime rendering and validation

**Files:** Modify `static/index.html`, `static/style.css`, `static/app.js`; modify `tests/test_layout.py`.

- [ ] Add a failing test for dynamic `renderFlow()` and unique `data-link` colors.
- [ ] Implement dynamic SVG node and path creation from layout data; preserve packet, variable label, active-state playback, responsive scroll, and 12 distinct colors.
- [ ] Run `python3 -m unittest discover -s tests -v`; manually run a simulated task and verify generated links avoid boxes. Rebuild ZIP, commit `feat: render automatically routed flow`, push.
