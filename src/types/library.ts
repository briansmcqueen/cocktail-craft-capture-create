export type LibraryKey =
  | "featured"
  | "all"
  | "classics"
  | "favorites"
  | "mine"
  | "ingredients";

export const PATH_TO_LIBRARY: Record<string, LibraryKey> = {
  "/": "featured",
  "/recipes": "all",
  "/mybar": "ingredients",
  "/favorites": "favorites",
  "/recipes/my-drinks": "mine",
};

export const LIBRARY_TO_PATH: Record<LibraryKey, string> = {
  featured: "/",
  all: "/recipes",
  classics: "/recipes",
  ingredients: "/mybar",
  favorites: "/favorites",
  mine: "/recipes/my-drinks",
};

export function libraryFromPath(pathname: string): LibraryKey {
  return PATH_TO_LIBRARY[pathname] ?? "featured";
}