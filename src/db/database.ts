import { supabase } from './dbClient'
// @ts-ignore
import profanityList from '@dsojevic/profanity-list';

/**
 * Type for reflection data loaded from the database
 */
export interface ReflectionData {
  id: number;
  text: string | null;
  user_id: string | null;
  created_at: string;
}

/**
 * Data structure to store loaded reflection texts
 */
export let reflectionTexts: ReflectionData[] = [];

let profanityRegex: RegExp | null = null;

const getProfanityRegex = () => {
  if (profanityRegex) return profanityRegex;

  try {
    // Handle various import scenarios
    // @ts-ignore
    const list = profanityList?.en || profanityList?.default?.en;
    
    if (!Array.isArray(list)) {
        console.warn('Could not load profanity list');
        return null;
    }

    const patterns = list.flatMap((item: any) => item.match ? item.match.split('|') : []);
    
    if (patterns.length === 0) return null;

    // Create a single regex for all bad words with word boundaries
    const combined = patterns.join('|');
    profanityRegex = new RegExp(`\\b(${combined})\\b`, 'gi');
  } catch (e) {
    console.error('Error creating profanity regex:', e);
  }
  
  return profanityRegex;
}

/**
 * Sanitizes user input to prevent XSS and SQL injection
 * @param input - The raw user input string
 * @returns Sanitized string safe for storage
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  let result = input
    // Trim whitespace
    .trim()
    // Remove HTML tags to prevent XSS
    .replace(/<[^>]*>/g, '');

  // Filter profanity
  const badWordRegex = getProfanityRegex();
  if (badWordRegex) {
    result = result.replace(badWordRegex, '***');
  }

  return result
    // Escape special HTML characters
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // Remove null bytes
    .replace(/\0/g, '')
    // Limit length to prevent overly long inputs
    .slice(0, 5000);
};

/*
* Function to get or create an anonymous user in Supabase
* @returns user ID
*/
export const getOrCreateUser = async () => {
  // Check if we are already logged in 
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    console.log("Welcome back:", session.user.id);
    return session.user.id;
  }

  // If no user, sign in anonymously
  console.log("Creating new anonymous user...");
  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    console.error("Error creating user:", error);
    return null;
  }

  return data.user?.id; // This is the UUID that has to be used for storing user-specific data
}

/* 
* Function to save data to the 'reflections' table in Supabase
* @param inputtext - The text to be saved (will be sanitized)
*/
export const saveData = async (inputtext: string) => {
  const userId = await getOrCreateUser();

  if (!userId) return;

  // Sanitize the input before saving
  const sanitizedText = sanitizeInput(inputtext);

  if (!sanitizedText) {
    console.warn('Empty input after sanitization, skipping save');
    return;
  }

  const { error } = await supabase
    .from('reflections') 
    .upsert({ 
      text: sanitizedText,
      user_id: userId
    });

  if (error) {
    console.error('Error saving:', error)
  } else {
    console.log('Data saved!')
  }
}

/*
* Function to load all data from the 'reflections' table in Supabase
* @returns array of reflection data
*/
export const loadData = async (): Promise<ReflectionData[] | null> => {
  // Get all rows from 'reflections' table for now
  const { data, error } = await supabase
    .from('reflections') 
    .select('*');

  if (error) {
    console.error('Error loading:', error);
    return null;
  }

  // console.log all text fields of data for debugging
  console.log('Loaded data:', data?.map(row => row.text));

  // TypeScript knows 'data' has .score and .game_data
  console.log('Done loading data'); 
  return data as ReflectionData[];
}

/**
 * Function to load all reflection texts from database and store them in the reflectionTexts array
 * Call this at the beginning of a reflection to have all previous texts available
 * @returns Promise<ReflectionData[]> - Array of all reflection data
 */
export const loadReflectionTexts = async (): Promise<ReflectionData[]> => {
  const data = await loadData();
  
  if (data) {
    reflectionTexts = data;
    console.log(`Loaded ${reflectionTexts.length} reflection texts into memory`);
  } else {
    reflectionTexts = [];
    console.log('No reflection texts found or error loading');
  }
  
  return reflectionTexts;
};

/**
 * Get the currently loaded reflection texts
 * @returns The array of reflection data currently in memory
 */
export const getReflectionTexts = (): ReflectionData[] => {
  return reflectionTexts;
};