/**
 * Toast Notification Utilities
 * Beautiful toast notifications using react-hot-toast
 */

import toast, { Toaster, Toast } from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

// Custom toast configuration
export const toastConfig = {
  duration: 4000,
  position: 'bottom-right' as const,
  
  // RTL support for Persian text
  reverseOrder: false,
  gutter: 8,
  
  // Styling
  style: {
    background: '#1e293b', // slate-800
    color: '#f1f5f9', // slate-100
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    maxWidth: '420px',
    border: '1px solid #334155', // slate-700
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
  },

  // Icons
  success: {
    duration: 3000,
    iconTheme: {
      primary: '#10b981', // emerald-500
      secondary: '#f1f5f9',
    },
  },
  error: {
    duration: 5000,
    iconTheme: {
      primary: '#ef4444', // red-500
      secondary: '#f1f5f9',
    },
  },
  loading: {
    duration: Infinity,
    iconTheme: {
      primary: '#06b6d4', // cyan-500
      secondary: '#f1f5f9',
    },
  },
};

/**
 * Success Toast
 */
export function showSuccess(message: string, options?: any) {
  return toast.success(message, {
    ...toastConfig.success,
    ...options,
  });
}

/**
 * Error Toast
 */
export function showError(message: string, options?: any) {
  return toast.error(message, {
    ...toastConfig.error,
    ...options,
  });
}

/**
 * Info Toast
 */
export function showInfo(message: string, options?: any) {
  return toast(message, {
    icon: '💡',
    duration: 4000,
    ...options,
  });
}

/**
 * Warning Toast
 */
export function showWarning(message: string, options?: any) {
  return toast(message, {
    icon: '⚠️',
    duration: 4500,
    style: {
      ...toastConfig.style,
      border: '1px solid #f59e0b', // amber-500
    },
    ...options,
  });
}

/**
 * Loading Toast (manual dismiss)
 */
export function showLoading(message: string = 'در حال بارگذاری...') {
  return toast.loading(message, toastConfig.loading);
}

/**
 * Promise Toast (auto-handling of async operations)
 */
export function showPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
) {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    toastConfig
  );
}

/**
 * Custom Toast with action button
 */
export function showActionToast(
  message: string,
  actionLabel: string,
  onAction: () => void,
  options?: any
) {
  return toast((t) => (
    <div className="flex items-center gap-3">
      <span className="flex-1">{message}</span>
      <button
        onClick={() => {
          onAction();
          toast.dismiss(t.id);
        }}
        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  ), {
    duration: 6000,
    ...options,
  });
}

/**
 * Dismiss a specific toast
 */
export function dismissToast(toastId: string) {
  toast.dismiss(toastId);
}

/**
 * Dismiss all toasts
 */
export function dismissAllToasts() {
  toast.dismiss();
}

/**
 * Update an existing toast
 */
export function updateToast(toastId: string, message: string, type: 'success' | 'error' | 'loading') {
  if (type === 'success') {
    toast.success(message, { id: toastId });
  } else if (type === 'error') {
    toast.error(message, { id: toastId });
  } else {
    toast.loading(message, { id: toastId });
  }
}

/**
 * Rate Limit Warning Toast
 */
export function showRateLimitWarning(remainingAttempts: number) {
  showWarning(
    `هشدار: ${remainingAttempts} تلاش دیگر باقی‌مانده است قبل از قفل شدن حساب.`,
    { duration: 6000 }
  );
}

/**
 * Account Locked Toast
 */
export function showAccountLocked(unlockTime: string) {
  showError(
    `حساب شما به دلیل تلاش‌های ناموفق زیاد برای ${unlockTime} مسدود شده است.`,
    { duration: 8000 }
  );
}

/**
 * Save Success Toast
 */
export function showSaveSuccess(itemName: string = 'تغییرات') {
  showSuccess(`${itemName} با موفقیت ذخیره شد ✓`);
}

/**
 * Save Error Toast with Retry
 */
export function showSaveError(onRetry?: () => void) {
  if (onRetry) {
    showActionToast(
      'خطا در ذخیره‌سازی. لطفاً مجدداً تلاش کنید.',
      'تلاش مجدد',
      onRetry
    );
  } else {
    showError('خطا در ذخیره‌سازی. لطفاً اتصال اینترنت خود را بررسی کنید.');
  }
}

/**
 * Network Error Toast
 */
export function showNetworkError() {
  showError('خطا در برقراری ارتباط. لطفاً اتصال اینترنت خود را بررسی کنید.', {
    duration: 5000,
  });
}

/**
 * Session Expired Toast
 */
export function showSessionExpired() {
  showWarning('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.', {
    duration: 6000,
  });
}

/**
 * Validation Error Toast
 */
export function showValidationError(fieldName: string) {
  showError(`لطفاً ${fieldName} را به درستی وارد کنید.`);
}

/**
 * Copy to Clipboard Toast
 */
export function showCopySuccess() {
  showSuccess('کپی شد ✓', { duration: 2000 });
}

/**
 * Export Toaster component configuration
 */
export { Toaster };
export { toastConfig as defaultToastConfig };
