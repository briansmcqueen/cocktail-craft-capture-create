
export type Cocktail = {
  id: string;
  name: string;
  image: string;
  ingredients: string[];
  steps: string;
  notes?: string;
  origin?: string;
};

export const classicCocktails: Cocktail[] = [
  {
    id: "1",
    name: "Negroni",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 oz Gin",
      "1 oz Campari",
      "1 oz Sweet Vermouth",
      "Orange peel for garnish",
    ],
    steps:
      "Add all ingredients to a mixing glass with ice and stir until chilled. Strain into a rocks glass with a large cube. Garnish with an orange peel.",
    notes: "The Negroni dates back to early-20th-century Florence.",
    origin: "Italy",
  },
  {
    id: "2",
    name: "Whiskey Sour",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz Bourbon",
      "3/4 oz Lemon Juice",
      "1/2 oz Simple Syrup",
      "Egg white (optional)",
      "Angostura bitters (optional)",
    ],
    steps:
      "Shake all ingredients without ice for 10 seconds (if using egg white), then add ice and shake again until well chilled. Strain into a rocks glass. Garnish with a cherry or lemon peel.",
    notes: "A classic sour with rich history.",
    origin: "USA",
  },
  {
    id: "3",
    name: "Margarita",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz Tequila",
      "1 oz Lime Juice",
      "3/4 oz Cointreau",
      "Salt for rim",
      "Lime wedge for garnish",
    ],
    steps:
      "Rim glass with salt. Shake tequila, Cointreau, and lime juice with ice. Strain into a glass. Garnish with a lime wedge.",
    notes: "The quintessential Mexican classic.",
    origin: "Mexico",
  },
  // Add more classics as needed...
];
