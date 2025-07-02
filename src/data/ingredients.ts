export interface Ingredient {
  id: string;
  name: string;
  category: 'Spirits' | 'Liqueurs' | 'Wines & Vermouths' | 'Beers & Ciders' | 'Mixers' | 'Produce' | 'Pantry';
  subCategory: string;
  aliases: string[];
  description: string;
  isCustom: boolean;
}

export const ingredientDatabase: Ingredient[] = [
  // Spirits
  {
    id: "spirit_001",
    name: "Bourbon Whiskey",
    category: "Spirits",
    subCategory: "Whiskey",
    aliases: ["Bourbon", "Bourbon Whisky"],
    description: "An American whiskey, primarily made from corn, with a typically sweet and full-bodied flavor profile featuring notes of vanilla, oak, and caramel.",
    isCustom: false
  },
  {
    id: "spirit_002",
    name: "Rye Whiskey",
    category: "Spirits",
    subCategory: "Whiskey",
    aliases: ["Rye", "Rye Whisky"],
    description: "An American whiskey made from at least 51% rye grain, known for its spicier, drier, and more assertive character compared to bourbon.",
    isCustom: false
  },
  {
    id: "spirit_003",
    name: "London Dry Gin",
    category: "Spirits",
    subCategory: "Gin",
    aliases: ["Gin", "London Gin"],
    description: "A style of gin characterized by a prominent juniper flavor. It is the base for many classic cocktails like the Martini and Gin and Tonic.",
    isCustom: false
  },
  {
    id: "spirit_004",
    name: "Vodka",
    category: "Spirits",
    subCategory: "Vodka",
    aliases: ["Premium Vodka"],
    description: "A neutral spirit distilled from grains or potatoes, prized for its clean, pure taste that blends well with other ingredients.",
    isCustom: false
  },
  {
    id: "spirit_005",
    name: "White Rum",
    category: "Spirits",
    subCategory: "Rum",
    aliases: ["Light Rum", "Silver Rum"],
    description: "A light, clean rum perfect for tropical cocktails like Daiquiris and Mojitos.",
    isCustom: false
  },
  {
    id: "spirit_006",
    name: "Dark Rum",
    category: "Spirits",
    subCategory: "Rum",
    aliases: ["Aged Rum", "Gold Rum"],
    description: "A rich, aged rum with deeper flavors and color, excellent for sipping or complex cocktails.",
    isCustom: false
  },
  {
    id: "spirit_007",
    name: "Blanco Tequila",
    category: "Spirits",
    subCategory: "Tequila",
    aliases: ["Silver Tequila", "White Tequila"],
    description: "A clear tequila that showcases the pure agave flavor, essential for Margaritas and Palomas.",
    isCustom: false
  },
  {
    id: "spirit_008",
    name: "Reposado Tequila",
    category: "Spirits",
    subCategory: "Tequila",
    aliases: ["Aged Tequila"],
    description: "Tequila aged in oak barrels for 2-12 months, offering a balance of agave and wood flavors.",
    isCustom: false
  },
  {
    id: "spirit_009",
    name: "Cognac",
    category: "Spirits",
    subCategory: "Brandy",
    aliases: ["French Brandy"],
    description: "A premium French brandy distilled from grapes, aged in oak casks, with complex fruit and spice notes.",
    isCustom: false
  },
  {
    id: "spirit_010",
    name: "Mezcal",
    category: "Spirits",
    subCategory: "Agave",
    aliases: ["Artisanal Mezcal"],
    description: "A traditional Mexican spirit made from agave, known for its smoky, earthy character.",
    isCustom: false
  },

  // Liqueurs
  {
    id: "liqueur_001",
    name: "Orange Liqueur",
    category: "Liqueurs",
    subCategory: "Fruit Liqueur",
    aliases: ["Triple Sec", "Cointreau", "Grand Marnier", "Curaçao"],
    description: "A sweet, orange-flavored liqueur essential for Margaritas, Cosmopolitans, and Sidecars. Varieties range from dry (sec) to sweet and brandy-based.",
    isCustom: false
  },
  {
    id: "liqueur_002",
    name: "Amaretto",
    category: "Liqueurs",
    subCategory: "Nut Liqueur",
    aliases: ["Almond Liqueur"],
    description: "An Italian liqueur with a sweet almond flavor, perfect for adding nutty richness to cocktails.",
    isCustom: false
  },
  {
    id: "liqueur_003",
    name: "Coffee Liqueur",
    category: "Liqueurs",
    subCategory: "Coffee Liqueur",
    aliases: ["Kahlúa", "Tia Maria"],
    description: "A sweet, coffee-flavored liqueur essential for espresso martinis and white Russians.",
    isCustom: false
  },
  {
    id: "liqueur_004",
    name: "Irish Cream",
    category: "Liqueurs",
    subCategory: "Cream Liqueur",
    aliases: ["Bailey's", "Cream Liqueur"],
    description: "A smooth blend of Irish whiskey, cream, and chocolate, perfect for dessert cocktails.",
    isCustom: false
  },
  {
    id: "liqueur_005",
    name: "Campari",
    category: "Liqueurs",
    subCategory: "Bitter Liqueur",
    aliases: ["Italian Bitter"],
    description: "A bright red Italian bitter liqueur with herbal and citrus notes, essential for Negronis and Americanos.",
    isCustom: false
  },
  {
    id: "liqueur_006",
    name: "Aperol",
    category: "Liqueurs",
    subCategory: "Bitter Liqueur",
    aliases: ["Italian Aperitif"],
    description: "A lighter, sweeter Italian bitter liqueur with orange and herbal notes, perfect for spritzes.",
    isCustom: false
  },
  {
    id: "liqueur_007",
    name: "Chartreuse",
    category: "Liqueurs",
    subCategory: "Herbal Liqueur",
    aliases: ["Green Chartreuse", "Yellow Chartreuse"],
    description: "A complex French herbal liqueur made by Carthusian monks with 130 herbs and spices.",
    isCustom: false
  },
  {
    id: "liqueur_008",
    name: "Maraschino Liqueur",
    category: "Liqueurs",
    subCategory: "Fruit Liqueur",
    aliases: ["Luxardo Maraschino"],
    description: "A clear cherry liqueur with a distinctive almond-like flavor, essential for classic cocktails.",
    isCustom: false
  },

  // Wines & Vermouths
  {
    id: "wine_001",
    name: "Sweet Vermouth",
    category: "Wines & Vermouths",
    subCategory: "Fortified Wine",
    aliases: ["Red Vermouth", "Italian Vermouth"],
    description: "A fortified and aromatized wine, sweetened and red in color. A key component of the Negroni, Manhattan, and Americano.",
    isCustom: false
  },
  {
    id: "wine_002",
    name: "Dry Vermouth",
    category: "Wines & Vermouths",
    subCategory: "Fortified Wine",
    aliases: ["White Vermouth", "French Vermouth"],
    description: "A dry, herbal fortified wine essential for martinis and other classic cocktails.",
    isCustom: false
  },
  {
    id: "wine_003",
    name: "Champagne",
    category: "Wines & Vermouths",
    subCategory: "Sparkling Wine",
    aliases: ["Sparkling Wine", "Prosecco", "Cava"],
    description: "Effervescent wine perfect for celebrations and adding sparkle to cocktails like French 75 and Mimosas.",
    isCustom: false
  },
  {
    id: "wine_004",
    name: "Sherry",
    category: "Wines & Vermouths",
    subCategory: "Fortified Wine",
    aliases: ["Fino Sherry", "Amontillado"],
    description: "A Spanish fortified wine ranging from dry to sweet, excellent in cocktails and cooking.",
    isCustom: false
  },

  // Mixers
  {
    id: "mixer_001",
    name: "Club Soda",
    category: "Mixers",
    subCategory: "Carbonated",
    aliases: ["Soda Water", "Sparkling Water"],
    description: "Carbonated water with added minerals, used to add effervescence and lengthen drinks like the Tom Collins or Gin Rickey.",
    isCustom: false
  },
  {
    id: "mixer_002",
    name: "Tonic Water",
    category: "Mixers",
    subCategory: "Carbonated",
    aliases: ["Quinine Water"],
    description: "A carbonated soft drink with quinine, giving it a distinctive bitter taste. Essential for gin and tonics.",
    isCustom: false
  },
  {
    id: "mixer_003",
    name: "Ginger Beer",
    category: "Mixers",
    subCategory: "Carbonated",
    aliases: ["Spicy Ginger Soda"],
    description: "A spicy, carbonated beverage perfect for Moscow Mules and Dark 'n' Stormy cocktails.",
    isCustom: false
  },
  {
    id: "mixer_004",
    name: "Cranberry Juice",
    category: "Mixers",
    subCategory: "Fruit Juice",
    aliases: ["Cran Juice"],
    description: "Tart red juice essential for cosmopolitans and cape codders.",
    isCustom: false
  },
  {
    id: "mixer_005",
    name: "Pineapple Juice",
    category: "Mixers",
    subCategory: "Fruit Juice",
    aliases: ["Tropical Juice"],
    description: "Sweet tropical juice perfect for piña coladas and other tiki cocktails.",
    isCustom: false
  },
  {
    id: "mixer_006",
    name: "Orange Juice",
    category: "Mixers",
    subCategory: "Fruit Juice",
    aliases: ["OJ", "Fresh Orange"],
    description: "Fresh citrus juice essential for screwdrivers, mimosas, and many brunch cocktails.",
    isCustom: false
  },
  {
    id: "mixer_007",
    name: "Tomato Juice",
    category: "Mixers",
    subCategory: "Vegetable Juice",
    aliases: ["Bloody Mary Mix"],
    description: "Savory juice base for bloody marys and other savory cocktails.",
    isCustom: false
  },

  // Produce
  {
    id: "produce_001",
    name: "Lime",
    category: "Produce",
    subCategory: "Citrus",
    aliases: ["Limes", "Lime Juice", "Fresh Lime"],
    description: "Provides essential tartness and bright acidity for countless classic cocktails, including the Daiquiri, Gimlet, and Margarita.",
    isCustom: false
  },
  {
    id: "produce_002",
    name: "Lemon",
    category: "Produce",
    subCategory: "Citrus",
    aliases: ["Lemons", "Lemon Juice", "Fresh Lemon"],
    description: "A cornerstone of sour cocktails, providing bright acidity and a sharp citrus flavor. Essential for the Whiskey Sour, Tom Collins, and French 75.",
    isCustom: false
  },
  {
    id: "produce_003",
    name: "Orange",
    category: "Produce",
    subCategory: "Citrus",
    aliases: ["Oranges", "Orange Peel", "Orange Twist"],
    description: "Used for both juice and aromatic peel garnishes in countless cocktails.",
    isCustom: false
  },
  {
    id: "produce_004",
    name: "Mint",
    category: "Produce",
    subCategory: "Herbs",
    aliases: ["Fresh Mint", "Spearmint"],
    description: "Aromatic herb essential for mojitos, mint juleps, and many refreshing cocktails.",
    isCustom: false
  },
  {
    id: "produce_005",
    name: "Basil",
    category: "Produce",
    subCategory: "Herbs",
    aliases: ["Fresh Basil"],
    description: "Aromatic herb that adds a fresh, peppery note to modern cocktails.",
    isCustom: false
  },

  // Pantry
  {
    id: "pantry_001",
    name: "Simple Syrup",
    category: "Pantry",
    subCategory: "Syrups",
    aliases: ["Sugar Syrup", "1:1 Syrup"],
    description: "A basic sweetener made from equal parts sugar and water, dissolved completely. It is fundamental to balancing the sweet and sour elements of many cocktails.",
    isCustom: false
  },
  {
    id: "pantry_002",
    name: "Grenadine",
    category: "Pantry",
    subCategory: "Syrups",
    aliases: ["Pomegranate Syrup"],
    description: "A sweet, red syrup traditionally made from pomegranates, essential for tequila sunrises and shirley temples.",
    isCustom: false
  },
  {
    id: "pantry_003",
    name: "Honey Syrup",
    category: "Pantry",
    subCategory: "Syrups",
    aliases: ["Honey", "Bee's Knees Syrup"],
    description: "Honey dissolved in water, creating a rich sweetener perfect for bee's knees and other prohibition-era cocktails.",
    isCustom: false
  },
  {
    id: "pantry_004",
    name: "Agave Syrup",
    category: "Pantry",
    subCategory: "Syrups",
    aliases: ["Agave Nectar"],
    description: "A natural sweetener derived from agave plants, perfect for tequila and mezcal cocktails.",
    isCustom: false
  },
  {
    id: "pantry_005",
    name: "Aromatic Bitters",
    category: "Pantry",
    subCategory: "Bitters",
    aliases: ["Angostura Bitters", "Cocktail Bitters"],
    description: "A concentrated herbal alcoholic preparation used in small dashes to flavor cocktails like the Old Fashioned and Manhattan.",
    isCustom: false
  },
  {
    id: "pantry_006",
    name: "Orange Bitters",
    category: "Pantry",
    subCategory: "Bitters",
    aliases: ["Citrus Bitters"],
    description: "Bitters with a bright orange flavor, perfect for adding citrus complexity to cocktails.",
    isCustom: false
  },
  {
    id: "pantry_007",
    name: "Peychaud's Bitters",
    category: "Pantry",
    subCategory: "Bitters",
    aliases: ["New Orleans Bitters"],
    description: "A distinctive bitter with cherry and anise notes, essential for the Sazerac cocktail.",
    isCustom: false
  },
  {
    id: "pantry_008",
    name: "Salt",
    category: "Pantry",
    subCategory: "Seasonings",
    aliases: ["Sea Salt", "Kosher Salt"],
    description: "Used for rimming glasses, particularly for margaritas, and adding savory notes to cocktails.",
    isCustom: false
  },
  {
    id: "pantry_009",
    name: "Black Pepper",
    category: "Pantry",
    subCategory: "Seasonings",
    aliases: ["Fresh Cracked Pepper"],
    description: "Adds a spicy, aromatic kick to savory cocktails and bloody marys.",
    isCustom: false
  },
  {
    id: "pantry_010",
    name: "Egg White",
    category: "Pantry",
    subCategory: "Proteins",
    aliases: ["Fresh Egg White", "Pasteurized Egg White"],
    description: "Creates a silky foam and smooth texture in sour cocktails like whiskey sours and ramos gin fizzes.",
    isCustom: false
  }
];

// Helper functions for ingredient matching and substitution
export const getIngredientsByCategory = (category: string) => {
  return ingredientDatabase.filter(ing => ing.category === category);
};

export const getIngredientsBySubCategory = (subCategory: string) => {
  return ingredientDatabase.filter(ing => ing.subCategory === subCategory);
};

export const findIngredientMatches = (searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  return ingredientDatabase.filter(ing => 
    ing.name.toLowerCase().includes(term) ||
    ing.aliases.some(alias => alias.toLowerCase().includes(term))
  );
};

export const getSubstitutes = (ingredientId: string) => {
  const ingredient = ingredientDatabase.find(ing => ing.id === ingredientId);
  if (!ingredient) return [];
  
  return ingredientDatabase.filter(ing => 
    ing.subCategory === ingredient.subCategory && ing.id !== ingredientId
  );
};