export type Photo = {
  id: number;
  path: string;
  title: string;
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

export type FloaterProps = {
  coords?: { x: number; y: number } | null;
  dismount?: () => void;
  characterMap?: Record<number, string>;
};
