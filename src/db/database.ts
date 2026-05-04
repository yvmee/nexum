import { supabase } from './dbClient'
import profanityList from '@dsojevic/profanity-list';

/**
 * Type for basice reflection data loaded from the database
 */
export interface ReflectionData {
  id: number;
  text: string | null;
  user_id: string | null;
  created_at: string;
}

/**
 * Type for reflection answer data loaded from the database table 'reflectionanswers'
 */
export interface ReflectionAnswerData {
  id: number;
  user_id: string | null;
  created_at: string;
  thread_id: number | null;
  reflection_id: number | null;
  answer: string | null;
}

/**
 * Type for reflection answer data loaded from the database table 'reflectionvotes'
 */
export interface ReflectionVoteData {
  id: number;
  user_id: string | null;
  created_at: string;
  thread_id: number | null;
  option_id: number | null;
}

/**
 * Data structure to store loaded data
 */
export let reflectionTexts: ReflectionAnswerData[] = [];
export let reflectionVotes: ReflectionVoteData[] = [];

let profanityRegex: RegExp | null = null;

const getProfanityRegex = () => {
  if (profanityRegex) return profanityRegex;

  try {
    const list = profanityList?.en;
    
    if (!Array.isArray(list)) {
        console.warn('Could not load profanity list');
        return null;
    }

    const patterns = list.flatMap((item) => item.match ? item.match.split('|') : []);
    
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
 * Sanitizes user input to prevent XSS and SQL injection and filters profanity. 
 * This should be called before saving any user-generated content to the database.
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

  // Heuristic spam filters
  const hasSpamChars = /(.)\1{3,}/.test(result); 
  if (hasSpamChars) {
    console.log('Input contains spammy character repetitions, removing');
    result = result.replace(/(.)\1{3,}/g, '$1');
  }

  const isGibberish = /^[bcdfghjklmnpqrstvwxz]{5,}$/i.test(result);
  const isQwertyWalk = /(asdf|qwer|zxcv|yxcv|hjkl)/i.test(result);
  if (isGibberish || isQwertyWalk) {
    console.log('Input looks like gibberish or qwerty walk, returning empty');
    return '';
  }

  const mostlyPunctuation = (result.match(/[^\w\s]/g)?.length || 0) > (result.length / 2);
  if (mostlyPunctuation) {
    console.log('Input is mostly punctuation, returning empty');
    return '';
  }

  // Filter profanity by removing
  const badWordRegex = getProfanityRegex();
  if (badWordRegex) {
    result = result.replace(badWordRegex, '');
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

/**
* Function to get or create an anonymous user in Supabase, as policies prevent insertions without a user_id
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



// ___________________________ Direct Database Management __________________________


/**
* Function to save data to the 'reflectionanswers' table in Supabase. Includes input sanitization.
* @param inputtext - The text to be saved
* @param reflectionId - Optional ID of the reflection question this answer belongs to, should be provided!
* @param threadId - Optional ID of the reflection thread this answer belongs to (not needed for now)
*/
export const saveAnswerData = async (inputtext: string, reflectionId?: number, threadId?: number) => {
  const userId = await getOrCreateUser();

  if (!userId) return;

  // Sanitize the input before saving
  const sanitizedText = sanitizeInput(inputtext);

  if (!sanitizedText) { 
    console.warn('Empty input after sanitization, skipping save');
    return;
  }

  if (sanitizedText.length <= 4) { 
    console.warn('Input too short after sanitization, skipping save');
    return;
  }

  const { error } = await supabase
    .from('reflectionanswers') 
    .upsert({ 
      answer: sanitizedText,
      user_id: userId,
      reflection_id: reflectionId,
      thread_id: threadId
    });

  if (error) {
    console.error('Error saving:', error)
  } else {
    console.log('Answer data saved to database.')
  }
}

/**
* Function to save data to the 'reflectionVotes' table in Supabase.
* @param votingId - The question the vote belongs to
* @param optionId - The picked option
*/
export const saveVoteData = async (votingId: number, optionId: number) => {
  const userId = await getOrCreateUser();

  if (!userId) return;

  const { error } = await supabase
    .from('reflectionvotes') 
    .upsert({ 
      user_id: userId,
      thread_id: votingId,
      option_id: optionId
    });

  if (error) {
    console.error('Error saving:', error)
  } else {
    console.log('Vote data saved to database.')
  }
}

/**
 * Function to load all reflection texts from database and store them in the reflectionTexts array
 * Call this at the beginning of a reflection to have all previous texts available
 * @returns Promise<ReflectionData[]> - Array of all reflection data
 */
export const loadReflectionAnswerTexts = async (reflectionId?: number): Promise<ReflectionAnswerData[]> => {
  const data = await loadAnswerData(reflectionId);
  
  if (data) {
    reflectionTexts = data;
  } else {
    reflectionTexts = [];
    console.error('No reflection answers found or error loading.');
  }
  
  return reflectionTexts;
};

/**
* Function to load data from the 'reflectionanswers' table in Supabase for a specific reflection question
* @returns array of reflection data
*/
export const loadAnswerData = async (reflectionId?: number): Promise<ReflectionAnswerData[] | null> => {

  // Get 'reflectionanswers' table corresponding to the reflectionId, if provided, otherwise get all answers
  let query = supabase
    .from('reflectionanswers') 
    .select('*');
  if (reflectionId !== undefined) {
    query = query.eq('reflection_id', reflectionId);
  }
  const { data, error } = await query;

  if (error) {
    console.error('Error loading:', error);
    return null;
  }

  // TypeScript knows 'data' has .score and .game_data
  console.log('Successfully loaded data from "reflectionanswers"'); 
  return data as ReflectionAnswerData[];
}

/**
 * Function to load all reflection votes from database and store them in the reflectionVotes array
 * Call this at the beginning of a reflection to count all relevant votes
 * @returns Promise<ReflectionData[]> - Array of all reflection data
 */
export const loadReflectionVotes = async (threadId?: number): Promise<ReflectionVoteData[]> => {
  const data = await loadVoteData(threadId);
  
  if (data) {
    reflectionVotes = data;
  } else {
    reflectionVotes = [];
    console.error('No reflection votes found or error loading.');
  }

  return reflectionVotes;
};

/**
* Function to load data from the 'reflectionvotes' table in Supabase for a specific reflection question
* @returns array of reflection data
*/
export const loadVoteData = async (threadId?: number): Promise<ReflectionVoteData[] | null> => {

  // Get 'reflectionvotes' table corresponding to the reflectionId, if provided, otherwise get all answers
  let query = supabase
    .from('reflectionvotes') 
    .select('*');
  if (threadId !== undefined) {
    query = query.eq('thread_id', threadId);
  }
  const { data, error } = await query;

  if (error) {
    console.error('Error loading:', error);
    return null;
  }

  console.log('Successfully loaded data from "reflectionvotes"'); 
  return data as ReflectionVoteData[];
}

/**
 * Get the currently loaded reflection texts
 * @returns The array of reflection data currently in memory
 */
export const getReflectionTexts = (): ReflectionAnswerData[] => {
  return reflectionTexts;
};


/**
* Deprecated function to load all data from the 'reflections' table in Supabase
* @returns array of reflection data
*/
export const loadReflectionTableData = async (): Promise<ReflectionData[] | null> => {
  // Get all rows from 'reflections' table for now
  const { data, error } = await supabase
    .from('reflections') 
    .select('*');

  if (error) {
    console.error('Error loading:', error);
    return null;
  }

  return data as ReflectionData[];
}

/**
 * Upload evaluation survey data to the 'evaluation' table in Supabase
 * @param evaluation The completed evaluation data
 */
export const uploadEvaluation = async (evaluation: import('../pages/Evaluation').EvaluationData, playtime?: number | null): Promise<void> => {
  const userId = await getOrCreateUser();

  if (!userId) {
    throw new Error('Could not create or retrieve user.');
  }

  // Sanitize text inputs and save to database
  const { error } = await (supabase as any)
    .from('evaluation')
    .insert({
      user_id: userId,
      // Demographics
      age: parseInt(evaluation.age) || null,
      gender: evaluation.gender,
      study: sanitizeInput(evaluation.study),
      gamingExperience: evaluation.gamingExperience,
      tutorialVisited: evaluation.tutorialVisited,
      tutorialHeld: evaluation.tutorialHeld,
      exerciseHeld: evaluation.exerciseHeld,
      // Likert pre/post pairs
      uncomfortableBefore: evaluation.uncomfortable_before,
      uncomfortableAfter: evaluation.uncomfortable_after,
      worriedTutorBefore: evaluation.worried_tutor_before,
      worriedTutorAfter: evaluation.worried_tutor_after,
      betterPreparedBefore: evaluation.better_prepared_before,
      betterPreparedAfter: evaluation.better_prepared_after,
      rapportWorryBefore: evaluation.rapport_worry_before,
      rapportWorryAfter: evaluation.rapport_worry_after,
      keepInterestedBefore: evaluation.keep_interested_before,
      keepInterestedAfter: evaluation.keep_interested_after,
      presentInfoBefore: evaluation.present_info_before,
      presentInfoAfter: evaluation.present_info_after,
      // Likert game experience
      scenariosBetterSense: evaluation.scenarios_better_sense,
      scenariosTooDifferent: evaluation.scenarios_too_different,
      reflectionHelped: evaluation.reflection_helped,
      reflectionDifficultConnect: evaluation.reflection_difficult_connect,
      othersPerspectives: evaluation.others_perspectives,
      ownContributionMeaningful: evaluation.own_contribution_meaningful,
      moreConfident: evaluation.more_confident,
      noChange: evaluation.no_change,
      // Open questions
      mostRelevant: sanitizeInput(evaluation.most_relevant),
      missing: sanitizeInput(evaluation.missing),
      mostEssential: sanitizeInput(evaluation.most_essential),
      otherComments: evaluation.other_comments ? sanitizeInput(evaluation.other_comments) : null,
      // Playtime in seconds
      playtime: playtime ?? null,
    });

  if (error) {
    console.error('Error saving evaluation:', error);
    throw error;
  }

  console.log('Evaluation saved successfully!');
};