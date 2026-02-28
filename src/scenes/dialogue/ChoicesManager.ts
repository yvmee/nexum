/**
* Holds a situation description and a list of corresponding choices the player can make with an id and a description
*/
export type Choice = {
    situation: string,
    choices: Record<number, string> [],
}

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


export let currentChoiceScenario: Choice = ChoiceDataScenario5;

export let choiceIndeces: number[] = [];
export let selectedChoice: Choice | null = null;

export const setChoiceIndeces = (indeces: number[]) => {
    choiceIndeces = indeces;
}