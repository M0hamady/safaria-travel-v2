import React from "react";
import ErrorPage from "../bublic/ErrorPage";

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state when an error is encountered
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log error details
    console.error("ErrorBoundary caught an error", error, info);
    // Optionally, log error to an external service
  }

  render() {
    if (this.state.hasError) {
      // Render error page
      return <ErrorPage />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
