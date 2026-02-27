import { DialogueNode } from "../dialogue/dialogueData";

export const introText: DialogueNode[] = [
  {
    id: 'start',
    text: 'Welcome to this first prototype, a game desgined for the onboarding of student tutors and doctorial candidates.',
    nextId: 'intro_0',
  },
  {
    id: 'intro_0',
    text: 'In this game you will follow Mayra, a new student tutor, as she navigates her days at the academy.',
    nextId: 'intro_1',
  },
  {
    id: 'intro_1',
    text: 'In the next scene, Mayra is currently in one of her tutorial sessions. Help her through the session and enjoy your journey!',
  }
];