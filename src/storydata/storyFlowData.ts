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
  coffeeToPrepDialogue,
  prepToCoffeeDialogue,
  connectingDialogue,
  endingDialogue,
  trueEndingDialogue,
  secretEndingDialogue,
} from './dialogueData';
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
        { targetChunkId: 'splitintro'}, 
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
        { targetChunkId: 'coffeeToPrep', condition: (choices) => choices['splitChoice'] === 'coffee'}, 
        { targetChunkId: 'end'},
      ],
    },

    coffeeToPrep: {
      id: 'coffeeToPrep',
      dialogueNodes: coffeeToPrepDialogue,
      transitions: [
        { targetChunkId: 'preparationDialogue' }, 
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
        { targetChunkId: 'prepToCoffee', condition: (choices) => choices['splitChoice'] === 'preparation'},
        { targetChunkId: 'end'},
      ],
    },

    prepToCoffee: {
      id: 'prepToCoffee',
      dialogueNodes: prepToCoffeeDialogue,
      transitions: [
        { targetChunkId: 'coffeeDialogue' }, 
      ],
    },
  }
}

// Simple story flow for now
export const gameFlow: StoryFlow = {
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
        { targetChunkId: 'scenario1' }, 
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
        { targetChunkId: 'coffeeToPrep', condition: (choices) => choices['splitChoice'] === 'coffee'}, 
        { targetChunkId: 'connectingDialogue'},
      ],
    },

    coffeeToPrep: {
      id: 'coffeeToPrep',
      dialogueNodes: coffeeToPrepDialogue,
      transitions: [
        { targetChunkId: 'preparationDialogue' }, 
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
        { targetChunkId: 'prepToCoffee', condition: (choices) => choices['splitChoice'] === 'preparation'},
        { targetChunkId: 'connectingDialogue'},
      ],
    },

    prepToCoffee: {
      id: 'prepToCoffee',
      dialogueNodes: prepToCoffeeDialogue,
      transitions: [
        { targetChunkId: 'coffeeDialogue' }, 
      ],
    },

    connectingDialogue: {
      id: 'connectingDialogue',
      dialogueNodes: connectingDialogue,
      transitions: [
        { targetChunkId: 'secretEnding', condition: (choices) => choices['thankPip'] === true && choices['helpPip'] === true},
        { targetChunkId: 'trueEnding', condition: (choices) => choices['splitChoice'] === 'preparation' && choices['workOrganization'] === 'pairs' &&  choices['supportStyle'] === 'walk'},
        { targetChunkId: 'Ending' }, 
      ],
    },

    Ending: {
      id: 'Ending',
      dialogueNodes: endingDialogue,
      transitions: [
        { targetChunkId: 'end' },
      ],
    },

    trueEnding: {
      id: 'trueEnding',
      dialogueNodes: trueEndingDialogue,
      transitions: [
        { targetChunkId: 'end' },
      ],
    },

    secretEnding: {
      id: 'secretEnding',
      dialogueNodes: secretEndingDialogue,
      transitions: [
        { targetChunkId: 'end' },
      ],
    },

    end: {
      id: 'end',
      startingNodeId: 'endnote', // 'start' override
      dialogueNodes: endDialogue, 
    },

    secretEnd: {
      id: 'secretEnd',
      startingNodeId: 'end',
      dialogueNodes: secretEnd,
    }

  },
};
