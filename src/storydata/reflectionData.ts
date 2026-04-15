export interface BranchCondition {
  nextId: string;
  condition: (sortingChoices: number[]) => boolean;
}

export interface ReflectionOption {
  text: string;
  nextId: string;
  choice?: Record<string, string | boolean | number>;
}

export interface ReflectionNode {
  id: string;
  type?: 'branching'; // If set, auto-advance based on branchConditions
  text: string;
  requiresInput?: boolean; // If true, show input field after this text
  inputPrompt?: string; // Placeholder text for input field
  showBubbles?: boolean; // If true, show thought bubbles with database insights
  showCharacter?: boolean; // If true, show the character image
  saveResponse?: boolean; // If true, save user response to database
  options?: ReflectionOption[]; // If present, show clickable choices
  nextId?: string; // Next dialogue ID (undefined = end)
  branchConditions?: BranchCondition[]; // Used if type is 'branching'
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
    nextId: 'reflect_0',
  },
  {
    id: 'reflect_0',
    text: 'If you had to plan the start of the tutorial again, would you do anything differently?',
    showCharacter: true,
    options: [
      { text: 'Yes, I would change my approach.', nextId: 'change_approach', },
      { text: 'No, I would do it the same way.', nextId: 'same_approach', },
    ],
  },
  {
    id: 'change_approach',
    text: 'What would you change about your approach?',
    requiresInput: true,
    showCharacter: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'reflect_2',
  },
  {
    id: 'same_approach',
    text: 'Why do you think your original approach was the best choice?',
    requiresInput: true,
    showCharacter: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'reflect_2',
  },
  {
    id: 'reflect_1',
    text: 'Can you finish this sentence: "The most important part of the start of the first tutorial is..."',
    requiresInput: true,
    showCharacter: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'reflect_2',
  },
  {
    id: 'reflect_2',
    text: 'Can you finish this sentence: "What was most surprising to me was..."',
    requiresInput: true,
    showCharacter: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'reflect_3',
  },
  {
    id: 'reflect_3',
    text: 'What do you remember from tutorials you attended before? What was something you personally liked about how the tutorial was started?',
    requiresInput: true,
    showCharacter: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'bubbles',
  },
  {
    id: 'bubbles',
    text: 'Other students had a variety of thoughts about what is important when planning the start of a tutorial. Let\'s take a look at some of their insights.',
    showBubbles: true,
    nextId: 'record',
  },
  {
    id: 'record',
    text: 'Now, leave advice behind for future students. What do you think is the most important thing to consider when planning the start of a tutorial?',
    requiresInput: true,
    inputPrompt: 'Type your thoughts here...',
    saveResponse: true,
    showBubbles: true,
    nextId: 'ending',
  },
  {
    id: 'ending',
    text: 'Thank you for your time.',
    showCharacter: true,
  },
];

export const reflectionDialogueSandwich: ReflectionNode[] = [
  {
    id: 'start',
    text: 'Let\'s take a moment to think about what happened.',
    showCharacter: true,
    nextId: 'reflect_0',
  },
  {
    id: 'reflect_0',
    text: 'Are you happy with your decision regarding Noah?',
    showCharacter: true,
    options: [
      { text: 'Yes', nextId: 'happy', },
      { text: 'No', nextId: 'change', },
    ],
  },
  {
    id: 'change',
    text: 'What would you change about your approach?',
    requiresInput: true,
    showCharacter: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'reflect_1',
  },
  {
    id: 'happy',
    text: 'Why do you think your approach was the best choice?',
    requiresInput: true,
    showCharacter: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'reflect_1',
  },
  {
    id: 'reflect_1',
    text: 'What factor did you consider the most when making your decision on helping Noah?',
    requiresInput: true,
    showCharacter: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'bubbles',
  },

  {
    id: 'bubbles',
    text: 'Here is what other students considered to be important factors to consider.',
    showBubbles: true,
    nextId: 'record',
  },
  {
    id: 'record',
    text: 'Now, what about you? What do you think is the best way to deal with a situation like this?',
    showBubbles: true,
    requiresInput: true,
    inputPrompt: 'Type your thoughts here...',
    saveResponse: true,
    nextId: 'end',
  },
  {
    id: 'end',
    text: 'Thank you for your time.',
    showCharacter: true,
  },
];

// Dialogue for scenario 5 - work organization 
export const reflectionDialogue5: ReflectionNode[] = [
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