'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <path d="M12 9v4"/><path d="M12 17h.01"/>
          </svg>
        </div>
        <h2 className="text-2xl font-serif text-white mb-3">Something went wrong</h2>
        <p className="text-white/50 text-sm mb-8 font-body">{error?.message || 'An unexpected error occurred'}</p>
        <button
          onClick={reset}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold text-sm tracking-wider uppercase hover:shadow-lg hover:shadow-amber-500/25 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
