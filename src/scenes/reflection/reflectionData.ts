export interface ReflectionNode {
  id: string;
  text: string;
  requiresInput?: boolean; // If true, show input field after this text
  inputPrompt?: string; // Placeholder text for input field
  generateAIResponse?: boolean; // If true, generate AI response based on user input
  showBubbles?: boolean; // If true, show thought bubbles with database insights
  saveResponse?: boolean; // If true, save user response to database
  nextId?: string; // Next dialogue ID (undefined = end)
}

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
    text: 'Let\'s take a moment to think about what happened.',
    nextId: 'reflect_1',
  },
  {
    id: 'reflect_1',
    text: 'Why did you decide to organize the tutorial the way you did?',
    requiresInput: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'reflect_2',
  },
  {
    id: 'reflect_2',
    text: 'Would you have done anything differently if you had to do it again?',
    requiresInput: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'reflect_3',
  },
  {
    id: 'reflect_3',
    text: 'Interesting...',
    nextId: 'reflect_4',
  },
  {
    id: 'reflect_4',
    text: 'What do you think is the most important thing to consider when organizing a worksession like this?',
    requiresInput: true,
    inputPrompt: 'Describe your alternative approach...',
    generateAIResponse: true, 
    saveResponse: true,
    nextId: 'bubbles',
  },
  {
    id: 'bubbles',
    text: 'This is what other students considered to be important:',
    showBubbles: true,
    nextId: 'ending',
  },
  {
    id: 'ending',
    text: 'Thank you for your reflections. Your insights have been recorded.',
  },
];
