import { defaultEveWorld, getEveWorldConfig } from "../env";

export type SuiJsonRpcClient = (method: string, params: unknown[]) => Promise<unknown>;

interface RequestSuiJsonRpcParams {
  endpoint?: string;
  method: string;
  params: unknown[];
}

export async function requestSuiJsonRpc<T = unknown>({
  endpoint = getEveWorldConfig(defaultEveWorld).suiRpcEndpoint,
  method,
  params,
}: RequestSuiJsonRpcParams): Promise<T> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Sui JSON-RPC request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function createSuiJsonRpcClient(
  endpoint = getEveWorldConfig(defaultEveWorld).suiRpcEndpoint,
): SuiJsonRpcClient {
  return (method, params) =>
    requestSuiJsonRpc({
      endpoint,
      method,
      params,
    });
}
