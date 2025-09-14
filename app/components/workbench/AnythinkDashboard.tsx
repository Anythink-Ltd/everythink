import { memo, useState, useRef, useEffect } from 'react';
import { ANYTHINK_DASHBOARD_URL } from '~/utils/constants';

interface AnythinkDashboardProps {
  setSelectedElement?: (element: any) => void;
}

export const AnythinkDashboard = memo(({ setSelectedElement: _setSelectedElement }: AnythinkDashboardProps) => {
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Force to false to see iframe immediately
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return undefined;
    }

    const handleLoad = () => {
      console.log('✅ Dashboard iframe loaded successfully');
      setIsLoading(false);
      setIframeError(false);
    };

    const handleError = () => {
      console.error('Dashboard iframe failed to load');
      setIsLoading(false);
      setIframeError(true);
    };

    // Additional debugging for network errors
    const handleNetworkError = (event: any) => {
      console.error('Network error loading iframe:', event);
      setIsLoading(false);
      setIframeError(true);
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);
    
    // Listen for additional error events
    window.addEventListener('error', (event) => {
      if (event.target === iframe) {
        handleNetworkError(event);
      }
    });

    // Only set error state if iframe actually fails to load (no timeout needed)
    // The onLoad event will handle success, onError will handle actual failures

          return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
      };
  }, []);

  const openDashboard = () => {
    window.open(ANYTHINK_DASHBOARD_URL, '_blank', 'noopener,noreferrer');
  };

  if (iframeError) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-lg overflow-hidden">
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-xl font-semibold text-bolt-elements-textPrimary mb-2">Dashboard Integration</h2>
            <p className="text-bolt-elements-textSecondary mb-6 max-w-md">
              Access your Anythink dashboard in a new tab for the full experience. Iframe embedding is restricted for security.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <button
                onClick={openDashboard}
                className="px-6 py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <span>Open Dashboard</span>
                <div className="text-sm">↗</div>
              </button>
              <div className="text-xs text-bolt-elements-textTertiary">
                Dashboard: {ANYTHINK_DASHBOARD_URL}
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-bolt-elements-background-depth-2 rounded-lg border border-bolt-elements-borderColor max-w-lg">
              <h3 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">💡 Future Integration Ideas:</h3>
              <ul className="text-xs text-bolt-elements-textSecondary space-y-1 text-left">
                <li>• API integration for project status</li>
                <li>• Real-time notifications</li>
                <li>• Quick actions panel</li>
                <li>• Embedded metrics widgets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-lg overflow-hidden relative"
           style={{ 
             position: 'relative',
             zIndex: 1,
             contain: 'layout style paint',
             isolation: 'isolate',
           }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-bolt-elements-background-depth-1 z-10">
            <div className="text-center">
              <div className="text-4xl mb-2">⏳</div>
              <div className="text-bolt-elements-textSecondary">Loading dashboard...</div>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={ANYTHINK_DASHBOARD_URL}
          className="w-full h-full border-0"
          title="Anythink Dashboard"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-storage-access-by-user-activation"
          allow="geolocation; camera; microphone; payment; usb; bluetooth; accelerometer; gyroscope; magnetometer; clipboard-read; clipboard-write"
          loading="eager"
          onLoad={() => console.log('🎯 Iframe onLoad event fired')}
          onError={(e) => console.log('❌ Iframe onError event fired:', e)}
          style={{
            pointerEvents: 'auto',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
});

AnythinkDashboard.displayName = 'AnythinkDashboard';
