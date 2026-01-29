export enum TutorialChoice {
    ASK,
    GROUPWORK,
    TEACHINGSTYLE,
}


export type ChoiceData = {
    situation: string,
    choices: Record<TutorialChoice, string>,
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

// Selected choice storage relevant for the reflection process
export let selectedChoice: TutorialChoice | null = null;
export let currentData: ChoiceData = TutorialChoiceData;

export const setChoice = (choice: TutorialChoice) => {
    selectedChoice = choice;
};