import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Update state with error details
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // در production می‌توانید به سرویس logging ارسال کنید
    // این می‌تواند Sentry، LogRocket یا سرویس مشابه باشد
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService(error: Error, errorInfo: ErrorInfo): void {
    // TODO: در production به سرویس error tracking ارسال کنید
    if (import.meta.env.PROD) {
      // مثال: Sentry.captureException(error, { extra: errorInfo });
      console.warn('Production error logged:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // اگر fallback سفارشی وجود دارد
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI پیش‌فرض برای خطا
      const { error, errorInfo, errorCount } = this.state;
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-slate-900 border-2 border-red-500/50 rounded-2xl p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    خطایی رخ داده است
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    متأسفیم، مشکلی پیش آمده است
                  </p>
                </div>
              </div>

              {/* Error Message */}
              <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 mb-6">
                <p className="text-red-300 font-mono text-sm break-words">
                  {error?.message || 'خطای ناشناخته'}
                </p>
                {errorCount > 1 && (
                  <p className="text-xs text-slate-400 mt-2">
                    این خطا {errorCount} بار تکرار شده است
                  </p>
                )}
              </div>

              {/* Stack Trace (فقط در Development) */}
              {isDevelopment && error?.stack && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-2 mb-2">
                    <Bug className="w-4 h-4" />
                    <span>جزئیات فنی (Stack Trace)</span>
                  </summary>
                  <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 overflow-auto max-h-64">
                    <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                </details>
              )}

              {/* Component Stack (فقط در Development) */}
              {isDevelopment && errorInfo?.componentStack && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-2 mb-2">
                    <Bug className="w-4 h-4" />
                    <span>Component Stack</span>
                  </summary>
                  <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 overflow-auto max-h-64">
                    <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>تلاش مجدد</span>
                </button>

                <button
                  onClick={this.handleReload}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>بارگذاری مجدد صفحه</span>
                </button>

                <button
                  onClick={this.handleGoHome}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                  <Home className="w-4 h-4" />
                  <span>بازگشت به خانه</span>
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-xs text-slate-400 text-center">
                  اگر این مشکل ادامه دارد، لطفاً console browser را بررسی کنید یا با پشتیبانی تماس بگیرید.
                </p>
                {isDevelopment && (
                  <p className="text-xs text-amber-400 text-center mt-2">
                    ⚠️ حالت Development - جزئیات کامل نمایش داده می‌شود
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
): React.ComponentType<P> {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
