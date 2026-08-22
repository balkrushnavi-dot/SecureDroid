import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-md mx-auto mt-20 bg-zinc-900 border border-zinc-700 rounded-2xl text-zinc-100 text-center space-y-4">
          <h2 className="text-xl font-bold text-red-400">System Exception Caught</h2>
          <p className="text-sm text-zinc-400">
            SecureDroid encountered an unexpected runtime anomaly.
          </p>
          <div className="p-3 bg-zinc-950 rounded-lg text-xs font-mono text-left text-red-300 overflow-auto max-h-32">
            {this.state.error?.message}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl transition"
          >
            Reload System
          </button>
        </div>
      );
    }

    return this.children;
  }
}

