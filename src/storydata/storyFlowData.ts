import { StoryFlow } from './storyFlow';
import { 
  endDialogue, 
  introDialogue, 
  pipIntroDialogue, 
  scenario1Dialogue, 
  scenario5Dialogue, 
  scenario5outro,
  secretEnd, 
  startDialogue, 
  scenario1outro,
  splitintro,
  coffeeDialogue,
  preparationDialogue,
  scenarioSandwichDialogue,
  sandwichOutro,
} from './dialogueData';
import { reflectionDialogues } from './reflectionData';
import { 
  reflectionDialogue1, 
  reflectionDialogueSandwich,
  reflectionDialogue5,
} from './reflectionData';

// Debugging story flow

export const testFlow: StoryFlow = {
  id: 'test_flow',
  initialChunkId: 'intro',
  chunks: {
    intro: {
      id: 'intro',
      dialogueNodes: startDialogue,
      transitions: [
        { targetChunkId: 'scenario1' }, 
      ],
    },

    scenario1: {
      id: 'scenario1',
      dialogueNodes: scenario1Dialogue,
      reflectionNodes: reflectionDialogue1,
      reflectionSessionNumber: 1,
      transitions: [
        { targetChunkId: 'outro' }, 
      ],
    },

    outro: {
      id: 'outro',
      dialogueNodes: scenario1outro,
    },
  },
};

// Simple story flow for now
export const storyFlow: StoryFlow = {
  id: 'story_flow',
  initialChunkId: 'intro',

  chunks: {

    intro: {
      id: 'intro',
      dialogueNodes: startDialogue,
      transitions: [
        { targetChunkId: 'introMayra' }, 
      ],
    },

    introMayra: {
      id: 'introMayra',
      dialogueNodes: introDialogue,
      transitions: [
        { targetChunkId: 'introPip' }, 
      ],
    },

    introPip: {
      id: 'introPip',
      dialogueNodes: pipIntroDialogue,
      transitions: [
        { targetChunkId: 'work_organization' }, 
      ],
    },

    scenario1: {
      id: 'scenario1',
      dialogueNodes: scenario1Dialogue,
      reflectionNodes: reflectionDialogue1,
      reflectionSessionNumber: 1,
      transitions: [
        { targetChunkId: 'scenario1outro' }, 
      ],
    },

    scenario1outro: {
      id: 'scenario1outro',
      dialogueNodes: scenario1outro,
      transitions: [
        { targetChunkId: 'splitintro' }, 
      ],
    },

    splitintro: {
      id: 'splitintro',
      dialogueNodes: splitintro,
      transitions: [
        { targetChunkId: 'coffeeDialogue', condition: (choices) => choices['splitChoice'] === 'coffee' }, 
        { targetChunkId: 'preparationDialogue', condition: (choices) => choices['splitChoice'] === 'preparation' },
      ],
    },

    coffeeDialogue: {
      id: 'coffeeDialogue',
      dialogueNodes: coffeeDialogue,
      transitions: [
        { targetChunkId: 'sandwichDialogue' }, 
      ],
    },

    sandwichDialogue: {
      id: 'sandwichDialogue',
      dialogueNodes: scenarioSandwichDialogue,
      reflectionSessionNumber: 2,
      reflectionNodes: reflectionDialogueSandwich,
      transitions: [
        { targetChunkId: 'sandwichOutro' }, 
      ],
    },

    sandwichOutro: {
      id: 'sandwichOutro',
      dialogueNodes: sandwichOutro,
      transitions: [
        { targetChunkId: '' }, 
      ],
    },

    preparationDialogue: {
      id: 'preparationDialogue',
      dialogueNodes: preparationDialogue,
      transitions: [
        { targetChunkId: 'work_organization' }, 
      ],
    },

    work_organization: {
      id: 'work_organization',
      dialogueNodes: scenario5Dialogue,
      reflectionNodes: reflectionDialogue5,
      reflectionSessionNumber: 5,
      transitions: [
        { targetChunkId: 'scenario5Outro' },
      ],
    },

    scenario5Outro: {
      id: 'scenario5Outro',
      dialogueNodes: scenario5outro,
      transitions: [
        { targetChunkId: '' },
      ],
    },

    // work_organization: {
    //   id: 'work_organization',
    //   dialogueNodes: scenario5Dialogue,
    //   reflectionNodes: reflectionDialogue5,
    //   transitions: [
    //     { targetChunkId: 'secretEnd', condition: (choices) => choices['workOrganization'] === 'pairs' &&  choices['supportStyle'] === 'walk'}, 
    //     { targetChunkId: 'end' },
    //   ],
    // },

    end: {
      id: 'end',
      startingNodeId: 'endnote', // optional override (defaults to 'start')
      dialogueNodes: endDialogue, 
    },

    secretEnd: {
      id: 'secretEnd',
      startingNodeId: 'end',
      dialogueNodes: secretEnd,
    }

  },
};
