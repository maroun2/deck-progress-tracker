#!/usr/bin/env node

const WebSocket = require('ws');

// Connect to SharedJSContext - this is where the plugin runs
const wsUrl = 'ws://192.168.253.186:8081/devtools/page/EC0A8B375DBF30556F10E533B5F33923';

console.log('Connecting to Steam Deck CEF debugger...');
const ws = new WebSocket(wsUrl);

let messageId = 1;

ws.on('open', () => {
  console.log('Connected! Enabling console and runtime...\n');

  // Enable Console domain
  ws.send(JSON.stringify({
    id: messageId++,
    method: 'Console.enable'
  }));

  // Enable Runtime domain for console messages
  ws.send(JSON.stringify({
    id: messageId++,
    method: 'Runtime.enable'
  }));

  // Enable Log domain
  ws.send(JSON.stringify({
    id: messageId++,
    method: 'Log.enable'
  }));

  console.log('Listening for console messages (Press Ctrl+C to exit)...\n');
  console.log('='.repeat(80));
});

ws.on('message', (data) => {
  try {
    const msg = JSON.parse(data.toString());

    // Handle console messages from Runtime.consoleAPICalled
    if (msg.method === 'Runtime.consoleAPICalled') {
      const { type, args, stackTrace } = msg.params;
      const values = args.map(arg => {
        if (arg.value !== undefined) return arg.value;
        if (arg.description) return arg.description;
        return `[${arg.type}]`;
      });

      // Filter for GameProgressTracker messages
      const message = values.join(' ');
      if (message.includes('GameProgressTracker') ||
          message.includes('SteamClient') ||
          message.includes('achievement') ||
          message.includes('Fetching')) {
        console.log(`[${type.toUpperCase()}] ${message}`);
      }
    }

    // Handle log entries from Log.entryAdded
    if (msg.method === 'Log.entryAdded') {
      const { level, text, source } = msg.params.entry;
      if (text.includes('GameProgressTracker') ||
          text.includes('SteamClient') ||
          text.includes('achievement')) {
        console.log(`[${level.toUpperCase()}] ${text}`);
      }
    }

    // Handle console messages from Console.messageAdded (deprecated but still works)
    if (msg.method === 'Console.messageAdded') {
      const { level, text } = msg.params.message;
      if (text.includes('GameProgressTracker') ||
          text.includes('SteamClient') ||
          text.includes('achievement')) {
        console.log(`[${level.toUpperCase()}] ${text}`);
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error.message);
});

ws.on('close', () => {
  console.log('\nConnection closed.');
  process.exit(0);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\nClosing connection...');
  ws.close();
});
