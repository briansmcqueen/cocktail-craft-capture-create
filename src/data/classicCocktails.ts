
export type Cocktail = {
  id: string;
  name: string;
  image: string;
  ingredients: string[];
  steps: string;
  notes?: string;
  origin?: string;
  tags?: string[];
};

export const classicCocktails: Cocktail[] = [
  {
    id: "1",
    name: "Manhattan",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz rye whiskey",
      "1 oz sweet vermouth",
      "2 dashes Angostura bitters",
      "Brandied cherry for garnish"
    ],
    steps: "Stir rye, sweet vermouth, and bitters with ice until well-chilled. Strain into a chilled glass. Garnish with a brandied cherry (or lemon twist).",
    notes: "A pre-Prohibition classic (circa 1880s) with unknown exact origin. Often made with rye whiskey (or bourbon) and sweet vermouth.",
    origin: "USA",
    tags: ["bitter", "boozy", "classic"]
  },
  {
    id: "2",
    name: "Negroni",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 oz gin",
      "1 oz Campari",
      "1 oz sweet vermouth",
      "Orange peel for garnish"
    ],
    steps: "Stir gin, Campari, and sweet vermouth with ice until chilled. Strain into a rocks glass over ice. Garnish with an orange peel.",
    notes: "Invented by Count Camillo Negroni in early 20th-century Florence, Italy. It's a 1:1:1 formula and very popular as a signature bitter, spirit-forward aperitif.",
    origin: "Italy",
    tags: ["bitter", "herbal", "aperitif"]
  },
  {
    id: "3",
    name: "Martini",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2.5 oz gin",
      "0.5 oz dry vermouth",
      "1 dash orange bitters",
      "Lemon twist for garnish"
    ],
    steps: "Stir gin, vermouth, and bitters with ice until very cold. Strain into a chilled cocktail glass. Garnish with a lemon twist.",
    notes: "A classic (circa early 1900s) gin cocktail. Early versions used sweet vermouth, but the dry Martini emerged by the turn of the 20th century. Variations include Vodka Martini (gin → vodka) and Perfect Martini (equal sweet/dry vermouth).",
    origin: "USA",
    tags: ["dry", "boozy", "classic"]
  },
  {
    id: "4",
    name: "Mojito",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "3 mint leaves",
      "0.5 oz simple syrup",
      "2 oz white rum",
      "0.75 oz lime juice",
      "Club soda to top",
      "Mint sprig and lime wheel for garnish"
    ],
    steps: "Muddle mint with simple syrup. Add rum, lime juice and ice. Shake briefly and strain into a glass. Top with club soda. Garnish with a mint sprig and lime wheel.",
    notes: "Cuban classic (based on 16th-century 'Draque' cocktail) combining rum, lime, mint and sugar. Famed as Hemingway's favorite, it's a crisp, summer-style highball enjoyed worldwide.",
    origin: "Cuba",
    tags: ["refreshing", "minty", "citrusy"]
  },
  {
    id: "5",
    name: "Cosmopolitan",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz citron vodka",
      "0.75 oz Cointreau",
      "0.75 oz lime juice",
      "0.5 oz cranberry juice",
      "Lime wedge for garnish"
    ],
    steps: "Shake all ingredients with ice until well chilled. Strain into a chilled cocktail glass. Garnish with a lime wedge.",
    notes: "A late-20th-century classic, hugely popularized in the 1990s (e.g. on Sex and the City). Origin attributed to Cheryl Cook (1985) blending vodka with cranberry and lime. Its tart-fruity profile is emblematic of the era's flavored-vodka drinks.",
    origin: "USA",
    tags: ["fruity", "tart", "pink"]
  }
];
