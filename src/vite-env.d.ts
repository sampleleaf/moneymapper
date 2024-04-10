/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_FIRE_apiKey: string
    readonly VITE_FIRE_authDomain: string
    readonly VITE_FIRE_projectId: string
    readonly VITE_FIRE_storageBucket: string
    readonly VITE_FIRE_messagingSenderId: string
    readonly VITE_FIRE_appId: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }