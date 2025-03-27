
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ce51942926f5471791fbaadf23d96575',
  appName: 'solveair-scan',
  webDir: 'dist',
  server: {
    url: 'https://ce519429-26f5-4717-91fb-aadf23d96575.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
