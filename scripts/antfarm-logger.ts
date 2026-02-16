import { createClient } from "@supabase/supabase-js";

interface LogEntry {
  agentName: string;
  status: "completed" | "failed" | "skipped";
  modelUsed?: string;
  inputTokens?: number;
  outputTokens?: number;
  durationMs: number;
  resultSummary?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

const COST_TABLE: Record<string, { input: number; output: number }> = {
  "claude-sonnet-4-20250514": { input: 3, output: 15 },
  "claude-sonnet-4-5-20250929": { input: 3, output: 15 },
  "claude-haiku-4-5-20251001": { input: 0.8, output: 4 },
};

function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const rates = COST_TABLE[model];
  if (!rates) return 0;
  return (
    (inputTokens / 1_000_000) * rates.input +
    (outputTokens / 1_000_000) * rates.output
  );
}

export async function logToAntFarm(entry: LogEntry): Promise<void> {
  const url = process.env.ANTFARM_SUPABASE_URL;
  const key = process.env.ANTFARM_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.log("[antfarm] No Supabase credentials, skipping execution log.");
    return;
  }

  try {
    const supabase = createClient(url, key);

    const costEstimate =
      entry.modelUsed && entry.inputTokens && entry.outputTokens
        ? estimateCost(entry.modelUsed, entry.inputTokens, entry.outputTokens)
        : null;

    await supabase.from("execution_logs").insert({
      agent_name: entry.agentName,
      status: entry.status,
      model_used: entry.modelUsed || null,
      input_tokens: entry.inputTokens || 0,
      output_tokens: entry.outputTokens || 0,
      cost_estimate: costEstimate,
      duration_ms: entry.durationMs,
      result_summary: entry.resultSummary || null,
      error: entry.error || null,
      metadata: entry.metadata || {},
      started_at: new Date(Date.now() - entry.durationMs).toISOString(),
      completed_at: new Date().toISOString(),
    });

    console.log(
      `[antfarm] Logged: ${entry.agentName} → ${entry.status} (${entry.durationMs}ms${costEstimate ? `, $${costEstimate.toFixed(4)}` : ""})`
    );
  } catch (err) {
    console.warn("[antfarm] Failed to log execution (non-fatal):", err);
  }
}
