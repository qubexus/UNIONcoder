import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.unioncoder.app',
  appName: 'UNIONcoder',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // In production, set your backend URL here for the API to work
    // url: 'https://your-backend-url.com',
    // cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#8A2BE2',
      showSpinner: true,
      spinnerColor: '#FFFFFF',
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#8A2BE2',
    },
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
