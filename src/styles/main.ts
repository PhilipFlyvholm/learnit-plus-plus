import base from "data-text:./main.css";
import learnitpp from "./lpp/styles";
import hacker from  "./hacker/styles";
import retro from "data-text:./retro/main.css";
export type theme = { css: string; darkModeState: DarkModeState };
export enum DarkModeState {
  ALWAYS, // Always dark mode (Adds .dark to html)
  NEVER, // Never dark mode (Removes .dark from html)
  OPTIONAL, // Dark mode is optional (Adds .dark to html if dark mode is enabled)
}
export const themes: { [key: string]: theme } = {
  "Features only": { css: "", darkModeState: DarkModeState.NEVER },
  "LearnIT++": { css: learnitpp, darkModeState: DarkModeState.OPTIONAL },
  "Hacker mode": { css: hacker, darkModeState: DarkModeState.ALWAYS },
  "Retro theme": { css: retro, darkModeState: DarkModeState.NEVER },
};

export const defaultTheme = "LearnIT++";

export const getTheme = (
  theme: string | null = null
): theme => {
  console.log("Getting theme", theme);
  
  if (!theme){ 
    theme = defaultTheme;
    console.log("Using default theme");
    
  }
  return {
    css: base + themes[theme].css,
    darkModeState: themes[theme].darkModeState,
  };
};
