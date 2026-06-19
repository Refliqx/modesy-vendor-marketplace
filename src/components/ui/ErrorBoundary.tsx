"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error internally if needed
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="text-center py-12 select-none font-sans">
          <h2 className="text-xl font-bold text-text-main mb-4">Something went wrong.</h2>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-md transition-colors cursor-pointer shadow-sm"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
