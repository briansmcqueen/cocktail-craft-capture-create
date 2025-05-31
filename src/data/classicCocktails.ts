
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
  },
  {
    id: "6",
    name: "Bellini",
    image: "https://images.unsplash.com/photo-1561542796-0b5159c9b8c8?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz fresh peach puree",
      "4 oz Prosecco (sparkling wine)",
      "Peach slice for garnish"
    ],
    steps: "Add peach puree to a chilled flute. Top with Prosecco. Garnish with a peach slice.",
    notes: "Invented in 1948 at Harry's Bar in Venice, Italy.",
    origin: "Italy",
    tags: ["sparkling", "fruity", "sweet"]
  },
  {
    id: "7",
    name: "Black Russian",
    image: "https://images.unsplash.com/photo-1581984934376-7a6d37e48b04?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz vodka",
      "1 oz coffee liqueur (e.g. Kahlúa)"
    ],
    steps: "Build ingredients over ice in an old-fashioned glass. Stir gently.",
    notes: "First served in 1949 at the Hotel Metropole in Brussels, named for its vodka (Russian) and dark color (black).",
    origin: "Belgium",
    tags: ["strong", "coffee", "sweet"]
  },
  {
    id: "8",
    name: "Bloody Mary",
    image: "https://images.unsplash.com/photo-1514328525431-6e4c453964f1?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz vodka",
      "4 oz tomato juice",
      "0.5 oz fresh lemon juice",
      "0.5 oz Worcestershire sauce",
      "0.25 oz Tabasco sauce",
      "Celery salt & pepper",
      "Celery stalk and lemon wedge for garnish"
    ],
    steps: "Roll ingredients between shaker and glass to combine without over-blending. Strain into glass over ice. Garnish with celery stalk and lemon wedge.",
    notes: "A classic American cocktail (variants date to the 1920s) used to accompany brunch; origin stories vary (some say named after Mary Tudor or a bartender's nickname).",
    origin: "USA",
    tags: ["savory", "spicy", "brunch"]
  },
  {
    id: "9",
    name: "Caipirinha",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz cachaça (Brazilian rum)",
      "1 oz lime wedges",
      "0.5 oz sugar"
    ],
    steps: "Muddle lime and sugar in a glass. Add cachaça and ice, then stir.",
    notes: "Brazil's national cocktail; documented in early 20th century and popularized as a simple mix of sugar, lime, and cachaça (later became globally known late 20th c.).",
    origin: "Brazil",
    tags: ["refreshing", "citrus", "crushed ice"]
  },
  {
    id: "10",
    name: "Champagne Cocktail",
    image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "4 oz champagne or sparkling wine",
      "1 sugar cube",
      "Angostura bitters",
      "Lemon twist for garnish"
    ],
    steps: "Place sugar cube in flute and dash bitters onto it. Top with chilled champagne. Garnish with a lemon twist.",
    notes: "A 19th-century classic: simple mix of sparkling wine with a bitters-flavored sugar cube, commonly attributed to early cocktail manuals.",
    origin: "USA",
    tags: ["sparkling", "bubbly", "elegant"]
  },
  {
    id: "11",
    name: "Corpse Reviver #2",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 oz gin",
      "1 oz Cointreau",
      "1 oz Lillet Blanc",
      "1 oz fresh lemon juice",
      "0.1 oz absinthe (rinse)",
      "Orange peel for garnish"
    ],
    steps: "Rinse a coupe with absinthe. Add remaining ingredients with ice to shaker and shake well. Strain into the coupe and garnish with orange peel.",
    notes: "From the early 1900s as a supposed hangover cure ('corpse reviver'); #2 (with gin, Lillet, etc.) is the most famous version.",
    origin: "USA",
    tags: ["bright", "citrus", "herbal"]
  },
  {
    id: "12",
    name: "Cuba Libre",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz light rum",
      "4 oz cola",
      "0.5 oz lime juice",
      "Lime wedge for garnish"
    ],
    steps: "Pour rum and lime juice into a highball glass with ice. Top with cola and stir gently. Garnish with lime wedge.",
    notes: "Named after Cuba's independence (means 'Free Cuba'), it's essentially rum & coke with fresh lime. Became popular in early 20th-century Cuba and beyond.",
    origin: "Cuba",
    tags: ["refreshing", "cola", "rum"]
  },
  {
    id: "13",
    name: "French 75",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 oz gin (or cognac)",
      "0.5 oz fresh lemon juice",
      "0.5 oz simple syrup",
      "3 oz champagne",
      "Lemon twist for garnish"
    ],
    steps: "Shake gin, lemon, and syrup with ice. Strain into champagne flute and top with champagne. Garnish with a lemon twist.",
    notes: "Named after the powerful French 75mm field gun of WWI. A 1920s cocktail blending gin (or cognac) with bubbly, symbolizing a 'kick' like the artillery round.",
    origin: "France",
    tags: ["bubbly", "citrus", "elegant"]
  },
  {
    id: "14",
    name: "Garibaldi",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz Campari",
      "3 oz fresh orange juice",
      "Orange slice for garnish"
    ],
    steps: "Pour Campari into a glass with ice. Add orange juice and stir lightly. Garnish with an orange slice.",
    notes: "Italian aperitivo named for hero Giuseppe Garibaldi. A 19th-century mix of Campari and OJ, it's a bright and easy two-ingredient drink.",
    origin: "Italy",
    tags: ["bittersweet", "citrus", "simple"]
  },
  {
    id: "15",
    name: "Grasshopper",
    image: "https://images.unsplash.com/photo-1576629855588-57e1e6034991?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 oz green crème de menthe",
      "1 oz white crème de cacao",
      "2 oz heavy cream"
    ],
    steps: "Shake all ingredients with ice. Strain into a chilled cocktail glass.",
    notes: "Created around 1918 at a New Orleans hotel. This after-dinner cocktail with mint and chocolate liqueurs became popular in the U.S. mid-20th century.",
    origin: "USA",
    tags: ["minty", "creamy", "sweet"]
  },
  {
    id: "16",
    name: "Hemingway Special",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz white rum",
      "1 oz fresh grapefruit juice",
      "0.5 oz fresh lime juice",
      "0.5 oz Maraschino liqueur",
      "Lime wheel for garnish"
    ],
    steps: "Shake all ingredients with ice. Strain into a chilled glass. Garnish with a lime wheel.",
    notes: "Also called the 'Hemingway Daiquiri,' it was tailored for Ernest Hemingway in 1930s Cuba. It swaps sweet syrup for grapefruit and Maraschino to suit his palate.",
    origin: "Cuba",
    tags: ["tart", "grapefruit", "refreshing"]
  },
  {
    id: "17",
    name: "Irish Coffee",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz Irish whiskey",
      "5 oz hot strong coffee",
      "1 oz brown sugar",
      "1 oz lightly whipped cream"
    ],
    steps: "Dissolve sugar in hot coffee. Stir in whiskey. Float lightly whipped cream on top.",
    notes: "Created in 1940s Ireland (often credited to chef Joe Sheridan) as a warming drink for airplane passengers. An enduring hot classic.",
    origin: "Ireland",
    tags: ["warm", "sweet", "coffee"]
  },
  {
    id: "18",
    name: "Kir",
    image: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "4.5 oz dry white wine (e.g. Bourgogne Aligoté)",
      "0.5 oz Crème de cassis"
    ],
    steps: "Pour cassis into glass, then top with chilled white wine. Stir gently.",
    notes: "A classic French apéritif named after mayor Abbé Kir of Dijon. Mid-20th century it became popular; the royale (with champagne) is a variation.",
    origin: "France",
    tags: ["light", "sweet", "berry"]
  },
  {
    id: "19",
    name: "Lemon Drop Martini",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz vodka",
      "0.75 oz fresh lemon juice",
      "0.5 oz simple syrup",
      "Lemon twist for garnish"
    ],
    steps: "Shake all ingredients with ice. Strain into a sugar-rimmed martini glass. Garnish with a lemon twist.",
    notes: "An American 1970s invention (often attributed to bartenders in SF) inspired by the lemon drop candy. It became a popular sour-style martini.",
    origin: "USA",
    tags: ["citrus", "tart", "sweet"]
  },
  {
    id: "20",
    name: "Long Island Iced Tea",
    image: "https://images.unsplash.com/photo-1544385518-6df7b0dc7be5?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "0.5 oz vodka",
      "0.5 oz gin",
      "0.5 oz white rum",
      "0.5 oz tequila (silver)",
      "0.5 oz triple sec",
      "0.75 oz fresh lemon juice",
      "0.75 oz simple syrup",
      "2 oz cola (to top)",
      "Lemon wedge for garnish"
    ],
    steps: "Shake all spirits, citrus, and syrup with ice. Pour into glass and top with cola. Garnish with lemon wedge.",
    notes: "Developed in the 1970s (Long Island, NY) as a potent highball. Named for its iced-tea look despite containing no tea. Now an often-imitated party drink.",
    origin: "USA",
    tags: ["strong", "sweet", "cola"]
  },
  {
    id: "21",
    name: "Mai Tai",
    image: "https://images.unsplash.com/photo-1559068991-b41b8b0dafe0?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz Jamaican rum",
      "0.5 oz Martinique (or Puerto Rican) rum",
      "0.75 oz fresh lime juice",
      "0.5 oz orgeat syrup",
      "0.25 oz orange liqueur (e.g. Curacao)",
      "Mint and lime for garnish"
    ],
    steps: "Shake all ingredients with ice. Strain into glass over crushed ice. Float additional dark rum on top. Garnish with mint and lime.",
    notes: "Invented in 1944 by Trader Vic Bergeron in California (claiming Polynesian origins). Became a quintessential Tiki classic in the 1950s (competing with Don the Beachcomber's version).",
    origin: "USA",
    tags: ["tropical", "nutty", "citrus"]
  },
  {
    id: "22",
    name: "Margarita",
    image: "https://images.unsplash.com/photo-1581984934376-7a6d37e48b04?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz blanco tequila (100% agave)",
      "0.5 oz orange liqueur (Cointreau/Triple Sec)",
      "1 oz fresh lime juice",
      "0.5 oz agave syrup",
      "Lime for garnish"
    ],
    steps: "Shake all ingredients with ice. Strain into glass (salt rim optional). Garnish with lime.",
    notes: "A timeless tequila sour. One legend cites 1948 Acapulco (socialite inspiration); another links it to earlier 'Daisy' cocktails. Regardless, it rose to global fame by late 20th c.",
    origin: "Mexico",
    tags: ["citrusy", "refreshing", "sweet"]
  },
  {
    id: "23",
    name: "Mimosa",
    image: "https://images.unsplash.com/photo-1544385518-6df7b0dc7be5?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "3 oz champagne or sparkling wine",
      "3 oz fresh orange juice",
      "Orange twist for garnish (optional)"
    ],
    steps: "Pour orange juice into flute. Top with chilled champagne. Garnish with orange twist (optional).",
    notes: "First served in 1925 at the Ritz Paris. Simply equal parts champagne and orange juice, it became a popular Sunday/brunch cocktail in mid-20th century.",
    origin: "France",
    tags: ["brunch", "citrus", "light"]
  },
  {
    id: "24",
    name: "Mint Julep",
    image: "https://images.unsplash.com/photo-1609119309844-ad5e8f74e2e1?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz bourbon whiskey",
      "Fresh mint leaves",
      "0.5 oz simple syrup",
      "Mint sprig for garnish"
    ],
    steps: "Muddle mint with syrup in a cup. Fill cup with crushed ice and add bourbon. Stir until glass is frosty. Garnish with mint sprig.",
    notes: "A symbol of the Kentucky Derby (mint garnish). Dating to 19th-century America, it was a popular Southern highball, often served super cold with spiced rum originally.",
    origin: "USA",
    tags: ["herbal", "cooling", "boozy"]
  },
  {
    id: "25",
    name: "Moscow Mule",
    image: "https://images.unsplash.com/photo-1581984934376-7a6d37e48b04?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz vodka",
      "4 oz ginger beer",
      "0.5 oz fresh lime juice",
      "Lime wedge for garnish"
    ],
    steps: "Build vodka and lime juice over ice in a copper mug. Add ginger beer and stir gently. Garnish with lime wedge.",
    notes: "Invented in 1941 in Los Angeles to promote vodka and ginger beer. Known for its trademark copper mug, it revived vodka's popularity in the U.S.",
    origin: "USA",
    tags: ["gingery", "spicy", "refreshing"]
  },
  {
    id: "26",
    name: "Piña Colada",
    image: "https://images.unsplash.com/photo-1559068991-b41b8b0dafe0?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz white rum",
      "1.5 oz coconut cream",
      "6 oz pineapple juice",
      "Pineapple wedge and cherry for garnish"
    ],
    steps: "Blend all ingredients with ice until smooth. Pour into glass. Garnish with pineapple wedge and cherry.",
    notes: "Puerto Rico's national drink, created in 1954 by bartender Ramón Marrero in San Juan. Gained worldwide fame in the 1970s as a sweet, frozen tropical cocktail.",
    origin: "Puerto Rico",
    tags: ["tropical", "creamy", "sweet"]
  },
  {
    id: "27",
    name: "Pisco Sour",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz Pisco (brandán grape brandy)",
      "1 oz fresh lime juice",
      "0.75 oz simple syrup",
      "0.5 oz egg white",
      "Angostura bitters for garnish"
    ],
    steps: "Shake all ingredients (except bitters) with ice. Strain into glass. Garnish with a few drops of bitters on the foam.",
    notes: "Created in Lima, Peru by Victor Morris in the early 1920s. The national drink of Peru (also claimed by Chile), featuring a silky foam from egg white.",
    origin: "Peru",
    tags: ["frothy", "tangy", "citrus"]
  },
  {
    id: "28",
    name: "Sea Breeze",
    image: "https://images.unsplash.com/photo-1544385518-6df7b0dc7be5?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz vodka",
      "4 oz cranberry juice",
      "1.5 oz grapefruit juice",
      "Lime for garnish"
    ],
    steps: "Build ingredients in a glass with ice. Stir gently. Garnish with lime.",
    notes: "Invented 1929 at the Waldorf-Astoria (New York); named for its cool profile. Originally a vodka highball with fruit juices, popularized in 1980s bars.",
    origin: "USA",
    tags: ["fruity", "refreshing", "tart"]
  },
  {
    id: "29",
    name: "Sex on the Beach",
    image: "https://images.unsplash.com/photo-1559068991-b41b8b0dafe0?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz vodka",
      "1 oz peach schnapps",
      "2 oz orange juice",
      "2 oz cranberry juice",
      "Orange slice for garnish"
    ],
    steps: "Shake all ingredients with ice. Strain into chilled glass. Garnish with orange slice.",
    notes: "A playful name for a cocktail invented in Florida (1980s) targeting spring-break college crowds. Trademarked in 1996, but widely served before then.",
    origin: "USA",
    tags: ["fruity", "tropical", "sweet"]
  },
  {
    id: "30",
    name: "Singapore Sling",
    image: "https://images.unsplash.com/photo-1559068991-b41b8b0dafe0?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz gin",
      "0.5 oz Cherry Heering (cherry liqueur)",
      "0.25 oz Benedictine",
      "0.25 oz Cointreau",
      "2 oz pineapple juice",
      "0.75 oz lime juice",
      "0.5 oz grenadine",
      "1 oz club soda",
      "Pineapple and cherry for garnish"
    ],
    steps: "Shake all but soda with ice. Strain into glass and top with club soda. Garnish with pineapple and cherry.",
    notes: "Created c.1915 at Raffles Hotel, Singapore by bartender Ngiam Tong Boon. A precursor to many tropical cocktails, it's a gin-based tiki favorite with exotic ingredients.",
    origin: "Singapore",
    tags: ["complex", "tropical", "fruity"]
  },
  {
    id: "31",
    name: "Tequila Sunrise",
    image: "https://images.unsplash.com/photo-1544385518-6df7b0dc7be5?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz tequila",
      "4 oz orange juice",
      "0.5 oz grenadine",
      "Cherry and orange for garnish"
    ],
    steps: "Build tequila and OJ over ice. Slowly pour grenadine so it sinks. Do not stir (for layered effect). Garnish with cherry and orange.",
    notes: "Named for its appearance, it was popularized in 1970s America. A similar earlier version (1916) was simpler; the modern version uses grenadine for the 'sunrise' gradient.",
    origin: "USA",
    tags: ["sweet", "layered", "fruity"]
  },
  {
    id: "32",
    name: "Vesper",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "3 oz gin",
      "1 oz vodka",
      "0.5 oz Lillet Blanc vermouth",
      "Lemon twist for garnish"
    ],
    steps: "Stir ingredients with ice in mixing glass. Strain into chilled cocktail glass. Garnish with lemon twist.",
    notes: "Introduced by James Bond in Ian Fleming's 1953 novel 'Casino Royale'. A potent gin-vodka martini hybrid, named 'Vesper' after the character Vesper Lynd.",
    origin: "UK",
    tags: ["strong", "bracing", "classic"]
  },
  {
    id: "33",
    name: "Zombie",
    image: "https://images.unsplash.com/photo-1559068991-b41b8b0dafe0?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 oz light rum",
      "1 oz gold rum",
      "0.5 oz 151-proof rum",
      "0.75 oz lime juice",
      "0.5 oz grenadine",
      "0.5 oz Falernum (ginger-syrup liqueur)",
      "2 oz pineapple juice",
      "Mint and fruit for garnish"
    ],
    steps: "Shake all but 151-proof rum with ice. Strain into glass over ice. Float 151-proof rum on top. Garnish with mint and fruit.",
    notes: "Invented by Donn Beach (Trader Vic) in 1934. This Tiki-era drink is famously strong (hence 'Zombie'); it was created to help a hungover customer recover.",
    origin: "USA",
    tags: ["tiki", "fruity", "potent"]
  },
  {
    id: "34",
    name: "Bee's Knees",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz gin",
      "0.75 oz fresh lemon juice",
      "0.75 oz honey syrup",
      "Lemon twist for garnish"
    ],
    steps: "Shake all ingredients with ice. Strain into chilled coupe. Garnish with lemon twist.",
    notes: "A Prohibition-era (1920s) cocktail whose name means 'the best.' Gin, lemon, and honey balance each other; it's thought to have been created in the U.S. speakeasy scene.",
    origin: "USA",
    tags: ["citrus", "sweet", "smooth"]
  },
  {
    id: "35",
    name: "Bramble",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz gin",
      "0.75 oz fresh lemon juice",
      "0.5 oz simple syrup",
      "0.5 oz Crème de mure (blackberry liqueur)",
      "Lemon and berries for garnish"
    ],
    steps: "Shake gin, lemon, and syrup with ice. Strain over crushed ice in a glass. Drizzle Crème de mure on top. Garnish with lemon and berries.",
    notes: "Invented by British bartender Dick Bradsell in 1984 as a sweet-and-sour gin drink with blackberry notes. A modern classic that boosted Bradsell's fame.",
    origin: "UK",
    tags: ["berry", "refreshing", "tart"]
  },
  {
    id: "36",
    name: "Dark 'N' Stormy",
    image: "https://images.unsplash.com/photo-1581984934376-7a6d37e48b04?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz dark rum",
      "4 oz ginger beer",
      "Lime wedge for garnish"
    ],
    steps: "Fill glass with ice. Add ginger beer and stir. Float dark rum on top. Garnish with lime wedge.",
    notes: "A Bermudian favorite (using Gosling's rum) dating to mid-20th century. The name likely comes from its stormy appearance (dark rum over ginger beer).",
    origin: "Bermuda",
    tags: ["ginger", "spicy", "crisp"]
  },
  {
    id: "37",
    name: "Espresso Martini",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz vodka",
      "0.5 oz coffee liqueur (Kahlúa)",
      "1 oz fresh espresso",
      "0.25 oz simple syrup",
      "Three coffee beans for garnish"
    ],
    steps: "Shake all ingredients with ice. Strain into chilled martini glass. Garnish with three coffee beans.",
    notes: "Created in 1983 by London bartender Dick Bradsell (story: a model asked for something to 'wake me up and ... me up'). A modern revival of the vodka martini with espresso.",
    origin: "UK",
    tags: ["coffee", "bitter", "caffeinated"]
  },
  {
    id: "38",
    name: "French Martini",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz vodka",
      "0.5 oz Raspberry liqueur (Chambord)",
      "1.5 oz pineapple juice",
      "Raspberry for garnish"
    ],
    steps: "Shake all ingredients with ice. Strain into chilled glass. Garnish with raspberry.",
    notes: "A late-20th-century cocktail (credited to 1990s New Orleans) combining vodka, raspberry liqueur, and pineapple. Part of the martini/fruit cocktail trend.",
    origin: "USA",
    tags: ["fruity", "sweet", "berry"]
  },
  {
    id: "39",
    name: "Gin Basil Smash",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz gin",
      "0.75 oz fresh lemon juice",
      "0.5 oz simple syrup",
      "Fresh basil leaves",
      "Basil for garnish"
    ],
    steps: "Muddle basil with lemon and syrup. Add gin and ice, shake well. Double-strain into glass. Garnish with basil.",
    notes: "Invented by bartender Jürg Meyer in Hamburg in 2008. Essentially a Tom Collins riff using basil instead of mint; quickly became globally popular.",
    origin: "Germany",
    tags: ["herbal", "citrus", "bright"]
  },
  {
    id: "40",
    name: "Jungle Bird",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz dark rum",
      "1 oz Campari",
      "1.5 oz fresh pineapple juice",
      "0.5 oz fresh lime juice",
      "0.5 oz simple syrup",
      "Pineapple wedge or mint for garnish"
    ],
    steps: "Shake all ingredients with ice. Strain into glass with ice. Garnish with pineapple wedge or mint.",
    notes: "Created in 1978 at the Aviary Bar (Kuala Lumpur). A modern tiki classic combining pineapple and bitter Campari for a layered flavor.",
    origin: "Malaysia",
    tags: ["tropical", "bitter", "balanced"]
  },
  {
    id: "41",
    name: "New York Sour",
    image: "https://images.unsplash.com/photo-1544385518-6df7b0dc7be5?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz whiskey (rye or bourbon)",
      "1 oz fresh lemon juice",
      "0.75 oz simple syrup",
      "0.25 oz red wine (float)"
    ],
    steps: "Shake whiskey, lemon, and syrup with ice. Strain into glass with ice. Carefully float red wine on top of foam.",
    notes: "A variation on the classic Whiskey Sour, popular in New York City by mid-20th century. The red wine float (typically dry) adds a fruity finish.",
    origin: "USA",
    tags: ["tart", "layered", "whiskey"]
  },
  {
    id: "42",
    name: "Old Cuban",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz aged rum",
      "1 oz fresh lime juice",
      "0.75 oz simple syrup",
      "Fresh mint leaves",
      "Angostura bitters",
      "2 oz champagne",
      "Mint for garnish"
    ],
    steps: "Muddle mint with lime and syrup. Add rum and bitters, shake with ice. Strain into glass. Top with champagne. Garnish with mint.",
    notes: "Invented in 2001 by Audrey Saunders (NYC). A rum-spin on a Mojito/French 75 hybrid, with mint and sparkling wine.",
    origin: "USA",
    tags: ["minty", "bubbly", "rum"]
  },
  {
    id: "43",
    name: "Paloma",
    image: "https://images.unsplash.com/photo-1544385518-6df7b0dc7be5?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz tequila (blanco)",
      "4 oz fresh grapefruit soda",
      "0.5 oz fresh lime juice",
      "Lime or grapefruit for garnish"
    ],
    steps: "Build tequila and lime juice in glass with ice. Top with grapefruit soda. Garnish with lime or grapefruit.",
    notes: "A very popular highball in Mexico (often with grapefruit soda or juice). Became globally trendy in the 2010s as a bright, tequila-centric refresher.",
    origin: "Mexico",
    tags: ["refreshing", "citrus", "zesty"]
  },
  {
    id: "44",
    name: "Paper Plane",
    image: "https://images.unsplash.com/photo-1544385518-6df7b0dc7be5?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "0.75 oz bourbon",
      "0.75 oz Amaro Nonino",
      "0.75 oz Aperol",
      "0.75 oz fresh lemon juice"
    ],
    steps: "Shake all ingredients with ice. Strain into chilled coupe.",
    notes: "Created in 2007 by bartender Sam Ross. Named after the M.I.A. song 'Paper Planes,' it's a modern equal-parts cocktail with bitter and sweet notes.",
    origin: "USA",
    tags: ["balanced", "bittersweet", "citrus"]
  },
  {
    id: "45",
    name: "Penicillin",
    image: "https://images.unsplash.com/photo-1544385518-6df7b0dc7be5?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz blended Scotch whisky",
      "0.75 oz fresh lemon juice",
      "0.75 oz ginger-honey syrup",
      "0.5 oz single malt Scotch (float)",
      "Candied ginger for garnish"
    ],
    steps: "Shake blended Scotch, lemon, and syrup with ice. Strain into glass with ice. Float single malt on top. Garnish with candied ginger.",
    notes: "Created in 2005 by Sam Ross in NYC. Named after its 'healing' vibe (like penicillin), it combines smoky Scotch and ginger for a comforting profile.",
    origin: "USA",
    tags: ["smoky", "spicy", "soothing"]
  },
  {
    id: "46",
    name: "Pisco Punch",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz Pisco",
      "0.75 oz pineapple gum syrup",
      "0.5 oz fresh lemon juice",
      "1 oz club soda",
      "Mint for garnish"
    ],
    steps: "Shake Pisco, syrup, and lemon with ice. Strain into glass. Top with soda. Garnish with mint.",
    notes: "Legendary late-1800s cocktail from San Francisco (Bank Exchange bar). Heavily flavored (secret pineapple gum syrup) and famed in turn-of-century California.",
    origin: "USA",
    tags: ["fruity", "smooth", "citrus"]
  },
  {
    id: "47",
    name: "Porn Star Martini",
    image: "https://images.unsplash.com/photo-1559068991-b41b8b0dafe0?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz vanilla vodka",
      "0.75 oz Passoã (passion fruit liqueur)",
      "0.75 oz passion fruit puree",
      "0.5 oz fresh lime juice",
      "2 oz sparkling wine (Prosecco)"
    ],
    steps: "Shake vodka, Passoã, puree, and lime with ice. Strain into chilled coupe. Serve with a chilled shot of prosecco on the side.",
    notes: "Created in 2002 by Douglas Ankrah at London's Townhouse bar. Its cheeky name and fruity passion fruit flavor made it an instant hit in cocktail culture.",
    origin: "UK",
    tags: ["tropical", "tangy", "sweet"]
  },
  {
    id: "48",
    name: "Russian Spring Punch",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 oz vodka",
      "0.5 oz fresh lemon juice",
      "0.5 oz simple syrup",
      "0.5 oz chambord (raspberry liqueur)",
      "3 oz sparkling wine"
    ],
    steps: "Shake vodka, lemon, and syrup with ice. Strain into glass. Top with sparkling wine. Float chambord on top.",
    notes: "Created in 2004 by Dick Bradsell. Essentially a French 75 with vodka and raspberry, served with sparkling wine. Refreshing and berry-forward.",
    origin: "UK",
    tags: ["fruity", "berry", "bright"]
  },
  {
    id: "49",
    name: "Sherry Cobbler",
    image: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "3 oz dry sherry",
      "0.5 oz simple syrup",
      "2 oz orange slices",
      "Orange slices and berries for garnish"
    ],
    steps: "Muddle one orange slice with syrup. Add sherry and crushed ice. Stir and top with more ice. Garnish with orange slices and berries.",
    notes: "A 19th-century American cocktail made popular during the Civil War era. Sherry, citrus, and sugar over crushed ice was a winter favorite.",
    origin: "USA",
    tags: ["light", "refreshing", "citrus"]
  },
  {
    id: "50",
    name: "South Side",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz gin",
      "1 oz fresh lime juice",
      "0.75 oz simple syrup",
      "Fresh mint leaves",
      "Mint sprig for garnish"
    ],
    steps: "Muddle mint with lime and syrup. Add gin and ice, shake well. Double-strain into chilled glass. Garnish with mint sprig.",
    notes: "A 1920s Prohibition cocktail (named for Chicago's South Side). Similar to a mint julep without soda, a crisp gin sour with mint.",
    origin: "USA",
    tags: ["minty", "tart", "refreshing"]
  },
  {
    id: "51",
    name: "Spritz (Aperol Spritz)",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz Aperol",
      "3 oz Prosecco",
      "1 oz soda water",
      "Orange slice for garnish"
    ],
    steps: "Build Aperol and Prosecco over ice in glass. Add splash of soda and stir gently. Garnish with an orange slice.",
    notes: "The classic Venetian aperitif. Though various spritzes date back to 1800s, the Aperol version became iconic mid-20th century and achieved global popularity in the 2010s.",
    origin: "Italy",
    tags: ["bubbly", "bitter", "citrus"]
  },
  {
    id: "52",
    name: "Suffering Bastard",
    image: "https://images.unsplash.com/photo-1544385518-6df7b0dc7be5?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "0.75 oz bourbon",
      "0.75 oz gin",
      "1 oz fresh lime juice",
      "3 oz ginger beer",
      "Cucumber or mint for garnish"
    ],
    steps: "Shake bourbon, gin, and lime with ice. Strain into glass. Top with ginger beer. Garnish with cucumber or mint.",
    notes: "Invented by Lt. Col. Joe Scialom (British Army) in WWII Cairo as a hangover cure. Its name reflects intended remedy from a previous night's excess.",
    origin: "Egypt",
    tags: ["spicy", "refreshing", "herbal"]
  },
  {
    id: "53",
    name: "Tommy's Margarita",
    image: "https://images.unsplash.com/photo-1581984934376-7a6d37e48b04?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz blanco tequila (100% agave)",
      "1 oz fresh lime juice",
      "0.5 oz agave syrup",
      "Lime wheel for garnish"
    ],
    steps: "Shake all ingredients with ice. Strain into chilled glass. Garnish with lime wheel.",
    notes: "Created at Tommy's Mexican Restaurant (San Francisco, early 1990s) by Julio Bermejo. A modern Margarita variant that replaces orange liqueur with agave syrup.",
    origin: "USA",
    tags: ["citrus", "refreshing", "natural"]
  }
];
