import { StoryFlow } from './storyFlow';
import { 
  endDialogue, 
  introDialogue, 
  pipIntroDialogue, 
  scenario1Dialogue, 
  scenario5Dialogue, 
  scenario5outro, 
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
  badEndingDialogue,
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
        { targetChunkId: 'outro'}, 
      ],
    },

    pipIntro: {
      id: 'pipIntro',
      dialogueNodes: pipIntroDialogue,
      transitions: [
        { targetChunkId: 'splitintro' }, 
      ],
    },

    scenario1: {
      id: 'scenario1',
      dialogueNodes: scenario1Dialogue,
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

    outro: {
      id: 'outro',
      dialogueNodes: endDialogue,
    }
  }
}

// Full game story flow
export const gameFlow: StoryFlow = {
  id: 'three_scenarios',
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
        { targetChunkId: 'secretEnding', condition: (choices) => choices['thankPip'] === true && choices['helpPip'] === true, pipMinScore: 80},
        { targetChunkId: 'trueEnding', condition: (choices) => {
          const choicesStr = choices.sortingGameChoices as string || '';
          const sortingchoices = choicesStr.split(',').map(Number);
          const goodIDs = [1, 3, 4, 7];
          const badIDs = [2, 8];
          // Check that sorting choices include at least 3 good and no bad choices
          const goodCount = sortingchoices.filter(id => goodIDs.includes(id)).length;
          const badCount = sortingchoices.filter(id => badIDs.includes(id)).length;
          const sortingGameSuccess = goodCount >= 4 && badCount === 0;
          return (sortingGameSuccess && choices['splitChoice'] === 'preparation' && (choices['workOrganization'] === 'pairs' || choices['workOrganization'] === 'group') &&  choices['supportStyle'] === 'walk')
        }, pipMinScore: 75},
        { targetChunkId: 'ending', condition: (choices) => {
          const choicesStr = choices.sortingGameChoices as string || '';
          const sortingchoices = choicesStr.split(',').map(Number);
          const goodIDs = [1, 3, 4, 7];
          const badIDs = [2, 8];
          // Check that sorting choices include at least 3 good and no bad choices
          const goodCount = sortingchoices.filter(id => goodIDs.includes(id)).length;
          const badCount = sortingchoices.filter(id => badIDs.includes(id)).length;
          const sortingGameSuccess = goodCount >= 2 && badCount === 0;
          return sortingGameSuccess 
        }, pipMinScore: 60},
        { targetChunkId: 'badEnding' }, 
      ],
    },

    ending: {
      id: 'ending',
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

    badEnding: {
      id: 'badEnding',
      dialogueNodes: badEndingDialogue,
      transitions: [
        { targetChunkId: 'end' },
      ],
    },

    end: {
      id: 'end',
      startingNodeId: 'endnote', // 'start' override
      dialogueNodes: endDialogue, 
    },

  },
};
