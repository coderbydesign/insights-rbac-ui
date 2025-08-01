#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const { spawn, execSync } = require('child_process');
const waitOn = require('wait-on');

const options = {
  resources: ['https://stage.foo.redhat.com:1337'],
  delay: 6000,
  interval: 3000, // wait for 3 sec
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default if not provided
  },
  verbose: true,
  timeout: 3 * 60 * 1000,
  headers: {
    accept: 'text/html'
  }
};
let child;
async function runTests() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  //start stage beta
  child = spawn('npm', ['run', 'start', '--', '--clouddotEnv=stage', '--uiEnv=beta'], {
    stdio: [process.stdout, process.stdout, process.stdout],
    detached: false,
  });
  await waitOn(options);
  execSync(
    `NO_COLOR=1 E2E_USER=${process.env.CHROME_ACCOUNT} E2E_PASSWORD=${process.env.CHROME_PASSWORD} E2E_WORKSPACES_USER=${process.env.RBAC_FRONTEND_USER} E2E_WORKSPACES_PASSWORD=${process.env.RBAC_FRONTEND_PASSWORD} npm run cypress:run`,
    {
      encoding: 'utf-8',
      stdio: 'inherit',
    }
  );
}

runTests()
  .then(() => {
    child.kill();
    process.exit(0);
  })
  .catch((error) => {
    console.log('e2e test failed!', error);
    child.kill();
    process.exit(1);
  });
