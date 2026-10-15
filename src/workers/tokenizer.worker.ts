/// <reference lib="webworker" />
import { analyze, type AnalysisRequest, type AnalysisResult } from '../lib/tokenizer'

export interface WorkerRequest {
  id: number
  request: AnalysisRequest
}

export type WorkerResponse =
  | { id: number; ok: true; result: AnalysisResult }
  | { id: number; ok: false; error: string }

const ctx = self as unknown as DedicatedWorkerGlobalScope

ctx.addEventListener('message', (event: MessageEvent<WorkerRequest>) => {
  const { id, request } = event.data

  analyze(request).then(
    (result) => ctx.postMessage({ id, ok: true, result } satisfies WorkerResponse),
    (error: unknown) =>
      ctx.postMessage({
        id,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      } satisfies WorkerResponse),
  )
})
