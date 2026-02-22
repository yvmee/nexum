export enum TutorialChoice {
    ASK,
    GROUPWORK,
    TEACHINGSTYLE,
}

export type ChoiceData = {
    situation: string,
    choices: Record<TutorialChoice, string>,
}

export type Choice = {
    situation: string,
    choices: Record<number, string> [],
}

/* 
* Mapping text content to each choice
*/
export const TutorialChoiceData: ChoiceData = {
    situation: "Faced with a quiet and unresponsive classroom, Emma contemplates how to engage her students more effectively. She considers three approaches: directly asking students for feedback, incorporating more group activities, or adjusting her teaching style to be more interactive. Each choice could lead to different outcomes in student participation and classroom dynamics.",
    choices: {  
        [TutorialChoice.ASK]: "She should ask the class why they are so quiet and if they are finding the material difficult to understand.",
        [TutorialChoice.GROUPWORK]: "She should decide to include more group activities and games that require interaction.",
        [TutorialChoice.TEACHINGSTYLE]: "She should opt to modify her teaching style by speaking less and prompting the students with open-ended questions to think critically.",
    },
};

export const ChoiceDataScenario5: Choice = {
    situation: "Mayra decides on how to organize the work during the tutorial session.",
    choices: [
        {
            0: "Mayra let the students work on their own.",
            1: "Mayra let the students work together in larger groups.",
            2: "Mayra let the students work together in pairs.",
        },
        {
            0: "Mayra stayed at the front during the work time and students could ask questions anytime.",
            1: "Mayra walked around the room and offered help to every student individually.",
        }
    ],
};


// Selected choice storage relevant for the reflection process
export let currentChoice: Choice = ChoiceDataScenario5;
export let choiceIndeces: number[] = [];
export let selectedChoice: Choice | null = null;

export const setChoiceIndeces = (indeces: number[]) => {
    choiceIndeces = indeces;
}

