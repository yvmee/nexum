export interface ReflectionNode {
  id: string;
  text: string;
  requiresInput?: boolean; // If true, show input field after this text
  inputPrompt?: string; // Placeholder text for input field
  showBubbles?: boolean; // If true, show thought bubbles with database insights
  showCharacter?: boolean; // If true, show the character image
  saveResponse?: boolean; // If true, save user response to database
  nextId?: string; // Next dialogue ID (undefined = end)
}

export interface UserResponse {
  nodeId: string;
  prompt: string;
  response: string;
  timestamp: Date;
}


// ___________ Dialogue Data for Reflection Scenes ____________

// Dialogue for scenario 1 - tutorial start
export const reflectionDialogue1: ReflectionNode[] = [
  {
    id: 'start',
    text: 'Let\'s take a moment to think about what happened.',
    showCharacter: true,
    nextId: 'reflect_1',
  },
  {
    id: 'reflect_1',
    text: 'Why did you decide to organize the tutorial the way you did?',
    requiresInput: true,
    showCharacter: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'record',
  },
  {
    id: 'record',
    text: 'Now, leave advice behind for future students. What do you think is the most important thing to consider when planning the start of a tutorial?',
    requiresInput: true,
    inputPrompt: 'Type your thoughts here...',
    saveResponse: true,
    nextId: 'ending',
  },
  {
    id: 'ending',
    text: 'Thank you for your time.',
    showCharacter: true,
  },
];

// Dialogue for scenario 5 - work organization 
const reflectionDialogue5: ReflectionNode[] = [
  {
    id: 'start',
    text: 'Let\'s take a moment to think about what happened.',
    showCharacter: true,
    nextId: 'reflect_1',
  },
  {
    id: 'reflect_1',
    text: 'Why did you decide to organize the tutorial the way you did?',
    requiresInput: true,
    showCharacter: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'reflect_2',
  },
  {
    id: 'reflect_2',
    text: 'Would you have done anything differently if you had to do it again?',
    requiresInput: true,
    showCharacter: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'reflect_3',
  },
  {
    id: 'reflect_3',
    text: 'Interesting... Others before you have mentioned similar things, but also some different aspects. Let\'s take a look at what they based their decisions on.',
    showCharacter: true,
    nextId: 'bubbles',
  },
  {
    id: 'bubbles',
    text: 'This is what other students considered to be important for their decision:',
    showBubbles: true,
    nextId: 'record',
  },
  {
    id: 'record',
    text: 'Now, you can leave something behind too. What do you think is the most important thing to consider when organizing a worksession like this?',
    requiresInput: true,
    inputPrompt: 'Type your thoughts here...',
    showBubbles: true,
    saveResponse: true,
    nextId: 'ending',
  },
  {
    id: 'ending',
    text: 'Thank you for your reflections. Your insights have been recorded.',
    showCharacter: true,
  },
];


// ___________ End Dialogue Data for Reflection Scenes ____________


// Array of dialogue sets for different scenarios
export const reflectionDialogues: ReflectionNode[][] = [reflectionDialogue1, reflectionDialogue5];