import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<Record<string, never>>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<Record<string, never>>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(_error: unknown, _errorInfo: unknown) {
    // Log error to an error reporting service if needed
    // console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <h1 className="text-4xl font-bold mb-4 text-red-700 dark:text-red-400">Something went wrong.</h1>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.</p>
          <a href="/" className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-300">Return Home</a>
        </div>
      );
    }
    return this.props.children;
  }
}
