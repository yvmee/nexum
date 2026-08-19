// Backgrounds
import lecturehall from "../../assets/backgrounds/BackgroundLecturehall.png";
import hallway from "../../assets/backgrounds/BackgroundHallway.png";
import office from "../../assets/backgrounds/BackgroundOffice.png";
import studyroom from "../../assets/backgrounds/BackgroundStudyroom.png";
import cafe from "../../assets/backgrounds/BackgroundCafe.png";

// Character portraits
import pip from "../../assets/characters/Sphere.png";
import mayra from "../../assets/characters/StudentPortrait.png";
import phd from "../../assets/characters/PhdPortrait.png";
import mayraShocked from "../../assets/characters/StudentShocked.png";
import mayraStressed from "../../assets/characters/StudentStressed.png";
import mayraThinking from "../../assets/characters/StudentThinking.png";
import mayraWorried from "../../assets/characters/StudentWorried.png";
import noah from "../../assets/characters/MaleStudent.png";
import noahThinking from "../../assets/characters/MaleStudentThinking.png";
import noahSurprised from "../../assets/characters/MaleStudentSurprised.png";
import noahWorried from "../../assets/characters/MaleStudentWorried.png";
import boyStudent from "../../assets/characters/GuyPortrait.png";
import boyStudentWorried from "../../assets/characters/GuyWorriedPortrait.png";
import professor from "../../assets/characters/ProfessorPortrait.png";

// Props
import clockDots from "../../assets/props/ClockDots.png";
import paper from "../../assets/props/Paper.png";
import tableTop from "../../assets/props/TableTop.png";


export const backgrounds = { // Add background assets here
  lecturehall,
  hallway,
  office,
  studyroom,
  cafe,
};

export const characters = { // Add character assets here
  pip,
  mayra,
  phd,
  mayraShocked,
  mayraStressed,
  mayraThinking,
  mayraWorried,
  noah,
  noahThinking,
  noahSurprised,
  noahWorried,
  boyStudent,
  boyStudentWorried,
  professor,
};

export const props = { // Add prop assets here
  clockDots,
  paper,
  tableTop,
};

// Reduce size of pip's character portrait
export const characterRenderClasses: Partial<Record<keyof typeof characters, string>> = {
  pip: 'scale-[0.55] origin-bottom',
};