# Python Agent 零基础学习资料

这是一套能在本机离线运行的入门项目。不需要申请密钥或安装第三方包，重点是理解 Agent 的工作过程。

## 启动可视化版

在终端输入：

    cd agent_学习资料/basic_agent
    python3 web_server.py

浏览器打开 http://127.0.0.1:8000。页面会逐步高亮正在运行的模块；橙色光点表示数据传递，光点旁会显示该步骤的变量。

依次尝试这些任务：

    什么是 agent？
    计算 (12 + 3) * 2
    帮我开始学习

## 启动终端版

    cd agent_学习资料/basic_agent
    python3 main.py

输入“退出”结束程序。

## 运行测试

    cd agent_学习资料/basic_agent
    python3 -m unittest discover -s tests -v

测试检查规划、计算器安全边界、事件顺序和本地网页接口。阅读 [教程.md](教程.md) 开始学习。
