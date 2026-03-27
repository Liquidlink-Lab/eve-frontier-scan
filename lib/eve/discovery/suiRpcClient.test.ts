import { describe, expect, it, vi } from "vitest";

describe("suiRpcClient", () => {
  it("posts a JSON-RPC request and returns the parsed payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        jsonrpc: "2.0",
        id: 1,
        result: {
          data: [],
        },
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const modulePath = "./suiRpcClient";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      requestSuiJsonRpc: undefined,
    }));

    expect(typeof loadedModule.requestSuiJsonRpc).toBe("function");

    const response = await loadedModule.requestSuiJsonRpc?.({
      endpoint: "https://rpc.example.test",
      method: "suix_queryEvents",
      params: [{ MoveEventType: "0xpkg::gate::JumpEvent" }, null, 10, true],
    });

    expect(fetchMock).toHaveBeenCalledWith("https://rpc.example.test", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "suix_queryEvents",
        params: [{ MoveEventType: "0xpkg::gate::JumpEvent" }, null, 10, true],
      }),
      cache: "no-store",
    });
    expect(response).toEqual({
      jsonrpc: "2.0",
      id: 1,
      result: {
        data: [],
      },
    });
  });

  it("throws when the JSON-RPC HTTP request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    );

    const modulePath = "./suiRpcClient";
    const loadedModule = await import(/* @vite-ignore */ modulePath).catch(() => ({
      requestSuiJsonRpc: undefined,
    }));

    expect(typeof loadedModule.requestSuiJsonRpc).toBe("function");

    await expect(
      loadedModule.requestSuiJsonRpc?.({
        endpoint: "https://rpc.example.test",
        method: "suix_queryEvents",
        params: [],
      }),
    ).rejects.toThrow("Sui JSON-RPC request failed with status 503");
  });
});
