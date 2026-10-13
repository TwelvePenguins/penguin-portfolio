import { createContext } from "react";

// Shares the progress ref so frame updates do not trigger React renders.
export const AnimationProgressContext = createContext(null);
