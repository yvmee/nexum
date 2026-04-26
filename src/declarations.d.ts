declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.webp" {
  const value: string;
  export default value;
}

declare module "*.mp3" {
  const value: string;
  export default value;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '@dsojevic/profanity-list' {
  interface ProfanityEntry { match: string; }
  const profanityList: Record<string, ProfanityEntry[]>;
  export default profanityList;
}