/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_HOST: string
  readonly VITE_BASE_PATH: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}