import { TutorialChoice } from './ChoicesManager';

/**
 * Dialogue option for branching choices
 */
export interface DialogueOption {
  text: string;
  nextId: string;
  choiceKey?: TutorialChoice;
}

/**
 * Single dialogue node
 */
export interface DialogueNode {
  id: string;
  text: string;
  options?: DialogueOption[]; // If present, show choices (max 3)
  nextId?: string; // If no options, this is the next dialogue (undefined = end)
}

/**
 * Dialogue data for the game - now supports branching
 */
export const gameDialogues: DialogueNode[] = [
  {
    id: 'start',
    text: 'Welcome to Nexum, brave adventurer!',
    nextId: 'intro',
  },
  {
    id: 'intro',
    text: 'You stand at a crossroads. Three paths stretch before you, each shrouded in mystery.',
    options: [
      { text: 'Take the path to the left, into the forest.', nextId: 'forest' },
      { text: 'Walk straight ahead, toward the mountains.', nextId: 'mountains' },
      { text: 'Turn right, following the river.', nextId: 'river' },
    ],
  },
  {
    id: 'forest',
    text: 'The forest is dark and ancient. You hear whispers among the trees...',
    nextId: 'forest_choice',
  },
  {
    id: 'forest_choice',
    text: 'A strange creature appears before you. What do you do?',
    options: [
      { text: 'Approach it cautiously.', nextId: 'ending' },
      { text: 'Run away!', nextId: 'ending' },
    ],
  },
  {
    id: 'mountains',
    text: 'The mountain air is cold and crisp. You begin your ascent...',
    nextId: 'ending',
  },
  {
    id: 'river',
    text: 'The river sparkles in the sunlight. You follow its winding path...',
    nextId: 'ending',
  },
  {
    id: 'ending',
    text: 'Your journey has only just begun. Thanks for playing the Nexum prototype!',
    // No nextId means this is the end
  },
];

export const tutorAcademyDialogues: DialogueNode[] = [
  {
    id: 'start',
    text: 'This is a prototype for a self reflection system based on a scenario from the Tutor Academy by ProLehre. Enjoy your journey!',
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
      { text: 'She should ask the class why they are so quiet and if they are finding the material difficult to understand.', nextId: 'ask', choiceKey: TutorialChoice.ASK },
      { text: 'She should decide to include more group activities and games that require interaction.', nextId: 'groupwork', choiceKey: TutorialChoice.GROUPWORK },
      { text: 'She should opt to modify her teaching style by speaking less and prompting the students with open-ended questions to think critically.', nextId: 'teachingstyle', choiceKey: TutorialChoice.TEACHINGSTYLE },
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
    // No nextId means this is the end
  },
];
