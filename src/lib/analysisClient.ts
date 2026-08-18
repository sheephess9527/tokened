import { analyze, type AnalysisRequest, type AnalysisResult } from './tokenizer'
import type { WorkerResponse } from '../workers/tokenizer.worker'

type Pending = {
  resolve: (result: AnalysisResult) => void
  reject: (error: unknown) => void
}

let worker: Worker | null = null
let workerUnavailable = false
let nextId = 0
const pending = new Map<number, Pending>()

function teardown(reason: unknown) {
  workerUnavailable = true
  worker = null
  for (const { reject } of pending.values()) reject(reason)
  pending.clear()
}

function getWorker(): Worker | null {
  if (workerUnavailable) return null
  if (worker) return worker
  if (typeof Worker === 'undefined') {
    workerUnavailable = true
    return null
  }

  try {
    worker = new Worker(new URL('../workers/tokenizer.worker.ts', import.meta.url), {
      type: 'module',
    })
  } catch {
    workerUnavailable = true
    return null
  }

  worker.addEventListener('message', (event: MessageEvent<WorkerResponse>) => {
    const message = event.data
    const entry = pending.get(message.id)
    if (!entry) return
    pending.delete(message.id)
    if (message.ok) entry.resolve(message.result)
    else entry.reject(new Error(message.error))
  })

  worker.addEventListener('error', (event) => {
    teardown(new Error(event.message || 'tokenizer worker failed'))
  })

  return worker
}

/**
 * Tokenize off the main thread so typing stays responsive on large prompts.
 * Falls back to a main-thread pass wherever module workers are unavailable.
 */
export async function runAnalysis(request: AnalysisRequest): Promise<AnalysisResult> {
  const activeWorker = getWorker()
  if (!activeWorker) return analyze(request)

  const id = nextId++

  try {
    return await new Promise<AnalysisResult>((resolve, reject) => {
      pending.set(id, { resolve, reject })
      activeWorker.postMessage({ id, request })
    })
  } catch {
    pending.delete(id)
    return analyze(request)
  }
}
