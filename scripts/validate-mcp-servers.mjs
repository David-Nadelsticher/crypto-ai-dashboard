import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const servers = [
  {
    name: "filesystem",
    command: "node",
    args: [
      path.join(projectRoot, "node_modules", "@modelcontextprotocol", "server-filesystem", "dist", "index.js"),
      projectRoot,
    ],
    expectTools: ["list_directory", "read_text_file"],
  },
  {
    name: "playwright",
    command: "node",
    args: [
      path.join(projectRoot, "node_modules", "@playwright", "mcp", "cli.js"),
      "--browser",
      "chrome",
      "--headless",
    ],
    expectTools: ["browser_navigate"],
  },
  {
    name: "context7",
    command: "node",
    args: [path.join(projectRoot, "node_modules", "@upstash", "context7-mcp", "dist", "index.js")],
    expectTools: ["resolve-library-id", "query-docs"],
  },
];

function send(proc, message) {
  proc.stdin.write(`${JSON.stringify(message)}\n`);
}

function waitForResponse(proc, id, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for response id=${id}`));
    }, timeoutMs);

    const onData = (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          if (parsed.id === id) {
            cleanup();
            resolve(parsed);
          }
        } catch {
          // Ignore non-JSON stdout noise.
        }
      }
    };

    const onError = (err) => {
      cleanup();
      reject(err);
    };

    const cleanup = () => {
      clearTimeout(timer);
      proc.stdout.off("data", onData);
      proc.stderr.off("data", onStderr);
      proc.off("error", onError);
    };

    const stderrChunks = [];
    const onStderr = (chunk) => stderrChunks.push(chunk.toString());
    proc.stderr.on("data", onStderr);
    proc.stdout.on("data", onData);
    proc.on("error", onError);
    proc._stderrChunks = stderrChunks;
  });
}

async function validateServerFixed(server) {
  const proc = spawn(server.command, server.args, {
    cwd: projectRoot,
    stdio: ["pipe", "pipe", "pipe"],
    env: process.env,
  });

  const stderrChunks = [];
  proc.stderr.on("data", (chunk) => stderrChunks.push(chunk.toString()));

  try {
    send(proc, {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "mcp-validator", version: "1.0.0" },
      },
    });

    const initResponse = await waitForResponse(
      proc,
      1,
      server.name === "playwright" ? 45000 : 20000,
    );

    if (initResponse.error) {
      throw new Error(initResponse.error.message ?? "initialize failed");
    }

    send(proc, { jsonrpc: "2.0", method: "notifications/initialized" });
    send(proc, {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {},
    });

    const toolsResponse = await waitForResponse(proc, 2, 30000);
    if (toolsResponse.error) {
      throw new Error(toolsResponse.error.message ?? "tools/list failed");
    }

    const toolNames = (toolsResponse.result?.tools ?? []).map((tool) => tool.name);
    const matched = server.expectTools.filter((tool) => toolNames.includes(tool));

    return {
      name: server.name,
      status: matched.length > 0 ? "ok" : "warning",
      toolCount: toolNames.length,
      matchedTools: matched,
      message:
        matched.length > 0
          ? `Started successfully (${toolNames.length} tools)`
          : `Started but expected tools not found (${toolNames.length} tools)`,
    };
  } catch (error) {
    return {
      name: server.name,
      status: "error",
      message: error.message,
      stderr: stderrChunks.join("").trim().slice(0, 500),
    };
  } finally {
    proc.kill();
  }
}

async function validateContext7Remote() {
  try {
    const response = await fetch("https://mcp.context7.com/mcp/oauth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "mcp-validator", version: "1.0.0" },
        },
      }),
    });

    const text = await response.text();
    const hasResult = text.includes('"result"') || response.ok;

    return {
      name: "context7-remote",
      status: hasResult ? "ok" : "warning",
      message: hasResult
        ? `Remote endpoint reachable (HTTP ${response.status})`
        : `Remote endpoint returned HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      name: "context7-remote",
      status: "error",
      message: error.message,
    };
  }
}

const stdioResults = [];
for (const server of servers) {
  stdioResults.push(await validateServerFixed(server));
}

const results = stdioResults;
let hasError = false;

for (const result of results) {
  const prefix = result.status === "ok" ? "PASS" : result.status === "warning" ? "WARN" : "FAIL";
  console.log(`${prefix} ${result.name}: ${result.message}`);
  if (result.toolCount !== undefined) {
    console.log(`      tools=${result.toolCount}`);
  }
  if (result.stderr) {
    console.log(`      stderr=${result.stderr}`);
  }
  if (result.status === "error") {
    hasError = true;
  }
}

process.exit(hasError ? 1 : 0);
