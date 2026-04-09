
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
  type?: 'dialogue' | 'cutscene' | 'minigame'; // 'dialogue' is default if undefined
  animationId?: string; // Used if type is 'cutscene'
  minigameId?: string; // Used if type is 'minigame'
  text?: string;
  speaker?: string; // Optional speaker name, Narrator makes text italic and hides speaker name
  options?: DialogueOption[]; // If present, show choices (max 3)
  nextId?: string; // Define the next dialogue (undefined = end), only used for non-branching dialogue
  characterLeft?: string; // Optional character key (from assetData.characters) on the left
  characterRight?: string; // Optional character key (from assetData.characters) on the right
  background?: string; // Optional background key (from assetData.backgrounds)
}

// start and end dialogue for prototyping

export const startDialogue: SceneNode[] = [
  {
    id: 'start',
    text: 'Welcome to this first prototype, a game desgined for the onboarding of student tutors and doctorial candidates.',
    speaker: 'Narrator',
    background: 'hallway',
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
    nextId: 'cutscene_1',
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
    animationId: 'clock_spin',
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
    background: 'hallway',
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
    background: 'lecturehall',
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
    text: '(Right, almost all tutorials start this week… Including mine.)',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'intro_4',
  },
  {
    id: 'intro_4',  
    text: '(*Sigh*… I don’t really feel ready for this… )',
    speaker: 'Mayra',
    characterRight: 'mayraWorried',
    nextId: 'intro_5',
  },
  {
    id: 'intro_5',  
    text: '(But the professor leading the lecture and tutorials has asked me to come by for some last words of advice. Maybe that’s all I need.)',
    speaker: 'Mayra',
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
    text: '(Huh? What was that glowing shimmer?)',
    speaker: 'Mayra',
    characterRight: 'mayraThinking',
    nextId: 'glimmer_2',
  },
  {
    id: 'glimmer_2',  
    text: '(Hmmm, no one else seems to notice it. Maybe I imagined it?)',
    speaker: 'Mayra',
    characterRight: 'mayraThinking',
    nextId: 'intro_6',
  },
  {
    id: 'intro_6',
    text: '(The lecture is over. I should get going to the meeting room the professor told me. Let’s see…)',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'intro_7',
  },
  {
    id: 'intro_7',
    text: 'Mayra looks at the last email and leaves the lecture hall.',
    speaker: 'Narrator',
    nextId: 'intro_8',
  },
  {
    id: 'intro_8',
    text: 'Oh, hello! Please come on in.',
    speaker: 'Professor',
    background: 'office',
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
    text: '(I don’t think the professor heard that anymore… He seemed to be in a rush. But maybe I can find some useful stuff on the desk?)',
    speaker: 'Mayra',
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
    nextId: 'choice_look_2',
  },
  {
    id: 'choice_look_2',
    text: 'She picks up up one of the sheets and starts reading.',
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
    background: 'office',
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
    text: '(Huh? It\'s that glowing shimmer again...)',
    speaker: 'Mayra',
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
    text: '(Okay... If he says so...)',
    speaker: 'Mayra',
    characterRight: 'mayra',
  },
]

export const scenario1Dialogue: SceneNode[] = [
  {
    id: 'start',
    text: 'Mayra enters the classroom for her first tutorial session. The students are already seated and looking at their exercise sheets.',
    speaker: 'Narrator',
    background: 'studyroom',
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
    text: '(Alrigth, the tutorial starts in a few minutes. I can do this.)',
    speaker: 'Mayra',
    characterRight: 'mayra',
    nextId: 'node_3',
  },
  {
    id: 'node_3',
    text: '(I remember that the start of the tutorial is the most important part. But first, I should probably introduce myself.)',
    speaker: 'Mayra',
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
    text: '(Alright, now how to start…)',
    speaker: 'Mayra',
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
    text: '(I know how to start now. I feel ready.)',
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

export const scenario5Dialogue: SceneNode[] = [ // Dialogue data for scenario 5 - Work organization
  {
    id: 'start',
    text: 'Infront of Mayra lies a silent classroom filled with students. Most of them are looking down at their tablets or exercise sheets, some look directly at her with an expectant gaze.',
    speaker: 'Narrator',
    background: 'studyroom',
    nextId: 'intro_0',
  },
  {
    id: 'intro_0',
    text: '(Alright, so far so good. The next step is exercise one. I should let them work on it in some way. Hmmm, should I maybe split them into groups? Or is it more effective if everyone is on their own?)',
    speaker: 'Mayra',
    characterLeft: 'mayra',
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
    characterLeft: 'mayra',
    nextId: 'work_0',
  },
  // Option 1 of Choice 0 start
  {
    id: 'choice_0_1',
    text: 'Okay everyone! Next, please work on exercise one together in groups. Try to group together with the people next to you so you build groups of four. Five or three people are also fine. We will discuss your solutions afterwards.',
    speaker: 'Mayra',
    characterLeft: 'mayra',
    nextId: 'work_0',
  },
  // Option 1 of Choice 0 start
  {
    id: 'choice_0_2',
    text: 'Okay everyone! Next, please pair up to work on exercise one. You can just turn to the person sitting next to you. If someone is left, one group of three is also fine. We will discuss your solutions afterwards.',
    speaker: 'Mayra',
    characterLeft: 'mayra',
    nextId: 'work_0',
  },
  // Work Scenario start
  {
    id: 'work_0',
    text: '(Okay, looks like everyone is starting to work. At least they are looking at the exercise sheet and some already starting writing.)',
    speaker: 'Mayra',
    characterLeft: 'mayra',
    nextId: 'work_1',
  },
  {
    id: 'work_1',
    text: '(Some students look unsure about what they are doing… Or maybe I am imagining it? I should remind them that they can ask me questions or be there if someone is lost.)',
    speaker: 'Mayra',
    characterLeft: 'mayra',
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
    characterLeft: 'mayra',
    nextId: 'front_0',
  },
  {
    id: 'front_0',
    text: 'Mayra sits in a rather quiet room for a while. A slight murmur goes through the room, while most students keep their eyes averted to their paper. Then a girl raises her hand. Mayra helps her and a few more students with their questions until the first students seem to have finished the task.',
    speaker: 'Narrator',
    characterLeft: 'mayra',
    nextId: 'ending_0',
  },
  // Option 1 of Choice 1 start
  {
    id: 'choice_1_1',
    text: 'Mayra starts walking around from table to table to see how the students are doing. She comes across a boy that does not seem to have written anything yet. He stares at the paper with a frown.',
    speaker: 'Narrator',
    characterLeft: 'mayra',
    nextId: 'walking_0',
  },
  {
    id: 'walking_0',
    text: 'Hey, are you managing okay? Do you need any help?',
    speaker: 'Mayra',
    characterLeft: 'mayra',
    characterRight: 'boyStudent',
    nextId: 'walking_1',
  },
  {
    id: 'walking_1',
    text: 'Uhmm…. I just don\’t really know how to start…',
    speaker: 'Student',
    characterLeft: 'mayra',
    characterRight: 'boyStudent',
    nextId: 'walking_2',
  },
  {
    id: 'walking_2',
    text: 'Ah okay. So, remember the exercise from last week? Similar to that, you start by doing…',
    speaker: 'Mayra',
    characterLeft: 'mayra',
    characterRight: 'boyStudent',
    nextId: 'walking_3',
  },
  {
    id: 'walking_3',
    text: 'Mayra starts explaining to the boy what to do. He still seems a bit confused at first, but after starting with the first step he slowly seems more engaged within the exercise. Mayra continues to walk around from table to table and answers a few other questions before returning to her desk in the front.',
    speaker: 'Narrator',
    characterLeft: 'mayra',
    characterRight: 'boyStudent',
    nextId: 'ending_0',
  },
  // Ending start
  {
    id: 'ending_0',
    text: 'We do not have much time left, so let\’s start discussing your solutions! Is there anyone that wants to present what they have done?',
    speaker: 'Mayra',
    characterLeft: 'mayra',
    nextId: 'ending_1',
  },
  {
    id: 'ending_1',
    text: 'The tutorial goes on for another 60 minutes quite uneventfully.',
    speaker: 'Narrator',
    characterLeft: 'mayra',
    nextId: 'ending_2',
  },
  {
    id: 'ending_2',
    text: 'I think that\’s it for today! Thank you all for coming and I will see you next week.',
    speaker: 'Mayra',
    characterLeft: 'mayra',
    nextId: 'ending_3',
  },
  {
    id: 'ending_3',
    text: '...',  
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

