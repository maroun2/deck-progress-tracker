#!/usr/bin/env node

const CDP = require('chrome-remote-interface');

async function testCS2() {
  let client;
  try {
    client = await CDP({
      host: '192.168.253.186',
      port: 8081,
      target: 'EC0A8B375DBF30556F10E533B5F33923'
    });

    const { Runtime } = client;

    console.log('Testing GetMyAchievementsForApp for CS2...\n');

    await Runtime.enable();

    const result = await Runtime.evaluate({
      expression: `window.SteamClient.Apps.GetMyAchievementsForApp(730)`,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('Result:');
    console.log(JSON.stringify(result.result.value, null, 2));

    await client.close();
    process.exit(0);

  } catch (err) {
    console.error('Error:', err);
    if (client) {
      await client.close();
    }
    process.exit(1);
  }
}

testCS2();
