import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/playwrite', 
  fullyParallel: false, 
  reporter: 'html', 
  use: {
    baseURL: process.env.TEST_URL || 'https://scoreboard-osmane.vercel.app/', 
    trace: 'on-first-retry', 
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});