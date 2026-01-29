/**
 * Reflection dialogue node - can optionally prompt for user input
 */
export interface ReflectionNode {
  id: string;
  text: string;
  requiresInput?: boolean; // If true, show input field after this text
  inputPrompt?: string; // Placeholder text for input field
  nextId?: string; // Next dialogue ID (undefined = end)
}

/**
 * User response data structure
 */
export interface UserResponse {
  nodeId: string;
  prompt: string;
  response: string;
  timestamp: Date;
}

/**
 * Reflection dialogue data
 */
export const reflectionDialogues: ReflectionNode[] = [
  {
    id: 'start',
    text: 'Welcome to the reflection phase. Let\'s take a moment to think about what happened.',
    nextId: 'reflect_1',
  },
  {
    id: 'reflect_1',
    text: 'Think about the situation you just experienced. What stood out to you the most?',
    requiresInput: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'reflect_2',
  },
  {
    id: 'reflect_2',
    text: 'Interesting perspective. Now, consider how you might handle a similar situation differently.',
    nextId: 'reflect_3',
  },
  {
    id: 'reflect_3',
    text: 'What would you do differently if you encountered this scenario again?',
    requiresInput: true,
    inputPrompt: 'Describe your alternative approach...',
    nextId: 'ending',
  },
  {
    id: 'ending',
    text: 'Thank you for your reflections. Your insights have been recorded.',
  },
];
