/**
 * Dialogue option for branching choices
 */
export interface DialogueOption {
  text: string;
  nextId: string;
  choice?: Record<string, string | boolean | number>; // key-value pair to track player choices for story flow evaluation
}

/**
 * Single dialogue node with text, optional speaker, and optional branching choices or next dialogue id
 */
export interface DialogueNode {
  id: string;
  text: string;
  speaker?: string; // Optional speaker name, Narrator makes text italic and hides speaker name
  options?: DialogueOption[]; // If present, show choices (max 3)
  nextId?: string; // Define the next dialogue (undefined = end), only used for non-branching dialogue
  background?: string; // Optional background image for this dialogue node
}

// start and end dialogue for prototyping

export const startDialogue: DialogueNode[] = [
  {
    id: 'start',
    text: 'Welcome to this first prototype, a game desgined for the onboarding of student tutors and doctorial candidates.',
    speaker: 'Narrator',
    nextId: 'intro_0',
    background: 'classroom',
  },
  {
    id: 'intro_0',
    text: 'In this game you will follow Mayra, a new student tutor, as she navigates her days at the academy.',
    speaker: 'Narrator',
    nextId: 'intro_1',
    background: 'classroom',
  },
  {
    id: 'intro_1',
    text: 'In the next scene, Mayra is currently in one of her tutorial sessions. Help her through the session and enjoy your journey!',
    speaker: 'Narrator',
  }
]

export const endDialogue: DialogueNode[] = [
  {
    id: 'end',
    text: 'Your journey has only just begun. Thanks for playing the Nexum prototype!',
    speaker: 'Narrator',
    background: 'SchoolBackground',
  }
]

export const secretEnd: DialogueNode[] = [
  {
    id: 'end',
    text: 'Congratulations! You have found the secret ending by making all the right choices! \\(^_^)/',
    speaker: 'Narrator',
    background: 'SchoolBackground',
  }
]


// ___________ Actual Dialogue Data ____________

export const scenario5Dialogue: DialogueNode[] = [ // Dialogue data for scenario 5 - Work organization
  {
    id: 'start',
    text: 'Infront of Mayra lies a silent classroom filled with students. Most of them are looking down at their tablets or exercise sheets, some look directly at her with an expectant gaze.',
    speaker: 'Narrator',
    nextId: 'intro_0',
  },
  {
    id: 'intro_0',
    text: '(Alright, so far so good. The next step is exercise one. I should let them work on it in some way. Hmmm, should I maybe split them into groups? Or is it more effective if everyone is on their own?)',
    speaker: 'Mayra',
    nextId: 'decision_0',
  },
  {
    id: 'decision_0',
    text: 'How should Mayra organize the work on the exercise?',
    options: [
      { text: 'Let them work on their own.', nextId: 'choice_0_0', choice: { workOrganization: 'individual' } },
      { text: 'Have them work in groups', nextId: 'choice_0_1', choice: { workOrganization: 'groups' } },
      { text: 'Have them work in pairs', nextId: 'choice_0_2', choice: { workOrganization: 'pairs' } },
    ],
  },
  // Option 0 of Choice 0 start
  {
    id: 'choice_0_0',
    text: 'Okay everyone! Next, please work on exercise one by yourself. We will discuss your solutions afterwards.',
    speaker: 'Mayra',
    nextId: 'work_0',
  },
  // Option 1 of Choice 0 start
  {
    id: 'choice_0_1',
    text: 'Okay everyone! Next, please work on exercise one together in groups. Try to group together with the people next to you so you build groups of four. Five or three people are also fine. We will discuss your solutions afterwards.',
    speaker: 'Mayra',
    nextId: 'work_0',
  },
  // Option 1 of Choice 0 start
  {
    id: 'choice_0_2',
    text: 'Okay everyone! Next, please pair up to work on exercise one. You can just turn to the person sitting next to you. If someone is left, one group of three is also fine. We will discuss your solutions afterwards.',
    speaker: 'Mayra',
    nextId: 'work_0',
  },
  // Work Scenario start
  {
    id: 'work_0',
    text: '(Okay, looks like everyone is starting to work. At least they are looking at the exercise sheet and some already starting writing.)',
    speaker: 'Mayra',
    nextId: 'work_1',
  },
  {
    id: 'work_1',
    text: '(Some students look unsure about what they are doing… Or maybe I am imagining it? I should remind them that they can ask me questions or be there if someone is lost.)',
    speaker: 'Mayra',
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
    nextId: 'front_0',
  },
  {
    id: 'front_0',
    text: 'Mayra sits in a rather quiet room for a while. A slight murmur goes through the room, while most students keep their eyes averted to their paper. Then a girl raises her hand. Mayra helps her and a few more students with their questions until the first students seem to have finished the task.',
    speaker: 'Narrator',
    nextId: 'ending_0',
  },
  // Option 1 of Choice 1 start
  {
    id: 'choice_1_1',
    text: 'Mayra starts walking around from table to table to see how the students are doing. She comes across a boy that does not seem to have written anything yet. He stares at the paper with a frown.',
    speaker: 'Narrator',
    nextId: 'walking_0',
  },
  {
    id: 'walking_0',
    text: 'Hey, are you managing okay? Do you need any help?',
    speaker: 'Mayra',
    nextId: 'walking_1',
  },
  {
    id: 'walking_1',
    text: 'Uhmm…. I just don’t really know how to start…',
    speaker: 'Student',
    nextId: 'walking_2',
  },
  {
    id: 'walking_2',
    text: 'Ah okay. So, remember the exercise from last week? Similar to that, you start by doing…',
    speaker: 'Mayra',
    nextId: 'walking_3',
  },
  {
    id: 'walking_3',
    text: 'Mayra starts explaining to the boy what to do. He still seems a bit confused at first, but after starting with the first step he slowly seems more engaged within the exercise. Mayra continues to walk around from table to table and answers a few other questions before returning to her desk in the front.',
    speaker: 'Narrator',
    nextId: 'ending_0',
  },
  // Ending start
  {
    id: 'ending_0',
    text: 'We do not have much time left, so let\’s start discussing your solutions! Is there anyone that wants to present what they have done?',
    speaker: 'Mayra',
    nextId: 'ending_1',
  },
  {
    id: 'ending_1',
    text: 'The tutorial goes on for another 60 minutes quite uneventfully.',
    speaker: 'Narrator',
    nextId: 'ending_2',
  },
  {
    id: 'ending_2',
    text: 'I think that\’s it for today! Thank you all for coming and I will see you next week.',
    speaker: 'Mayra',
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
export const tutorAcademyDialogues: DialogueNode[] = [
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
