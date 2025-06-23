// Data models
export type Photo = {
  id: number;
  path: string;
  title: string;
};

type Entry = {
  id: number;
  leaderboardId: number;
  name: string;
  score: number;
};

export type Leaderboard = {
  id: number;
  photoId: number;
  Entry: Entry[];
};

export type Game = {
  start: number;
  leaderboardId: number;
  status: {
    found: number[];
    notFound: number[];
  };
  characterMap: Record<number, string>;
};

// API/utility types
export type Guess = {
  status: {
    found: number[];
    notFound: number[];
  };
  score: number | null;
  token: string;
};

// Component prop types
export type FloaterProps = {
  location?: { x: number; y: number } | null;
  dismount: () => void;
  notFound: number[];
  passGuess: (name: string) => void;
  characterMap?: Record<number, string>;
};

export type FinishedProps = {
  score: number;
  photoId: number;
};