import type { ReactElement } from "react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";

import { lookupTheme } from "@/theme/theme";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function wrapWithProviders(ui: ReactElement) {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lookupTheme}>
        <CssBaseline />
        {ui}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

interface CollectHydrationRecoverableErrorsOptions {
  ui: ReactElement;
  beforeServerRender?: () => void;
  beforeHydrate?: () => void;
}

export async function collectHydrationRecoverableErrors({
  ui,
  beforeServerRender,
  beforeHydrate,
}: CollectHydrationRecoverableErrorsOptions) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  beforeServerRender?.();
  const serverHtml = renderToString(wrapWithProviders(ui));
  container.innerHTML = serverHtml;

  beforeHydrate?.();

  const recoverableErrors: string[] = [];
  const root = hydrateRoot(container, wrapWithProviders(ui), {
    onRecoverableError(error) {
      recoverableErrors.push(error.message);
    },
  });

  await act(async () => {
    await Promise.resolve();
  });

  root.unmount();
  container.remove();

  return recoverableErrors;
}
