
/**
 * Dialogue option for branching choices
 */
export interface DialogueOption {
  text: string;
  nextId: string;
  choice?: Record<string, string | boolean | number>; // key-value pair to track player choices for story flow evaluation
}

/**
 * Single dialogue node with text, optional speaker, and optional branching choices or next dialogue id; or a cutscene with id
 */
export interface SceneNode {
  id: string;
  type?: 'dialogue' | 'cutscene' | 'minigame' | 'branching'; // 'dialogue' is default if undefined
  animationId?: string; // Used if type is 'cutscene'
  minigameId?: string; // Used if type is 'minigame'
  text?: string;
  speaker?: string; // Optional speaker name, Narrator makes text italic and hides speaker name
  options?: DialogueOption[]; // If present, show choices (max 3)
  branchConditions?: BranchCondition[]; // Defines branching based on player choices
  nextId?: string; // Define the next dialogue (undefined = end), only used for non-branching dialogue
  characterLeft?: string; // Optional character key (from assetData.characters) on the left
  characterRight?: string; // Optional character key (from assetData.characters) on the right
  activeSide?: 'left' | 'right' | 'both' | 'none'; // Optional override
  location?: string; // Optional location key (from dialogueData.locations) to set background and bgm
  sfx?: string; // Optional SFX key (from useSoundStore SFX) to play when this node becomes active
}

export interface location {
  background: string;
  bgm?: string;
}

export interface BranchCondition {
  nextId: string;
  condition: (choices: number[]) => boolean;
}

/**
 * Locations for the dialogue scenes, defines background and (optionally) soundtrack
 */
export const locations: Record<string, location> = {
  lectureHall: {
    background: 'lecturehall',
    bgm: 'lectureHallSound',
  },
  hallway: {
    background: 'hallway',
    bgm: 'cafeteriaSound',
  },
  office: {
    background: 'office',
    bgm: '',
  },
  studyRoom: {
    background: 'studyroom',
    bgm: 'tutorialSound',
  },
  cafe: {
    background: 'cafe',
    bgm: 'cafeteriaSound',
  },
}

// start and end dialogue for prototyping

export const startDialogue: SceneNode[] = [
  {
    id: 'start',
    text: 'Welcome to this first prototype, a game desgined for the onboarding of student tutors and doctorial candidates.',
    speaker: 'Narrator',
    location: 'hallway',
    nextId: 'intro_0',
  },
  {
    id: 'intro_0',
    text: 'In this game you will follow Mayra, a new student tutor, as she navigates her days at the academy.',
    speaker: 'Narrator',
    nextId: 'intro_1',
  },
  {
    id: 'intro_1',
    text: 'Help her through the semester and enjoy your journey!',
    speaker: 'Narrator',
  },
  {
    id: 'cutscene_1',
    text: 'Now, a cutscene test',
    speaker: 'Narrator',
    nextId: 'cutscene_2',
  },
  {
    id: 'cutscene_2',
    type: 'cutscene',
    animationId: 'energy_gain',
    nextId: 'cutscene_3',
  },
  {
    id: 'cutscene_3',
    text: 'How did it look? Pretty cool, right?',
    speaker: 'Narrator',
  },
]

export const endDialogue: SceneNode[] = [
  {
    id: 'end',
    text: 'Your journey has only just begun. Thanks for playing the Nexum prototype!',
    speaker: 'Narrator',
    location: 'hallway',
  }
]

export const secretEnd: SceneNode[] = [
  {
    id: 'end',
    text: 'Congratulations! You have found the secret ending by making all the right choices! \\(^_^)/',
    speaker: 'Narrator',
  }
]


// ___________ Actual Dialogue Data ____________

export const introDialogue: SceneNode[] = [
  {
    id: 'start',  
    text: 'The lecture hall hums with quiet conversation.',
    speaker: 'Narrator',
    location: 'lectureHall',
    nextId: 'intro_0',
  },
  {
    id: 'intro_0',  
    text: 'The low click sounds of keys being tapped fills the space between the professors words.',
    speaker: 'Narrator',
    nextId: 'intro_1',
  },
  {
    id: 'intro_1',  
    text: '… and we will build on this concept in the coming weeks!',
    speaker: 'Professor',
    nextId: 'intro_2',
  },
  {
    id: 'intro_2',  
    text: 'Also please don’t forget that the tutorial sessions will begin this week.',
    speaker: 'Professor',
    nextId: 'intro_3',
  },
  {
    id: 'intro_3',  
    text: 'Right, almost all tutorials start this week… Including mine.',
    speaker: 'Mayra (in)',
    characterRight: 'mayra',
    nextId: 'intro_4',
  },
  {
    id: 'intro_4',  
    text: '*Sigh*… I don’t really feel ready for this… ',
    speaker: 'Mayra (in)',
    characterRight: 'mayraWorried',
    nextId: 'intro_5',
  },
  {
    id: 'intro_5',  
    text: 'But the professor leading the lecture and tutorials has asked me to come by for some last words of advice. Maybe that’s all I need.',
    speaker: 'Mayra (in)',
    characterRight: 'mayra',
    nextId: 'glimmer_cutscene',
  },
  // cutscene glowing shimmer
  {
    id: 'glimmer_cutscene',
    type: 'cutscene',
    animationId: 'glow_burst',
    nextId: 'glimmer_1',
  },
  {
    id: 'glimmer_1',  
    text: 'Huh? What was that glowing shimmer?',
    speaker: 'Mayra (in)',
    characterRight: 'mayraThinking',
    nextId: 'glimmer_2',
  },
  {
    id: 'glimmer_2',  
    text: 'Hmmm, no one else seems to notice it. Maybe I imagined it?',
    speaker: 'Mayra (in)',
    characterRight: 'mayraThinking',
    nextId: 'intro_6',
  },
  {
    id: 'intro_6',
    text: 'The lecture is over. I should get going to the meeting room the professor told me. Let’s see…',
    speaker: 'Mayra (in)',
    characterRight: 'mayra',
    nextId: 'intro_7',
  },
  {
    id: 'intro_7',
    text: 'Mayra gathers her things and leaves the lecture hall.',
    speaker: 'Narrator',
    nextId: 'intro_8',
  },
  {
    id: 'intro_8',
    text: 'Oh, hello! Please come on in.',
    speaker: 'Professor',
    location: 'office',
    characterLeft: 'professor',
    characterRight: 'mayra',
    nextId: 'intro_9',
  },
  {
    id: 'intro_9',
    text: 'This is kind of our department’s meeting room. And our work room. It’s for all sorts of things, really.',
    speaker: 'Professor',
    characterLeft: 'professor',
    characterRight: 'mayra',
    nextId: 'intro_10',
  },
  {
    id: 'intro_10',
    text: 'All tutors can feel free to use this room at any time when it isn’t currently blocked by someone. To prepare or discuss with students.',
    speaker: 'Professor',
    characterLeft: 'professor',
    characterRight: 'mayra',
    nextId: 'intro_11',
  },
  {
    id: 'intro_11',
    text: 'Oh, and there is some material on that desk over there. If you want to have a look before your first session.',
    speaker: 'Professor',
    characterLeft: 'professor',
    characterRight: 'mayra',
    nextId: 'intro_12',
  },
  {
    id: 'intro_12',
    text: 'I have to go now, but please, stay and take a look around.',
    speaker: 'Professor',
    characterLeft: 'professor',
    characterRight: 'mayra',
    nextId: 'intro_13',
  },
  {
    id: 'intro_13',
    text: 'The Professor rushes out the door.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    nextId: 'intro_14',
  },
  {
    id: 'intro_14',
    text: 'Uhm, alright! Thank you!',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'intro_15',
  },
  {
    id: 'intro_15',
    text: 'I don’t think the professor heard that anymore… He seemed to be in a rush. But maybe I can find some useful stuff on the desk?',
    speaker: 'Mayra (in)',
    characterRight: 'mayraThinking',
    nextId: 'decision_0',
  },
  {
    id: 'decision_0',
    text: 'What should Mayra do?',
    options: [
      { text: 'Stay and take a look at the desk', nextId: 'choice_look', choice: { introChoice: 'lookAround' } },
      { text: 'Leave', nextId: 'choice_leave', choice: { introChoice: 'leave' } },
    ],
  },
  {
    id: 'choice_look',
    text: 'Mayra moves over to the desk. Several paper sheets lie scattered on the wooden surface next to a stack of books.',
    speaker: 'Narrator',
    nextId: 'table_game',
  },
  {
    id: 'table_game',
    type: 'minigame',
    minigameId: 'paper_table',
    nextId: 'choice_leave',
  },
  {
    id: 'choice_look_2',
    text: 'She picks up one of the sheets and starts reading.',
    speaker: 'Narrator',
    nextId: 'choice_look_3',
  },
  {
    id: 'choice_look_3',
    text: 'How to motivate students...',
    speaker: 'Mayra',
    characterRight: 'mayraThinking',
    nextId: 'choice_leave',
  },
  {
    id: 'choice_leave',
    text: 'Mayra moves to the door to leave the room.',
    speaker: 'Narrator',
  },
]

export const pipIntroDialogue: SceneNode[] = [
  {
    id: 'start',
    text: 'As Mayra moves her hand to push down the door handle, another glimmer suddenly illuminates the room.',
    speaker: 'Narrator',
    location: 'office',
    nextId: 'glimmer_cutscene',
  },
  // cutscene glowing shimmer
  {
    id: 'glimmer_cutscene',
    type: 'cutscene',
    animationId: 'glow_burst',
    nextId: 'glimmer_text',
  },
  {
    id: 'glimmer_text',
    text: 'Huh? It\'s that glowing shimmer again...',
    speaker: 'Mayra (in)',
    characterRight: 'mayraThinking',
    nextId: 'flash_cutscene',
  },
  // cutscene light flash
  {
    id: 'flash_cutscene',
    type: 'cutscene',
    animationId: 'light_flash',
    nextId: 'intro_0',
  },
  {
    id: 'intro_0',
    text: 'Ahhhhhh! What was that?!',
    speaker: 'Mayra',
    characterRight: 'mayraShocked',
    nextId: 'pip_appearance_cutscene',
  },
  // cutscene pip appearance flash
  {
    id: 'pip_appearance_cutscene',
    type: 'cutscene',
    animationId: 'pip_appearance_flash',
    nextId: 'intro_1',
  },
  {
    id: 'intro_1',
    text: 'Wh... what?? Who are you? Where did you come from?!',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayraShocked',
    nextId: 'intro_2',
  },
  {
    id: 'intro_2',
    text: '....Huh.',
    speaker: 'Floating Ball',
    characterLeft: 'pip',
    characterRight: 'mayraShocked',
    nextId: 'intro_3',
  },
  {
    id: 'intro_3',
    text: 'Is... Am I imagining this?',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayraStressed',
    nextId: 'intro_4',
  },
  {
    id: 'intro_4',
    text: 'No, this is real. I am here to help you. But I have been asleep for a long time, so I am also really surprised to be here.',
    speaker: 'Floating Ball',
    characterLeft: 'pip',
    characterRight: 'mayraStressed',
    nextId: 'intro_5',
  },
  {
    id: 'intro_5',
    text: 'How... What are you? How can you talk?',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayraThinking',
    nextId: 'intro_6',
  },
  {
    id: 'intro_6',
    text: 'Pffft, how can you talk? You can talk too, can\'t you? That\'s just how it is.',
    speaker: 'Floating Ball',
    characterLeft: 'pip',
    characterRight: 'mayraThinking',
    nextId: 'intro_7',
  },
  {
    id: 'intro_7',
    text: 'I am Pip. You can think of me as the manifestation of learning and reflection.',
    speaker: 'Floating Ball',
    characterLeft: 'pip',
    characterRight: 'mayraThinking',
    nextId: 'intro_8',
  },
  {
    id: 'intro_8',
    text: 'I appear when people are in need of guidance.',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayraThinking',
    nextId: 'intro_9',
  },
  {
    id: 'intro_9',
    text: 'Pip?... I am Mayra. Nice to meet you, Pip.',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'intro_10',
  },
  {
    id: 'intro_10',
    text: 'Hey, I actually have to confess something to you, Mayra.',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'intro_11',
  },
  {
    id: 'intro_11',
    text: 'I have been asleep for a long time and I think I lost a lot of my energy… and now I am this ugly grey… and I feel so weak…',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'intro_12',
  },
  {
    id: 'intro_12',
    text: 'But you will help me to get stronger again, right??',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'choice_help',
  },
  {
    id: 'choice_help',
    text: 'But you will help me to get stronger again, right??',
    speaker: 'Pip',
    options: [
      { text: 'Yes, sure!', nextId: 'help_0', choice: { helpPip: true } }, 
      { text: 'I have to leave, actually', nextId: 'leave_0', choice: { helpPip: false } },
    ],
  },
  // _____ Help Pip Option Start _____
  {
    id: 'help_0',
    text: 'Okay, sure. What can I do?',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'help_1',
  },
  {
    id: 'help_1',
    text: 'Oh great! Thank youuuuuuu, you are my rescue!',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'help_2',
  },
  {
    id: 'help_2',
    text: 'I will just follow you around and absorb the energy you create.',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'help_3',
  },
  {
    id: 'help_3',
    text: 'What? What does that even mean? How do I create energy? And what do you mean by absorb? Are you like a vampire or something??',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayraStressed',
    nextId: 'help_4',
  },
  {
    id: 'help_4',
    text: 'Pffft, no, I am not a vampire! I just need to be around you and see you doing things. That will give me energy. I will get stronger the more you do things and the more energy I have. You will see.',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayraStressed',
    nextId: 'help_5',
  },
  {
    id: 'help_5',
    text: 'Do you have plans now? Where are we going next?',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'help_6',
  },
  {
    id: 'help_6',
    text: 'Yes, I will teach a tutorial session now. I should actually be on my way to the classroom right now.',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'help_7',
  },
  {
    id: 'help_7',
    text: 'Perfect, lead the way!',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'toclassroom_0',
  },
  // _____ Help Pip Option End _____
  // _____ Leave Option Start _____
  {
    id: 'leave_0',
    text: 'Sorry, I have to leave now. I am holding a tutorial session in a bit.',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayraStressed',
    nextId: 'leave_1',
  },
  {
    id: 'leave_1',
    text: 'Oh, that\'s actually perfect! You don\'t have to worry about me, I will be just behind you and absorb the energy you create.',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayraStressed',
    nextId: 'leave_2',
  },
  {
    id: 'leave_2',
    text: 'What? What does that even mean? How do I create energy? And what do you mean by absorb? Are you like a vampire or something??',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayraShocked',
    nextId: 'leave_3',
  },
  {
    id: 'leave_3',
    text: 'Pffft, no, I am not a vampire! I just need to be around you and see you doing things. That will give me energy. I will get stronger the more you do things and the more energy I have. You will see.',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayraStressed',
    nextId: 'toclassroom_0',
  },
  // _____ Leave Option Start _____

  {
    id: 'toclassroom_0',
    text: 'How do I explain the floating ball behind me to the students?',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'toclassroom_1',
  },
  {
    id: 'toclassroom_1',
    text: 'Don\'t worry, they can\'t see me.',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'toclassroom_2',
  },
  {
    id: 'toclassroom_2',
    text: 'Okay... If he says so...',
    speaker: 'Mayra (in)',
    characterRight: 'mayra',
  },
]

export const scenario1Dialogue: SceneNode[] = [
  {
    id: 'start',
    text: 'Mayra enters the classroom for her first tutorial session. The students are already seated and looking at their exercise sheets.',
    speaker: 'Narrator',
    location: 'studyRoom',
    nextId: 'node_0',
  },
  {
    id: 'node_0',
    text: 'Hey everyone!',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'node_1',
  },
  {
    id: 'node_1',
    text: 'The students look up and mumble quiet hellos back before averting their gaze again. Mayra moves to the front desk and sits down.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    nextId: 'node_2',
  },
  {
    id: 'node_2',
    text: 'Alrigth, the tutorial starts in a few minutes. I can do this.',
    speaker: 'Mayra (in)',
    characterRight: 'mayra',
    nextId: 'node_3',
  },
  {
    id: 'node_3',
    text: 'I remember that the start of the tutorial is the most important part. But first, I should probably introduce myself.',
    speaker: 'Mayra (in)',
    characterRight: 'mayra',
    nextId: 'choice_introduction',
  },
  {
    id: 'choice_introduction',
    text: 'How will Mayra introduce herself to the students?',
    options: [
      { text: 'Friendly introduction', nextId: 'friendly', choice: { introStyle: 'friendly' } },
      { text: 'Straight forward introduction', nextId: 'forward', choice: { introStyle: 'forward' } },
    ],
  },
  {
    id: 'friendly',
    text: 'It is nice to meet you all! My name is Mayra and I will be your tutor for this semester. I am really looking forward to working with you all and having a great time together!',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'node_4',
  },
  {
    id: 'forward',
    text: 'Hello everyone, I am Mayra and I will be your tutor for this semester. Let\'s get started.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'node_4',
  },
  {
    id: 'node_4',
    text: 'Alright, now how to start…',
    speaker: 'Mayra (in)',
    characterRight: 'mayraThinking',
    nextId: 'minigame_sorting',
  },
  {
    id: 'minigame_sorting',
    type: 'minigame',
    minigameId: 'sorting_game',
    nextId: 'after_minigame',
  },
  {
    id: 'after_minigame',
    text: 'I know how to start now. I feel ready.',
    speaker: 'Mayra (in)',
    characterRight: 'mayra',
    nextId: 'starting',
  },
  {
    id: 'starting',
    type: 'branching',
    text: 'Mayra starts the tutorial and follows her plan.', 
    speaker: 'Narrator',
    characterRight: 'mayra',
    branchConditions: [
      { 
        condition: (ids) => ids.includes(1) || ids.includes(3),
        nextId: 'overview',
      },
      { 
        condition: (ids) => ids.includes(1) || ids.includes(3),
        nextId: 'doubleintro',
      },
      { 
        condition: (ids) => ids.includes(2),
        nextId: 'fail',
      },
      { 
        condition: (ids) => ids.includes(8),
        nextId: 'doomed',
      },
      { condition: () => true, nextId: 'path_default' }, // fallback
    ],
  },
  {
    id: 'overview',
    type: 'branching',
    text: 'The students seem to be happy about the overview of the content. They noted down a lot and looked very interested.',
    speaker: 'Mayra (in)',
    characterRight: 'mayra',
    branchConditions: [
      { 
        condition: (ids) => ids.includes(1) || ids.includes(3),
        nextId: 'doubleintro',
      },
      { 
        condition: (ids) => ids.includes(2),
        nextId: 'fail',
      },
      { 
        condition: (ids) => ids.includes(8),
        nextId: 'doomed',
      },
      { condition: () => true, nextId: 'path_default' }, // fallback
    ],
  },
  {
    id: 'doubleintro',
    type: 'branching',
    text: 'Two introduction rounds might have been a bit much… The students look a bit irritated. And I am running out of time…',
    speaker: 'Mayra (in)',
    characterRight: 'mayraStressed',
    branchConditions: [
      { 
        condition: (ids) => ids.includes(2),
        nextId: 'fail',
      },
      { 
        condition: (ids) => ids.includes(8),
        nextId: 'doomed',
      },
      { condition: () => true, nextId: 'path_default' }, // fallback
    ],
  },
  {
    id: 'doomed',
    text: 'They don’t look amused at all about my sarcastic joke…',
    speaker: 'Mayra (in)',
    characterRight: 'mayraStressed',
    nextId: 'path_default',
  },
  {
    id: 'fail',
    type: 'branching',
    text: 'The students don’t look so motivated since I told them about the possibility of failing… They look rather worried and stressed.',
    speaker: 'Mayra (in)',
    characterRight: 'mayraStressed',
    branchConditions: [
      { 
        condition: (ids) => ids.includes(8),
        nextId: 'faildoomed',
      },
      { condition: () => true, nextId: 'path_default' }, // fallback
    ],
  },
  {
    id: 'faildoomed',
    text: 'And they don’t look amused at all about my sarcastic joke…',
    speaker: 'Mayra (in)',
    characterRight: 'mayraStressed',
    nextId: 'faildoomed2',
  },
  {
    id: 'faildoomed2',
    text: 'The student in the back looks genuinely panicked. I think this was a bad start….',
    speaker: 'Mayra (in)',
    characterRight: 'mayraWorried',
    nextId: 'path_default',
  },
  {
    id: 'path_default',
    text: '...',
    speaker: 'Narrator',
    nextId: 'path_default2',
  },
  {
    id: 'path_default2',
    text: 'I think we are ready to start with exercise 1 now. Please, look at the exercise sheet and…',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'clock_cutscene',
  },
  // insert choice based dialogue
  // insert clock animation cutscene
  {
    id: 'clock_cutscene',
    type: 'cutscene',
    animationId: 'clock_spin',
    nextId: 'end_0',
  },
  {
    id: 'end_0',
    text: 'Seems like this is it for today. I hope you enjoyed your time and I will see you all next week!',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'end_1',
  },
  {
    id: 'end_1',
    text: 'The students mumble a quiet goodbye and start packing their things. They leave the classroom one by one.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    nextId: 'end_2',
  },
  {
    id: 'end_2',
    text: 'Mayra\'s gaze falls on Pip. She hadn\'t noticed him at all during the tutorial and had almost forgotten about him.',
    speaker: 'Narrator',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'end_3',
  },
  {
    id: 'end_3',
    text: 'Hey, congratulations on finishing your first tutorial session!',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'end_4',
  },
  {
    id: 'end_4',
    text: 'I would like to talk to you about it for a bit. It is important that you not only make decisions but also think about them retrospectively.',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
  },
]

export const scenario1outro: SceneNode[] = [
  // start with cutscene of pip gaining color and energy
  {
    id: 'start',
    type: 'cutscene',
    animationId: 'energy_gain',
    location: 'studyRoom',
    nextId: 'pip_energy_1',
  },
  {
    id: 'pip_energy_1',
    text: 'Wonderful! I can already feel that I am getting stronger! Thank you for that!',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'pip_energy_2',
  },
  {
    id: 'pip_energy_2',
    text: 'Oh, that\'s great to hear! I am glad I could help you with that.',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'pip_energy_3',
  },
  {
    id: 'pip_energy_2',
    text: 'Although I still don\'t quite understand how I did that... I just talked to him about the tutorial and how it went... But I am happy that it helped.',
    speaker: 'Mayra (in)',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'pip_energy_3',
  },
  {
    id: 'pip_energy_3',
    text: 'Oh Pip, what was that thing at the end? You can also communicate with other students and tutors? And tell me there thoughts?',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'pip_energy_4',
  },
  {
    id: 'pip_energy_4',
    text: 'Yes, that is correct! It is a part of my power to sense the thoughts and feelings of people that have been in your situtation before.',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'pip_energy_5',
  },
  {
    id: 'pip_energy_5',
    text: 'See it as a sort of asynchronous discussion with those who were there before you. It might help you to get a better understanding of your thoughts and decisions.',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'pip_energy_6',
  },
  {
    id: 'pip_energy_6',
    text: 'Wow, that is a really intruiging power...',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayraThinking',
    nextId: 'pip_energy_7',
  },
  {
    id: 'pip_energy_7',
    text: 'Hey, I think I will leave now and go home. What are you going to do now?',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'pip_energy_8',
  },
  {
    id: 'pip_energy_8',
    text: 'Oh don\'t worry about me, I will be just fine. You will see me again when you need me.',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
  },
]

export const splitintro: SceneNode[] = [
  {
    id: 'start',
    text: 'A week later, Mayra is back on campus.',
    speaker: 'Narrator',
    location: 'hallway',
    nextId: 'friendintro_0',
  },
  {
    id: 'friendintro_0',
    text: 'She is making her way through the hallway, as she suddenly sees a familiar figure sitting on a bench.',
    speaker: 'Narrator',
    nextId: 'friendintro_1',
  },
  {
    id: 'friendintro_1',
    text: 'Oh hey Mayra! It\'s good to see you! I was looking for you actually.',
    speaker: 'Student',
    characterLeft: 'noah',
    nextId: 'friendintro_2',
  },
  {
    id: 'friendintro_2',
    text: 'This is Noah, we met in the first semester and have been friends since then. I haven\'t seen him much this semester though, although I know that he is taking the lecture I am tutoring for.',
    speaker: 'Mayra (in)',
    characterLeft: 'noah',
    characterRight: 'mayra',
    nextId: 'friendintro_3',
  },
  {
    id: 'friendintro_3',
    text: 'Hey Noah! Yeah, it\'s good to see you too! What\'s up?',
    speaker: 'Mayra',
    characterLeft: 'noah',
    characterRight: 'mayra',
    nextId: 'friendintro_4',
  },
  {
    id: 'friendintro_4',
    text: 'I switched into your tutorial group! I hope that\'s okay? I thought it would be nice to have a familiar face there.',
    speaker: 'Noah',
    characterLeft: 'noah',
    characterRight: 'mayra',
    nextId: 'friendintro_5',
  },
  {
    id: 'friendintro_5',
    text: 'Oh, that\'s actually great! It will be fun to have you there. And I think it will calm my nerves a bit to have a friend in the group.',
    speaker: 'Mayra',
    characterLeft: 'noah',
    characterRight: 'mayra',
    nextId: 'friendintro_6',
  },
  {
    id: 'friendintro_6',
    text: 'What are you doing now until the tutorial starts? Do you want to grab a coffee or something?',
    speaker: 'Noah',
    characterLeft: 'noah',
    characterRight: 'mayra',
    nextId: 'friendintro_7',
  },
  {
    id: 'friendintro_7',
    text: 'I have already planned the content for the tutorial, so I do have some time to spare. My plan was to prepare a bit more in the study room, but I guess it would be nice to have a coffee with Noah.',
    speaker: 'Mayra (in)',
    characterLeft: 'noah',
    characterRight: 'mayra',
    nextId: 'split_decision',
  },
  {
    id: 'split_decision',
    text: 'My plan was to prepare a bit more in the study room, but I guess it would be nice to have a coffee with Noah.',
    options: [
      { text: 'Go to the study room', nextId: 'choice_prep', choice: { splitChoice: 'preparation' } },
      { text: 'Go for a coffee with Noah', nextId: 'choice_coffee', choice: { splitChoice: 'coffee' } },
    ],
  },
  {
    id: 'choice_coffee',
    text: 'Sure coffee sounds great! Let\'s go.',
    speaker: 'Mayra',
    characterLeft: 'noah',
    characterRight: 'mayra',
  },
  {
    id: 'choice_prep',
    text: 'Sorry, I still have to prepare the tutorial a bit.',
    speaker: 'Mayra',
    characterLeft: 'noah',
    characterRight: 'mayraStressed',
    nextId: 'choice_study_1',
  },
  {
    id: 'choice_study_1',
    text: 'But I will see you in the tutorial room later and maybe we can catch up afterwards?',
    speaker: 'Mayra',
    characterLeft: 'noah',
    characterRight: 'mayra',
    nextId: 'choice_study_2',
  },
  {
    id: 'choice_study_2',
    text: 'Sure, that sounds good! I will see you later then.',
    speaker: 'Noah',
    characterLeft: 'noah',
    characterRight: 'mayra',
  },
]

export const coffeeDialogue: SceneNode[] = [
  {
    id: 'start',
    text: 'You know, it is only like the third week of the semester, but I am already exhausted. Is it possible to already be behind somehow?',
    location: 'cafe',
    characterLeft: 'noahSurprised',
    characterRight: 'mayra',
    options: [
      { text: 'Yes, I feel the same way', nextId: 'choice_stressed'},
      { text: 'No, I can\'t relate at all', nextId: 'choice_not_stressed' },
    ],
  },
  {
    id: 'choice_stressed',
    text: 'Yeah, I know what you mean. I also feel like I am already behind and that there is so much to do.',
    speaker: 'Mayra',
    characterLeft: 'noahSurprised',
    characterRight: 'mayraWorried',
    nextId: 'stressed_1',
  },
  {
    id: 'stressed_1',
    text: 'Well hey, at least we are in the same boat!',
    speaker: 'Noah',
    characterLeft: 'noah',
    characterRight: 'mayra',
    nextId: 'stressed_2',
  },
  {
    id: 'stressed_2',
    text: 'But I did end up signing up for a lot of courses this semester, so I guess it is not that surprising that I feel overwhelmed already... But there was no way around it, I need the credits.',
    speaker: 'Noah',
    characterLeft: 'noahThinking',
    characterRight: 'mayra',
    nextId: 'stressed_3',
  },
  {
    id: 'stressed_3',
    text: 'You are the architect of your own destiny after all, am I right? Haha.',
    speaker: 'Noah',
    characterLeft: 'noah',
    characterRight: 'mayra',
    nextId: 'talk_0',
  },
  {
    id: 'choice_not_stressed',
    text: 'Actually, I can\'t really relate to that. I think it is still a bit too early to be behind with a lecture. I don\'t know how you manage to do that.',
    speaker: 'Mayra',
    characterLeft: 'noah',
    characterRight: 'mayra',
    nextId: 'not_stressed_1',
  },
  {
    id: 'not_stressed_1',
    text: 'Wow Mayra, as organized and on top of things as always! I wish I could be like you.',
    speaker: 'Noah',
    characterLeft: 'noahSurprised',
    characterRight: 'mayra',
    nextId: 'talk_0',
  },
  {
    id: 'talk_0',
    text: 'But how about you? How are you doing with the tutorial and stuff?',
    speaker: 'Noah',
    characterLeft: 'noah',
    characterRight: 'mayra',
    nextId: 'talk_question',
  },
  {
    id: 'talk_question',
    text: 'But how about you? How are you doing with the tutorial and stuff?',
    characterLeft: 'noah',
    characterRight: 'mayra',
    options: [
      { text: 'It\'s going great', nextId: 'tutorial_good'},
      { text: 'It\'s stressing me out', nextId: 'tutorial_stressful' },
    ],
  },
  {
    id: 'tutorial_good',
    text: 'It is actually going really well! I am really enjoying it and I think the students are great.',
    speaker: 'Mayra',
    characterLeft: 'noah',
    characterRight: 'mayra',
    nextId: 'end_0',
  },
  {
    id: 'tutorial_stressful',
    text: 'It is actually stressing me out a bit. I am not sure if I am doing everything right and I am a bit worried about how the students are doing and if they are happy with the tutorial.',
    speaker: 'Mayra',
    characterLeft: 'noahSurprised',
    characterRight: 'mayraWorried',
    nextId: 'tutorial_stressful_1',
  },
  {
    id: 'tutorial_stressful_1',
    text: 'Oh don\'t worry, I am sure you are doing great! I can understand that, it is a lot of responsibility, but from now on you will also have me in the tutorial as emotional support!',
    speaker: 'Noah',
    characterLeft: 'noah',
    characterRight: 'mayraStressed',
    nextId: 'tutorial_stressful_2',
  },
  {
    id: 'tutorial_stressful_2',
    text: 'Haha that is true. Thank you for the encouragement.',
    speaker: 'Mayra',
    characterLeft: 'noah',
    characterRight: 'mayra',
    nextId: 'end_0',
  },
  {
    id: 'end_0',
    text: 'Speaking of the tutorial, I should probably head there now. Let\'s go together?',
    speaker: 'Mayra',
    characterLeft: 'noah',
    characterRight: 'mayra',
  },
]

export const scenarioSandwichDialogue: SceneNode[] = [ // Dialogue data for scenario 4 - Sandwich
  {
    id: 'start',
    text: 'Mayra enters the tutorial room, which is already filled with students.',
    speaker: 'Narrator',
    location: 'studyRoom',
    nextId: 'intro_0',
  },
  {
    id: 'intro_0',
    text: 'Hey everyone, welcome to this week’s tutorial!',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'intro_1',
  },
  {
    id: 'intro_1',
    text: 'Mayra starts by presenting the first exercise to the students in the room.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    nextId: 'cutscene_clock',
  },
  {
    id: 'cutscene_clock',
    type: 'cutscene',
    animationId: 'clock_spin',
    nextId: 'intro_2',
  },
  {
    id: 'intro_2',
    text: 'After going through the exercise sheet step by step, time is drawing to a close.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    nextId: 'intro_3',
  },
  {
    id: 'intro_3',
    text: 'Time is almost over. Just let me remind you that the homework has started, and you are expected to hand in this week’s assignment by Friday! Good luck everyone!',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'intro_4',
  },
  {
    id: 'intro_4',
    text: 'The students start leaving one by one while saying their good-byes, until only Noah is left in the room.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    nextId: 'intro_5',
  },
  {
    id: 'intro_5',
    text: 'Hey Mayra, about the homework…',
    speaker: 'Noah',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'intro_6',
  },
  {
    id: 'intro_6',
    text: 'I am really struggling with exercise 2. I have been staring at the assignment for way too long and it’s not getting me anywhere. Can you take a look?',
    speaker: 'Noah',
    characterRight: 'mayra',
    characterLeft: 'noahWorried',
    nextId: 'intro_7',
  },
  {
    id: 'intro_7',
    text: 'Without waiting for an answer, Noah pulls out his notebook and opens it.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'intro_8',
  },
  {
    id: 'intro_8',
    text: 'I get the general idea. I think… But I just don’t know how to start.',
    speaker: 'Noah',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'help_choice',
  },
  {
    id: 'help_choice',
    text: 'I just don’t know how to start.',
    options: [
      { text: 'Let’s go through it step by step', nextId: 'choice_step', choice: { helpStyle: 'step' } },
      { text: 'Here is how you solve it', nextId: 'choice_solution', choice: { helpStyle: 'solution' } },
      { text: 'I am not helping you', nextId: 'choice_nohelp' },
    ],
  },
  {
    id: 'choice_nohelp',
    text: 'Sorry, but this is your homework for you to solve.',
    speaker: 'Mayra',
    characterRight: 'mayraStressed',
    characterLeft: 'noahSurprised',
    nextId: 'choice_nohelp_1',
  },
  {
    id: 'choice_nohelp_1',
    text: 'Oh, come on! I am not asking you for the solution, I am asking you for help. You are my tutor after all.',
    speaker: 'Noah',
    characterRight: 'mayraStressed',
    characterLeft: 'noahWorried',
    nextId: 'decision_nohelp',
  },
  {
    id: 'decision_nohelp',
    text: 'What should Mayra do?',
    options: [
      { text: 'Stick to the decision and not help Noah', nextId: 'nohelp_end', choice: { helpStyle: 'no' } },
      { text: 'Help him with the start of the exercise', nextId: 'help_start', choice: { helpStyle: 'start' } },
    ],
  },
  {
    id: 'nohelp_end',
    text: 'I can\'t help you with that, you have to figure it out on your own. Look at the slides of this week\'s lecture again. At the end there is a detailed explanation of the topic and on what calculations to use.',
    speaker: 'Mayra',
    characterRight: 'mayraStressed',
    characterLeft: 'noahWorried',
    nextId: 'nohelp_end_1',
  },
  { 
    id: 'nohelp_end_1',
    text: 'Wow, you are ice cold…. Then I will just look at the slides again and try on my own.',
    speaker: 'Noah',
    characterRight: 'mayraStressed',
    characterLeft: 'noahSurprised',
    nextId: 'nohelp_end_2',
  },
  { 
    id: 'nohelp_end_2',
    text: 'Noah puts his notebook away and leaves the room. Mayra remains alone.',
    speaker: 'Narrator',
    characterRight: 'mayraStressed',
    nextId: 'end_1',
  },
  // end no help option
  {
    id: 'help_start',
    text: 'Alright, I can tell you how to start.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'noahSurprised',
    nextId: 'help_start_1',
  },
  {
    id: 'help_start_1',
    text: 'Thank you! That’s already something.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'help_start_2',
  },
  {
    id: 'help_start_2',
    text: 'Mayra looks into Noah’s notebook and explains to him what method he should use for this exercise.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'help_start_3',
  },
  {
    id: 'help_start_3',
    text: 'Ahhhh okay, I see! I think I can at least get a bit further now in the exercise. Thank you Mayra!',
    speaker: 'Noah',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'help_start_4',
  },
  {
    id: 'help_start_4',
    text: 'I just hope I get it done by the end of the week…',
    speaker: 'Noah',
    characterRight: 'mayra',
    characterLeft: 'noahWorried',
    nextId: 'help_start_5',
  },
  {
    id: 'help_start_5',
    text: 'Anyways, I have to go now. Thank you and see you later!',
    speaker: 'Noah',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'end_0',
  },
  // end help start option
  {
    id: 'choice_step',
    text: 'We can go through it together step by step, alright? Do you have any idea on how to start?',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'choice_step_1',
  },
  {
    id: 'choice_step_1',
    text: 'Hmmm, maybe like this?',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'noahThinking',
    nextId: 'choice_step_2',
  },
  {
    id: 'choice_step_2',
    text: 'Uhm, almost. You just forgot something here. Do you know what it is?',
    speaker: 'Mayra',
    characterRight: 'mayraThinking',
    characterLeft: 'noahThinking',
    nextId: 'choice_step_3',
  },
  {
    id: 'choice_step_3',
    text: 'Mayra goes through the start of exercise with Noah step by step.',
    speaker: 'Narrator',
    characterRight: 'mayraThinking',
    characterLeft: 'noahThinking',
    nextId: 'choice_step_4',
  },
  {
    id: 'choice_step_4',
    text: 'Okay, I think I got it! Thank you Mayra!',
    speaker: 'Noah',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'choice_step_5',
  },
  {
    id: 'choice_step_5',
    text: 'Great, I think you can manage the rest by yourself.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'choice_step_6',
  },
  {
    id: 'choice_step_6',
    text: 'Yes, I’ll try. I have to leave now anyways, or I’ll be late for my next class. Thanks, and see you later!',
    speaker: 'Noah',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'end_0',
  },
  // end choice step option
  {
    id: 'choice_solution',
    text: 'Okay, let me just show you how to solve it.',
    speaker: 'Mayra',
    characterRight: 'mayraStressed',
    characterLeft: 'noahSurprised',
    nextId: 'solution_1',
  },
  {
    id: 'solution_1',
    text: 'Nice! I knew I could count on you Mayra.',
    speaker: 'Noah',
    characterRight: 'mayraStressed',
    characterLeft: 'noah',
    nextId: 'solution_2',
  },
  {
    id: 'solution_2',
    text: 'Mayra talks Noah through the exercise while scribbling down calculations and explaining how to do it.',
    speaker: 'Narrator',
    characterRight: 'mayraThinking',
    characterLeft: 'noah',
    nextId: 'solution_3',
  },
  {
    id: 'solution_3',
    text: 'Do you get it now?',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'solution_4',
  },
  {
    id: 'solution_4',
    text: 'Yes, sure, thank you! What about the other exercises??',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'solution_5',
  },
  {
    id: 'solution_5',
    text: 'The other exercises? I said I would help you with this one, not your whole homework.',
    speaker: 'Mayra',
    characterRight: 'mayraStressed',
    characterLeft: 'noahSurprised',
    nextId: 'solution_6',
  },
  {
    id: 'solution_6',
    text: 'Fine, I’ll try them on my own first. I have to leave now anyways. Thanks, and see you later!',
    speaker: 'Noah',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'solution_7',
  },
  {
    id: 'solution_7',
    text: 'I hope he won’t ask me for every homework now…',
    speaker: 'Mayra (in)',
    characterRight: 'mayraStressed',
    characterLeft: 'noah',
    nextId: 'end_0',
  },
  {
    id: 'end_0',
    text: 'Noah vanishes through the door, into the hallway.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    nextId: 'end_1',
  },
  {
    id: 'end_1',
    text: 'Mayra starts packing her things. As she closes up her bag, she suddenly feels a presence right behind her.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    nextId: 'end_2',
  },
  {
    id: 'end_2',
    text: 'Pip! You are still there.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'end_3',
  },
  {
    id: 'end_3',
    text: 'Of course I am! After all, I am still counting on your reflections.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
  },
]

export const sandwichOutro: SceneNode[] = [
  {
    id: 'start',
    type: 'cutscene',
    animationId: 'energy_gain',
    location: 'studyRoom',
    nextId: 'pip_energy_1',
  },
  {
    id: 'pip_energy_1',
    text: 'Wohoo! I feel so energized! Thank you for that!',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'pip_energy_2',
  },
  {
    id: 'pip_energy_2',
    text: 'You know, these are difficult questions you have to answer, but if you have thought about it once, you\'ll have a starting point for the next time you encounter this question.',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'pip_energy_3',
  },
  {
    id: 'pip_energy_3',
    text: 'And your effort in reflecting and discussing it with the thought ghosts of the past helps me regain energy and fully come to life again. So truly, thank you Mayra!',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
  },
]

export const preparationDialogue: SceneNode[] = [
  {
    id: 'start',
    text: 'Mayra enters the office room.',
    speaker: 'Narrator',
    location: 'office',
    nextId: 'prep_0',
  },
  {
    id: 'prep_0',
    text: 'Okay, the professor told me that I could come here to prepare my tutorial. I just want to go over the exercises once again and plan the time of the tutorial in more detail.',
    speaker: 'Mayra (in)',
    characterRight: 'mayra',
    nextId: 'prep_1',
  },
  {
    id: 'prep_1',
    text: 'Hello Mayra! Good to see you again.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'prep_2',
  },
  {
    id: 'prep_2',
    text: 'Oh, Pip! Have you been in here this whole time?',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'prep_3',
  },
  {
    id: 'prep_3',
    text: 'No, not really. But I am here now. How are you feeling about your upcoming tutorial?',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'decision_feelings',
  },
  {
    id: 'decision_feelings',
    text: 'How are you feeling about your upcoming tutorial?',
    options: [
      { text: 'I feel well prepared', nextId: 'feelings_good', choice: { prepared: 'good' } },
      { text: 'I am not so sure...', nextId: 'feelings_unsure', choice: { prepared: 'unsure' } },
    ],
  },
  {
    id: 'feelings_unsure',
    text: 'I am not so sure… It still feels kind of new and scary to me.',
    speaker: 'Mayra',
    characterRight: 'mayraWorried',
    characterLeft: 'pip',
    nextId: 'feelings_unsure_1',
  },
  {
    id: 'feelings_unsure_1',
    text: 'Oh, don’t worry! If you have managed it till now, then you will also manage the tutorial session today.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'feelings_unsure_2',
  },
  {
    id: 'feelings_unsure_2',
    text: 'Hey! Actually, the professor has some material on holding tutorial sessions lying on his desk. You should go take a look!',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'feelings_unsure_3',
  },
  {
    id: 'feelings_unsure_3',
    text: 'Mayra moves over to the professor\'s desk and looks at the material lying there.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'table_minigame',
  },
  {
    id: 'table_minigame',
    type: 'minigame',
    minigameId: 'variant_paper_table',
    nextId: 'after_table_0',
  },
  {
    id: 'after_table_0',
    text: 'That was helpful, thank you for the hint Pip.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'after_table_1',
  },
  {
    id: 'after_table_1',
    text: 'No worries, that’s what I am here for.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'end_0',
  },

  {
    id: 'feelings_good',
    text: 'Really good actually, I do feel well prepared.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'feelings_good_1',
  },
  {
    id: 'feelings_good_1',
    text: 'Oh that is great to hear! Seems like you have quickly gotten used to your new tutor role.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'feelings_good_2',
  },
  {
    id: 'feelings_good_2',
    text: 'If you have any further questions, the professor has some material lying on his desk that you can take a look at.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'table_choice',
  },
  {
    id: 'table_choice',
    text: 'Do you want to take a look at the material on the table?',
    options: [
      { text: 'Take a look at the desk', nextId: 'feelings_unsure_3'},
      { text: 'Leave it', nextId: 'no_table' },
    ],
  },
  {
    id: 'no_table',
    text: 'No, I think I will manage. But thanks for the hint.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'no_table_1',
  },
  {
    id: 'no_table_1',
    text: 'Okay, if you say so.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'end_0',
  },
  {
    id: 'end_0',
    text: 'I think I am ready for the tutorial session today, I just have to sort my material…',
    speaker: 'Mayra',
    characterRight: 'mayraThinking',
    characterLeft: 'pip',
    nextId: 'end_1',
  },
  {
    id: 'end_1',
    text: 'Mayra rustles several papers in her hands, which she pulls from her bag one by one.',
    speaker: 'Narrator',
    characterRight: 'mayraThinking',
    characterLeft: 'pip',
    nextId: 'end_2',
  },
  {
    id: 'end_2',
    text: 'Alright! The tutorial can start. Will you follow me again?',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'end_3',
  },
  {
    id: 'end_2',
    text: 'Yes, I will be right behind you.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'end_3',
  },
  {
    id: 'end_3',
    text: 'Mayra and pip leave the office room and head to the tutorial room.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    characterLeft: 'pip',
  },
]



export const scenario5Dialogue: SceneNode[] = [ // Dialogue data for scenario 5 - Work organization
  {
    id: 'start',
    text: 'Infront of Mayra lies a silent classroom filled with students. Most of them are looking down at their tablets or exercise sheets, some look directly at her with an expectant gaze.',
    speaker: 'Narrator',
    location: 'studyRoom',
    nextId: 'intro_0',
  },
  {
    id: 'intro_0',
    text: 'Alright, so far so good. The next step is exercise one. I should let them work on it in some way. Hmmm, should I maybe split them into groups? Or is it more effective if everyone is on their own?',
    speaker: 'Mayra (in)',
    characterRight: 'mayra',
    nextId: 'decision_0',
  },
  {
    id: 'decision_0',
    text: 'How should Mayra organize the work on the exercise?',
    options: [
      { text: 'Let them work on their own', nextId: 'choice_0_0', choice: { workOrganization: 'individual' } },
      { text: 'Have them work in groups', nextId: 'choice_0_1', choice: { workOrganization: 'groups' } },
      { text: 'Have them work in pairs', nextId: 'choice_0_2', choice: { workOrganization: 'pairs' } },
    ],
  },
  // Option 0 of Choice 0 start
  {
    id: 'choice_0_0',
    text: 'Okay everyone! Next, please work on exercise one by yourself. We will discuss your solutions afterwards.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'work_0',
  },
  // Option 1 of Choice 0 start
  {
    id: 'choice_0_1',
    text: 'Okay everyone! Next, please work on exercise one together in groups. Try to group together with the people next to you so you build groups of four. Five or three people are also fine. We will discuss your solutions afterwards.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'work_0',
  },
  // Option 1 of Choice 0 start
  {
    id: 'choice_0_2',
    text: 'Okay everyone! Next, please pair up to work on exercise one. You can just turn to the person sitting next to you. If someone is left, one group of three is also fine. We will discuss your solutions afterwards.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'work_0',
  },
  // Work Scenario start
  {
    id: 'work_0',
    text: 'Okay, looks like everyone is starting to work. At least they are looking at the exercise sheet and some already starting writing.',
    speaker: 'Mayra (in)',
    characterRight: 'mayra',
    nextId: 'work_1',
  },
  {
    id: 'work_1',
    text: 'Some students look unsure about what they are doing… Or maybe I am imagining it? I should remind them that they can ask me questions or be there if someone is lost.',
    speaker: 'Mayra (in)',
    characterRight: 'mayra',
    nextId: 'decision_1',
  },
  {
    id: 'decision_1',
    text: 'What should Mayra do?',
    options: [
      { text: 'Stay at the front and tell them that they can just ask questions anytime', nextId: 'choice_1_0', choice: { supportStyle: 'front' } },
      { text: 'Walk from desk to desk and ask them how they are doing individually', nextId: 'choice_1_1', choice: { supportStyle: 'walk' } },
    ],
  },
  // Option 0 of Choice 1 start
  {
    id: 'choice_1_0',
    text: 'Remember, if you have any questions, you can ask anytime. I am right here to answer them.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'front_0',
  },
  {
    id: 'front_0',
    text: 'Mayra sits in a rather quiet room for a while. A slight murmur goes through the room, while most students keep their eyes averted to their paper. Then a girl raises her hand. Mayra helps her and a few more students with their questions until the first students seem to have finished the task.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    nextId: 'ending_0',
  },
  // Option 1 of Choice 1 start
  {
    id: 'choice_1_1',
    text: 'Mayra starts walking around from table to table to see how the students are doing. She comes across a boy that does not seem to have written anything yet. He stares at the paper with a frown.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    nextId: 'walking_0',
  },
  {
    id: 'walking_0',
    text: 'Hey, are you managing okay? Do you need any help?',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'boyStudent',
    nextId: 'walking_1',
  },
  {
    id: 'walking_1',
    text: 'Uhmm…. I just don\’t really know how to start…',
    speaker: 'Student',
    characterRight: 'mayra',
    characterLeft: 'boyStudent',
    nextId: 'walking_2',
  },
  {
    id: 'walking_2',
    text: 'Ah okay. So, remember the exercise from last week? Similar to that, you start by doing…',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'boyStudent',
    nextId: 'walking_3',
  },
  {
    id: 'walking_3',
    text: 'Mayra starts explaining to the boy what to do. He still seems a bit confused at first, but after starting with the first step he slowly seems more engaged within the exercise. Mayra continues to walk around from table to table and answers a few other questions before returning to her desk in the front.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    characterLeft: 'boyStudent',
    nextId: 'ending_0',
  },
  // Ending start
  {
    id: 'ending_0',
    text: 'We do not have much time left, so let\’s start discussing your solutions! Is there anyone that wants to present what they have done?',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'ending_1',
  },
  {
    id: 'ending_1',
    text: 'The tutorial goes on for another 60 minutes quite uneventfully.',
    speaker: 'Narrator',
    characterRight: 'mayra',
    nextId: 'ending_2',
  },
  {
    id: 'ending_2',
    text: 'I think that\’s it for today! Thank you all for coming and I will see you next week.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'ending_3',
  },
  {
    id: 'ending_3',
    text: '...',  
  },
]

export const scenario5outro: SceneNode[] = [
  {
    id: 'start',
    type: 'cutscene',
    animationId: 'energy_gain',
    location: 'studyRoom',
    nextId: 'outro_0',
  },
  {
    id: 'outro_0',
    text: 'That was a great tutorial session! I feel so glowy and energized!',
    speaker: 'Pip',
    characterLeft: 'pip',
    characterRight: 'mayra',
    nextId: 'outro_1',
  },
  {
    id: 'outro_1',
    text: 'I am glad to hear that. I am also really happy that things have been going well so far. I hope it stays like this for the rest of the semester.',
    speaker: 'Mayra',
    characterLeft: 'pip',
    characterRight: 'mayra',
  },
]

export const coffeeToPrepDialogue: SceneNode[] = [
  {
    id: 'start',
    text: 'A week later, Mayra arrives back at the university again. Since she has a bit of time until her tutorial starts, she decides to pass it by in the office room.',
    speaker: 'Narrator',
    location: 'hallway',
  },
]

export const prepToCoffeeDialogue: SceneNode[] = [
  {
    id: 'start',
    text: 'The next week, Mayra is back at the university. Before her tutorial starts, she decides to grab something for lunch at the university cafe.',
    speaker: 'Narrator',
    location: 'hallway',
    nextId: 'cafe',
  },
  {
    id: 'cafe',
    text: 'On her way back, she runs into Noah.',
    speaker: 'Narrator',
    location: 'cafe',
    characterRight: 'mayra',
    characterLeft: 'noah',
    nextId: 'cafe_1',
  },
  {
    id: 'cafe_1',
    text: 'Oh hey Noah! How are you doing?',
    speaker: 'Mayra',
    location: 'cafe',
    characterRight: 'mayra',
    characterLeft: 'noah',
  }
]

export const connectingDialogue: SceneNode[] = [
  {
    id: 'start',
    text: 'After the tutorial session, Mayra goes back to the office room one more time.',
    speaker: 'Narrator',
    nextId: 'connect_1',
  },
  {
    id: 'connect_1',
    text: 'You really have recollected some color since I first met you, Pip.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'pip',
    location: 'office',
    nextId: 'connect_2',
  },
  {
    id: 'connect_2',
    text: 'Yes, that is true! I am really grateful for your reflections and discussions.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'pip_decision',
  },
  {
    id: 'pip_decision',
    text: '',
    characterRight: 'mayra',
    characterLeft: 'pip',
    options: [
      { text: 'Thank Pip for his help', nextId: 'thanks', choice: { thankPip: true } },
      { text: 'Remind him, that you didn\'t really have a choice', nextId: 'nothanks', choice: { thankPip: false } },
    ],
  },
  {
    id: 'thanks',
    text: 'I just want to say thank you for your help, Pip. I really appreciate it.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'thanks_1',
  },
  {
    id: 'thanks_1',
    text: 'I am glad I could help you. It was really fun to talk to you and follow you around.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'continue_0',
  },

  {
    id: 'nothanks',
    text: 'I mean, it\'s not like I really had a choice, you just started to follow me around.',
    speaker: 'Mayra',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'nothanks_1',
  },
  {
    id: 'nothanks_1',
    text: 'Well, that is kind of true. I still think it was a fun adventure for both of us.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'continue_0',
  },
  {
    id: 'continue_0',
    text: 'But it might be time for me to leave now. I feel like my time here is coming to an end.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
  },
]

export const endingDialogue: SceneNode[] = [
  {
    id: 'start',
    text: 'Don\'t worry, if you truely need me, I will reapper. But until then, goodbye!',
    speaker: 'Pip',
    location: 'office',
    characterRight: 'mayra',
    characterLeft: 'pip',
  },
]

export const trueEndingDialogue: SceneNode[] = [
  {
    id: 'start',
    text: 'I think you really help me regain all my energy. I feel stronger than ever before!',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    location: 'office',
    nextId: 'true_ending_1',
  },
  {
    id: 'true_ending_1',
    text: 'You are truely ready for your adventure in the world of tutoring. I am impressed. And now, I can ascend back home with my regained power and the knowledge that you will be just fine.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
  },
]

export const secretEndingDialogue: SceneNode[] = [
  {
    id: 'start',
    text: 'You really helped me Mayra, I feel a lot stronger than before. But I think you are ready to go on without me now.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    location: 'office',
    nextId: 'secret_ending_1',
  },
  {
    id: 'secret_ending_1',
    text: 'You know, I was created centuries ago in an accident by a group of scholars. In a way, I am the manifestation of their learning, teaching and reflecting.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'secret_ending_2',
  },
  {
    id: 'secret_ending_2',
    text: 'I can now ascend back to the world of thought ghosts with my power back. But I will always be there, if you should need me again.',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
    nextId: 'secret_ending_3',
  },
  {
    id: 'secret_ending_3',
    text: 'I will miss you. Good luck with your tutoring adventure, Mayra!',
    speaker: 'Pip',
    characterRight: 'mayra',
    characterLeft: 'pip',
  },
]

// ___________ Dialogue Data End ____________


/**
 * Debugging dialogue data from TUM's Tutor Academy
 */
export const tutorAcademyDialogues: SceneNode[] = [
  {
    id: 'start',
    text: 'Hello! This is a prototype for a self reflection system based on a scenario from the Tutor Academy by ProLehre. Enjoy your journey!',
    speaker: 'Narrator',
    nextId: 'intro',
  },
  {
    id: 'intro',
    text: 'Emma is a spirited and resourceful tutor, faced with a classroom full of students who are attentive but surprisingly silent. Each desk is occupied by a student who seems to follow along with the lesson but remains passive, showing little initiative to participate or ask questions. This unusual quietness presents a peculiar challenge for Emma, who is used to a more interactive teaching environment.\n\nDetermined to break through this barrier, Emma scans the room, trying to gauge the students\' interest levels and looking for any signs of confusion or engagement that she might work with. The stillness of the room is almost palpable, making Emma\'s task to draw out their voices and thoughts even more daunting.\n\nShe knows that beneath this layer of silence, there is potential for vibrant discussions and lively interactions that could enrich the learning experience. Emma prepares to employ a range of strategies, from direct questioning to integrating more dynamic group activities, aiming to transform the passive learning atmosphere into one of active participation and enthusiasm. Her goal is clear: to ignite a spark of involvement in each student, turning the quiet class into a lively forum for exchange and learning.',
    nextId: 'choice_1',
  },
  {
    id: 'choice_1',
    text: 'How should Emma address this situation?',
    options: [
      { text: 'She should ask the class why they are so quiet and if they are finding the material difficult to understand.', nextId: 'ask' },
      { text: 'She should decide to include more group activities and games that require interaction.', nextId: 'groupwork', },
      { text: 'She should opt to modify her teaching style by speaking less and prompting the students with open-ended questions to think critically.', nextId: 'teachingstyle' },
    ],
  },
  {
    id: 'ask',
    text: 'When Emma directly addresses the quietness of the class, the students are visibly caught off guard. They exchange uncertain glances, and the room is filled with a tense silence that lingers momentarily. The unexpected question hangs in the air, giving the students a moment to process their tutor\'s candid concern.',
    nextId: 'ask2',
  },
  {
    id: 'ask2',
    text: 'Slowly, the atmosphere begins to thaw as a few students muster the courage to respond. One by one, they reveal that their silence is not due to disinterest but rather a shared feeling of uncertainty and lack of confidence in their grasp of the material. Their voices are tentative at first, barely above a whisper, but as they begin to see nods of agreement from their peers, their tones grow slightly stronger.\nThis open communication acts as a bridge, reducing the invisible barrier that had stifled their participation. Emma listens attentively, nodding and encouraging further sharing. This initial break in the silence fosters a sense of solidarity among the students, as they realize they are not alone in their feelings. Emma\'s direct approach, though initially shocking, opens a vital channel of communication that sets the stage for a more engaged and supportive learning environment.',
    nextId: 'ending',
  },
  {
    id: 'groupwork',
    text: 'Emma, recognizing the silent but attentive nature of her students, decides to incorporate more group activities and interactive games into her lessons. This shift towards a more dynamic teaching style aims to break the ice and foster a lively classroom environment. By designing activities that necessitate collaboration and communication, she prompts her students to engage not just with the material but with each other. Simple icebreakers evolve into complex problem-solving tasks requiring teamwork, and games that stimulate quick thinking and strategy help keep the energy high and the students involved.',
    nextId: 'groupwork2',
  },
  {
    id: 'groupwork2',
    text: 'As Emma observes the positive changes in her class—the laughter, the excited discussions, and the budding teamwork—she notes a significant increase in student participation. The once quiet room now buzzes with the sound of students debating concepts and sharing ideas, clearly enjoying the new, more interactive elements of the lessons.',
    nextId: 'ending',
  },
  {
    id: 'teachingstyle',
    text: 'Emma\'s decision to adjust her teaching style by reducing her direct lecturing and instead using open-ended questions to prompt critical thinking has significantly altered the classroom dynamics. This approach encourages students to actively engage with the material, ponder deeper questions, and articulate their thoughts. By stepping back, Emma allows the students\' voices to become the primary drivers of the classroom discourse, fostering a more student-centered learning environment.',
    nextId: 'teachingstyle2',
  },
  {
    id: 'teachingstyle2',
    text: 'As sessions progress, the classroom becomes a lively hub of inquiry and debate. Emma poses questions that challenge students to think beyond textbooks, connecting theoretical knowledge with real-world applications. This method not only cultivates a higher level of critical thinking but also enhances students\' confidence in expressing their opinions and defending their viewpoints. The students become more invested in their learning, eager to contribute and share their insights.',
    nextId: 'ending',
  },
  {
    id: 'ending',
    text: 'Your journey has only just begun. Thanks for playing the Nexum prototype!',
  },
];