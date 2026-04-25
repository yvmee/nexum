export interface BranchCondition {
  nextId: string;
  condition: (playerChoices: Record<string, string | boolean | number>) => boolean;
}

export interface ReflectionOption {
  text: string;
  nextId: string;
  optionId?: number;
  choice?: Record<string, string | boolean | number>;
}

export interface ReflectionVotingSet {
  votingID: number;
  options: ReflectionOption[];
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
  votingKey?: string; // Key to resolve voting data from reflectionVotingSets
  votingID?: number; // If set, this node is associated with a voting question
  displayVotes?: boolean; // If true, display current voting results at this node
  options?: ReflectionOption[]; // If present, show clickable choices
  nextId?: string; // Next dialogue ID (undefined = end)
  branchConditions?: BranchCondition[]; // Used if type is 'branching'
  sfx?: string; // Optional SFX key to play when this node becomes active
}

export interface UserResponse {
  nodeId: string;
  prompt: string;
  response: string;
  timestamp: Date;
}

export const reflectionVotingSets: Record<string, ReflectionVotingSet> = {
  tutorialStart: {
    votingID: 5,
    options: [
      { text: 'Give an overview over the topics of whole semester', nextId: 'options_1', optionId: 0 },
      { text: 'State the learning outcomes of today\'s session', nextId: 'options_1', optionId: 1 },
      { text: 'Ask the students about their wishes and concerns for the next tutorials', nextId: 'options_1', optionId: 2 },
      { text: 'Use your own enthusiasm for the topic to interest the students in the subject', nextId: 'options_1', optionId: 3 },
    ],
  },
  sandwichVote: { 
    votingID: 3, // What impacted your decision the most?
    options: [
      { text: 'I want to help other students as much as I can', nextId: 'picked', optionId: 0 },
      { text: 'Noah is my friend so I want to help him', nextId: 'picked', optionId: 1 },
      { text: 'I should not help with homework', nextId: 'picked', optionId: 2 },
      { text: 'Something else', nextId: 'else', optionId: 3 },
    ],
  },
};

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
    nextId: 'options_0',
  },
  {
    id: 'same_approach',
    text: 'Why do you think your original approach was the best choice?',
    requiresInput: true,
    showCharacter: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'options_0',
  },
  {
    id: 'options_0',
    text: 'Which one of these do you deem to be the most useful for the start of a tutorial?',
    showCharacter: true,
    votingKey: 'tutorialStart',
    saveResponse: true,
  },
  {
    id: 'options_1',
    text: 'This is how other students picked:',
    showCharacter: true,
    displayVotes: true,
    votingKey: 'tutorialStart',
    nextId: 'reflect_3',
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
    text: 'Thank you for discussing your thoughts with me.',
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
    votingKey: 'sandwichVote',
    showCharacter: true,
  },
  {
    id: 'else',
    text: 'What other factor did you consider the most when making your decision on helping Noah?',
    showCharacter: true,
    requiresInput: true,
    inputPrompt: 'Type your thoughts here...',
    nextId: 'picked',
  },
  {
    id: 'picked',
    text: 'This is how other students picked:',
    votingKey: 'sandwichVote',
    displayVotes: true,
    showCharacter: true,
    nextId: 'pre_bubbles',
  },
  {
    id: 'pre_bubbles',
    text: 'When making a decision like this, there are many factors to consider. Let\'s take a look at some of the insights other students had on how to handle the situtation.',
    showCharacter: true,
    nextId: 'bubbles',
  },
  {
    id: 'bubbles',
    text: 'How to deal with a situation like this...',
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
    text: 'Thank you for sharing your thoughts.',
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
    text: 'Interesting... Now, let\'s take a look at what others based their decisions on.',
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
    text: 'Thank you for your insights.',
    showCharacter: true,
  },
];

// ___________ End Dialogue Data for Reflection Scenes ____________