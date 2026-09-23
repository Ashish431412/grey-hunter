import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTerminal } from './useTerminal';
import { terminalTheme } from './TerminalTheme';

interface TerminalEmulatorProps {
  sessionId: string;
  onInput: (data: string) => void;
  fontSize?: number;
}

export const TerminalEmulator: React.FC<TerminalEmulatorProps> = ({
  sessionId,
  onInput,
  fontSize = 14,
}) => {
  const webViewRef = useRef<any>(null);
  const WebViewComp = WebView as any;
  const { session } = useTerminal(sessionId);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/xterm@4.19.0/css/xterm.css" />
        <script src="https://cdn.jsdelivr.net/npm/xterm@4.19.0/lib/xterm.js"></script>
        <style>
          body, html { margin: 0; padding: 0; height: 100%; background-color: #000; }
          #terminal { height: 100%; width: 100%; padding: 4px; box-sizing: border-box; }
        </style>
      </head>
      <body>
        <div id="terminal"></div>
        <script>
          const term = new Terminal({
            theme: ${JSON.stringify(terminalTheme.matrix)},
            fontSize: ${fontSize},
            cursorBlink: true,
            fontFamily: 'monospace'
          });
          term.open(document.getElementById('terminal'));
          
          term.onData(data => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'input', data }));
          });

          document.addEventListener('message', event => {
            const msg = JSON.parse(event.data);
            if (msg.type === 'write') {
              term.write(msg.data);
            }
          });
        </script>
      </body>
    </html>
  `;

  useEffect(() => {
    if (session?.outputQueue && session.outputQueue.length > 0) {
      session.outputQueue.forEach(data => {
        webViewRef.current?.injectJavaScript(`
          document.dispatchEvent(new MessageEvent('message', {
            data: JSON.stringify({ type: 'write', data: ${JSON.stringify(data)} })
          }));
          true;
        `);
      });
    }
  }, [session?.outputQueue]);

  const handleMessage = (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'input') {
        onInput(msg.data);
      }
    } catch (e) {
      console.error('Failed to parse terminal message', e);
    }
  };

  return (
    <View style={styles.container}>
      <WebViewComp
        ref={webViewRef}
        source={{ html }}
        onMessage={handleMessage}
        bounces={false}
        scrollEnabled={false}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
});
