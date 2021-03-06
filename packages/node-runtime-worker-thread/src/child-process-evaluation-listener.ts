import { ChildProcess } from 'child_process';
import { exposeAll, WithClose } from './rpc';
import type { WorkerRuntime } from './index';
import { RuntimeEvaluationListener } from '@mongosh/browser-runtime-core';

export class ChildProcessEvaluationListener {
  exposedListener: WithClose<RuntimeEvaluationListener>;

  constructor(workerRuntime: WorkerRuntime, childProcess: ChildProcess) {
    this.exposedListener = exposeAll<RuntimeEvaluationListener>(
      {
        onPrompt(question, type) {
          return (
            workerRuntime.evaluationListener?.onPrompt?.(question, type) ?? ''
          );
        },
        onPrint(values) {
          return workerRuntime.evaluationListener?.onPrint?.(values);
        },
        toggleTelemetry(enabled) {
          return workerRuntime.evaluationListener?.toggleTelemetry?.(enabled);
        },
        onClearCommand() {
          return workerRuntime.evaluationListener?.onClearCommand?.();
        },
        onExit() {
          return (
            workerRuntime.evaluationListener?.onExit?.() ??
            (Promise.resolve() as Promise<never>)
          );
        }
      },
      childProcess
    );
  }
}
