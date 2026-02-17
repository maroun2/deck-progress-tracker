#!/usr/bin/env node

const CDP = require('chrome-remote-interface');

async function testCS2Achievements() {
  let client;
  try {
    client = await CDP({
      host: '192.168.253.186',
      port: 8081,
      target: 'EC0A8B375DBF30556F10E533B5F33923'
    });

    const { Runtime } = client;

    console.log('Testing SteamClient.Apps.GetMyAchievementsForApp for CS2...\n');
    console.log('='.repeat(80));

    await Runtime.enable();

    const result = await Runtime.evaluate({
      expression: `
        (async () => {
          try {
            const achievements = await window.SteamClient.Apps.GetMyAchievementsForApp(730);
            return JSON.stringify({
              success: true,
              data: achievements
            }, null, 2);
          } catch (e) {
            return JSON.stringify({
              success: false,
              error: e.message,
              stack: e.stack
            }, null, 2);
          }
        })()
      `,
      awaitPromise: true
    });

    console.log(JSON.parse(result.result.value));
    console.log('\n' + '='.repeat(80));

    await client.close();
    process.exit(0);

  } catch (err) {
    console.error('Error:', err.message);
    if (client) {
      await client.close();
    }
    process.exit(1);
  }
}

testCS2Achievements();
