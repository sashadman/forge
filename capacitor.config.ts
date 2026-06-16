import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.araskills.app',
  appName: 'Ara Skills',
  webDir: 'public',
  server: {
    url: 'https://araskills.com',
    cleartext: false,
  },
  ios: {
    scheme: 'AraSkills',
  },
}

export default config
