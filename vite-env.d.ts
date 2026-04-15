interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUB_KEY: string;
  readonly BASE_URL: string;
 
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}