
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
    name: "Adonis",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz fino sherry",
      "1.5 oz sweet vermouth",
      "2 dashes orange bitters",
      "Orange peel for garnish"
    ],
    steps: "Combine sherry, sweet vermouth, and orange bitters in a mixing glass with ice. Stir until well-chilled. Strain into a chilled coupe or cocktail glass. Express the oils from an orange peel over the drink and discard.",
    notes: "A brilliant vintage aperitivo from the late 19th century. It's an off-dry and aromatic cocktail that beautifully balances the mineral notes of fino sherry with rich vermouth and citrusy bitters.",
    origin: "USA",
    tags: ["classic", "aperitivo", "sherry", "vermouth", "stirred", "19th-century"]
  },
  {
    id: "2",
    name: "Affinity",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz blended Scotch whisky",
      "0.75 oz sweet vermouth",
      "0.75 oz dry vermouth",
      "2 dashes Angostura bitters",
      "Brandied cherry for garnish"
    ],
    steps: "Combine all ingredients in a mixing glass with ice. Stir until well-chilled. Strain into a chilled coupe glass and garnish with a brandied cherry.",
    notes: "A spirituous aperitivo-style cocktail from the early 20th century. It's a sophisticated after-dinner sipper that showcases the harmony between Scotch and two types of vermouth.",
    origin: "UK",
    tags: ["classic", "scotch", "vermouth", "stirred", "spirit-forward"]
  },
  {
    id: "3",
    name: "Algonquin",
    image: "https://images.unsplash.com/photo-1559068991-b41b8b0dafe0?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz rye whiskey",
      "0.75 oz dry vermouth",
      "0.75 oz pineapple juice",
      "Pineapple wedge for garnish"
    ],
    steps: "Shake all ingredients with ice until well-chilled. Fine strain into a chilled coupe glass. Garnish with a pineapple wedge.",
    notes: "A 1930s classic attributed to the famous Algonquin Hotel in New York City. The combination of spicy rye and sweet pineapple juice creates a uniquely balanced and refreshing cocktail.",
    origin: "USA",
    tags: ["classic", "whiskey", "rye", "pineapple", "shaken", "prohibition-era"]
  },
  {
    id: "4",
    name: "Alexander",
    image: "https://images.unsplash.com/photo-1614313519322-2715307a513c?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz gin",
      "0.75 oz white crème de cacao",
      "0.75 oz fresh cream",
      "Grated nutmeg for garnish"
    ],
    steps: "Shake gin, crème de cacao, and cream with ice until well-chilled. Strain into a chilled coupe glass. Garnish with freshly grated nutmeg.",
    notes: "The original gin-based Alexander first appeared in Hugo Ensslin's 1916 'Recipes for Mixed Drinks'. It is the predecessor to the more famous Brandy Alexander.",
    origin: "USA",
    tags: ["creamy", "dessert", "classic", "prohibition-era", "shaken"]
  },
  {
    id: "5",
    name: "Americano",
    image: "https://images.unsplash.com/photo-1599021459439-874a75d74245?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz Campari",
      "1.5 oz sweet vermouth",
      "Soda water to top",
      "Orange twist for garnish"
    ],
    steps: "Fill a highball glass with ice. Add Campari and sweet vermouth. Top with soda water and stir gently. Garnish with an orange twist.",
    notes: "First served in the 1860s at Gaspare Campari's bar in Milan, this refreshing aperitivo is the direct precursor to the Negroni. Its name is believed to come from its popularity with American tourists during Prohibition.",
    origin: "Italy",
    tags: ["aperitivo", "bittersweet", "italian", "classic", "highball", "low-abv"]
  },
  {
    id: "6",
    name: "Angel Face",
    image: "https://images.unsplash.com/photo-1608885998955-c4191f893870?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 oz gin",
      "1 oz apricot brandy",
      "1 oz Calvados (apple brandy)"
    ],
    steps: "Shake all ingredients with ice and strain into a chilled coupe glass.",
    notes: "A potent, equal-parts cocktail from Harry Craddock's 1930 'The Savoy Cocktail Book'. While the IBA specifies shaking, many modern bartenders prefer to stir this all-spirit drink for a silkier texture.",
    origin: "UK",
    tags: ["spirit-forward", "fruity", "prohibition-era", "classic", "equal-parts"]
  },
  {
    id: "7",
    name: "Appletini",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz vodka",
      "0.5 oz apple schnapps or Calvados",
      "0.5 oz Cointreau",
      "Apple slice for garnish"
    ],
    steps: "Shake all ingredients with ice until well-chilled. Strain into a chilled cocktail glass. Garnish with a thin slice of apple.",
    notes: "Also known as an Apple Martini, this cocktail is an icon of the 1990s. It's unashamedly fun and brash with a lurid green apple flavor at its core.",
    origin: "USA",
    tags: ["modern-classic", "fruity", "apple", "vodka", "sweet", "1990s"]
  },
  {
    id: "8",
    name: "Army & Navy",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz gin",
      "0.75 oz fresh lemon juice",
      "0.5 oz orgeat syrup",
      "1 dash Angostura bitters",
      "Lemon twist for garnish"
    ],
    steps: "Shake all ingredients with ice and strain into a chilled coupe glass. Garnish with a lemon twist.",
    notes: "A classic gin sour with a nutty twist from orgeat syrup. The almond and lemon flavors create a subtle, citrusy, and fairly dry cocktail.",
    origin: "USA",
    tags: ["classic", "gin-sour", "orgeat", "almond", "shaken"]
  },
  {
    id: "9",
    name: "Artillery Punch",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 oz brandy",
      "1 oz dark rum",
      "1 oz rye whiskey",
      "1 oz cold green tea",
      "0.25 oz fresh lemon juice",
      "0.25 oz turbinado sugar",
      "2 oz Champagne or sparkling wine"
    ],
    steps: "Dissolve sugar in the green tea. Combine all ingredients except Champagne in a shaker with ice. Shake well and strain into a tall glass with fresh ice. Top with Champagne.",
    notes: "A historic American punch with roots in the 18th century. This single-serving version balances three spirits with the tannins of tea and the brightness of Champagne.",
    origin: "USA",
    tags: ["classic", "punch", "rum", "brandy", "whiskey", "sparkling", "18th-century"]
  },
  {
    id: "10",
    name: "Aviation",
    image: "https://images.unsplash.com/photo-1614313519322-2715307a513c?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz gin",
      "0.75 oz maraschino liqueur",
      "0.5 oz fresh lemon juice",
      "0.25 oz crème de violette",
      "Brandied cherry for garnish"
    ],
    steps: "Shake all ingredients with ice until well-chilled. Double-strain into a chilled coupe glass. Garnish with a brandied cherry.",
    notes: "A pre-Prohibition classic from Hugo Ensslin's 1916 book. For decades, it was made without its key ingredient, crème de violette, which was unavailable. The liqueur's revival in the 21st century restored the drink's signature floral notes and pale sky-blue color.",
    origin: "USA",
    tags: ["sour", "floral", "gin", "classic", "pre-prohibition"]
  },
  {
    id: "11",
    name: "B-52",
    image: "https://images.unsplash.com/photo-1581984934376-7a6d37e48b04?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "0.5 oz coffee liqueur",
      "0.5 oz Irish cream liqueur",
      "0.5 oz orange liqueur (Grand Marnier)"
    ],
    steps: "Carefully layer the ingredients in a shot glass in the following order: coffee liqueur, then Irish cream, then orange liqueur. Pour each layer slowly over the back of a spoon to create distinct lines.",
    notes: "A popular layered shot created in 1977 at the Banff Springs Hotel in Canada, named after the band The B-52s. The layers work due to the different specific gravities of the liqueurs.",
    origin: "Canada",
    tags: ["shot", "layered", "creamy", "coffee", "party-drink", "1970s"]
  },
  {
    id: "12",
    name: "Bacardi Cocktail",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz Bacardí Superior rum",
      "0.75 oz fresh lime juice",
      "0.5 oz grenadine"
    ],
    steps: "Shake all ingredients with ice until well-chilled. Strain into a chilled coupe glass.",
    notes: "A classic Daiquiri variation featuring grenadine for a pink hue and sweeter profile. A 1936 New York Supreme Court ruling affirmed that a 'Bacardi Cocktail' must legally be made with Bacardí rum.",
    origin: "Cuba/USA",
    tags: ["daiquiri-variation", "classic", "rum", "fruity", "trademarked"]
  },
  {
    id: "13",
    name: "Batanga",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz tequila blanco",
      "0.5 oz fresh lime juice",
      "4 oz cola",
      "Salt for rim"
    ],
    steps: "Rim a highball glass with salt. Fill the glass with ice. Add tequila and lime juice, then top with cola and stir gently.",
    notes: "Essentially a Cuba Libre made with tequila instead of rum. The salt rim is a crucial component that enhances the flavors.",
    origin: "Mexico",
    tags: ["highball", "tequila", "cola", "refreshing", "salty"]
  },
  {
    id: "14",
    name: "Between the Sheets",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 oz white rum",
      "1 oz cognac",
      "1 oz triple sec",
      "0.75 oz fresh lemon juice"
    ],
    steps: "Shake all ingredients with ice and strain into a chilled cocktail glass. Garnish with a lemon peel.",
    notes: "A variation on the Sidecar, with rum added to the mix. It first appeared in print in Frank Shay's 1929 'Drawn From The Wood'. The IBA recipe calls for equal parts rum, cognac, and triple sec, with a smaller amount of lemon juice.",
    origin: "France",
    tags: ["sour", "spirit-forward", "classic", "prohibition-era"]
  },
  {
    id: "15",
    name: "Boulevardier",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.25 oz bourbon or rye whiskey",
      "1 oz Campari",
      "1 oz sweet vermouth",
      "Orange twist for garnish"
    ],
    steps: "Add all ingredients into a mixing glass with ice and stir until well-chilled. Strain into a rocks glass over fresh ice. Garnish with an orange twist.",
    notes: "A variation on the Negroni that substitutes whiskey for gin, creating a richer, warmer profile. It was created in Paris in the 1920s for American writer Erskine Gwynne.",
    origin: "France",
    tags: ["bittersweet", "boozy", "classic", "whiskey"]
  },
  {
    id: "16",
    name: "Brandy Crusta",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz brandy",
      "0.25 oz orange curaçao",
      "0.25 oz maraschino liqueur",
      "0.5 oz fresh lemon juice",
      "2 dashes Angostura bitters"
    ],
    steps: "Prepare a coupe glass by moistening the rim with a lemon wedge and dipping it in sugar. Carefully curl a long, wide lemon peel around the inside of the glass. Shake all ingredients with ice and strain into the prepared glass.",
    notes: "A classic New Orleans cocktail created by Joseph Santini in the mid-1800s. It is considered a forerunner of the Sidecar and is known for its elaborate sugar-crusted rim and lemon peel garnish.",
    origin: "USA",
    tags: ["classic", "sour", "brandy", "19th-century", "new-orleans"]
  },
  {
    id: "17",
    name: "Brandy Flip",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz cognac or brandy",
      "0.5 oz simple syrup (2:1)",
      "1 whole fresh egg",
      "Grated nutmeg for garnish"
    ],
    steps: "Add all ingredients to a shaker and dry shake (without ice) to emulsify. Add ice and shake again until well-chilled. Fine strain into a chilled coupe glass. Garnish with a dusting of freshly grated nutmeg.",
    notes: "A forgotten classic from the 19th century. A flip is a category of cocktail that uses a whole egg, creating a rich and creamy texture. A serious alternative to advocaat for those without raw egg inhibitions.",
    origin: "USA",
    tags: ["classic", "flip", "dessert", "brandy", "creamy", "egg", "19th-century"]
  },
  {
    id: "18",
    name: "Brooklyn",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz rye whiskey",
      "1 oz dry vermouth",
      "0.25 oz maraschino liqueur",
      "0.25 oz Picon or 2 dashes Angostura bitters",
      "Maraschino cherry for garnish"
    ],
    steps: "Stir all ingredients with ice in a mixing glass until well-chilled. Strain into a chilled cocktail glass. Garnish with a maraschino cherry.",
    notes: "One of the five cocktails named for the boroughs of New York City. It resembles a Manhattan but uses dry vermouth and maraschino liqueur. It fell into obscurity after Prohibition but saw a resurgence in the 1990s.",
    origin: "USA",
    tags: ["classic", "whiskey", "rye", "manhattan-variation", "spirit-forward", "prohibition-era"]
  },
  {
    id: "19",
    name: "Casino",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz Old Tom gin",
      "0.25 oz maraschino liqueur",
      "0.25 oz fresh lemon juice",
      "2 dashes orange bitters"
    ],
    steps: "Shake all ingredients with ice and fine strain into a chilled cocktail glass. Garnish with a maraschino cherry.",
    notes: "A classic cocktail that first appeared in Hugo Ensslin's 1916 'Recipes for Mixed Drinks'. It is essentially a stirred Aviation without the crème de violette.",
    origin: "USA",
    tags: ["classic", "gin", "pre-prohibition", "spirit-forward"]
  },
  {
    id: "20",
    name: "Clover Club",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz gin",
      "0.5 oz dry vermouth",
      "0.5 oz fresh lemon juice",
      "0.5 oz raspberry syrup",
      "0.5 oz egg white"
    ],
    steps: "Add all ingredients to a shaker and dry shake (without ice) to emulsify the egg white. Add ice and shake again until well-chilled. Double strain into a chilled coupe glass. Garnish with fresh raspberries.",
    notes: "A pre-Prohibition classic from Philadelphia. When made properly with raspberry syrup and egg white, it is an exceptional drink with a beautiful pink hue and frothy texture.",
    origin: "USA",
    tags: ["classic", "gin-sour", "frothy", "pink", "pre-prohibition"]
  },
  {
    id: "21",
    name: "Coronation Cocktail No. 1",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.75 oz dry vermouth",
      "1.25 oz fino sherry",
      "0.25 oz maraschino liqueur",
      "2 dashes orange bitters",
      "Green olive for garnish"
    ],
    steps: "Stir all ingredients with ice in a mixing glass. Strain into a chilled coupe glass. Garnish with a skewered olive.",
    notes: "A dry and wonderfully aromatic cocktail with faint notes of almond from the fino sherry and delicately fruity maraschino.",
    origin: "UK",
    tags: ["classic", "vermouth", "sherry", "aperitif", "stirred"]
  },
  {
    id: "22",
    name: "Daiquiri",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz light rum",
      "1 oz fresh lime juice",
      "0.75 oz simple syrup",
      "Lime twist for garnish"
    ],
    steps: "Shake rum, lime juice, and simple syrup with ice until well-chilled. Double-strain into a chilled coupe glass. Garnish with a lime twist.",
    notes: "A cornerstone of mixology, invented in the late 1800s in Daiquiri, Cuba. It is a simple and perfect balance of rum, lime, and sugar, and serves as a true test of a bartender's skill.",
    origin: "Cuba",
    tags: ["sour", "classic", "refreshing", "cuban", "shaken", "rum"]
  },
  {
    id: "23",
    name: "Damn the Weather",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz gin",
      "0.75 oz sweet vermouth",
      "0.75 oz orange juice",
      "0.25 oz triple sec"
    ],
    steps: "Shake all ingredients with ice and strain into a chilled cocktail glass.",
    notes: "A Prohibition-era cocktail from Harry Craddock's 1930 'The Savoy Cocktail Book'. It was likely conceived to mask the flavor of poor-quality homemade spirits.",
    origin: "USA",
    tags: ["classic", "prohibition-era", "gin", "orange", "shaken"]
  },
  {
    id: "24",
    name: "Dirty Martini",
    image: "https://i.pinimg.com/564x/49/7e/a5/497ea5909d94943924f721528c61452f.jpg",
    ingredients: [
      "2.5 oz gin or vodka",
      "0.5 oz dry vermouth",
      "0.5 oz olive brine",
      "3 green olives for garnish"
    ],
    steps: "Add gin or vodka, dry vermouth, and olive brine to a shaker filled with ice. Shake until well-chilled. Strain into a chilled cocktail glass. Garnish with a skewer of olives.",
    notes: "A savory variation of the classic Martini, the Dirty Martini includes olive brine for a salty, umami flavor. It was created by New York bartender John O'Connor in 1901.",
    origin: "USA",
    tags: ["savory", "boozy", "classic", "martini-variation"]
  },
  {
    id: "25",
    name: "Duke of Marlborough",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 part sherry",
      "1 part sweet vermouth",
      "1 part lime juice",
      "2 dashes raspberry puree",
      "1 dash orange bitters"
    ],
    steps: "Shake all ingredients with ice and strain into a chilled cocktail glass.",
    notes: "A lesser-known classic featuring a complex blend of sherry, vermouth, and fruit flavors.",
    origin: "Unknown",
    tags: ["sherry", "vermouth", "raspberry", "classic", "shaken"]
  },
  {
    id: "26",
    name: "Eclipse",
    image: "https://images.unsplash.com/photo-1559068991-b41b8b0dafe0?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "12 fresh raspberries",
      "2 oz bourbon whiskey",
      "1 oz black raspberry liqueur (e.g., Chambord)",
      "0.5 oz fresh lime juice",
      "2 oz cranberry juice",
      "Mint sprig for garnish"
    ],
    steps: "Muddle raspberries in the base of a shaker. Add the remaining liquid ingredients and ice. Shake well and fine strain into a Collins glass filled with crushed ice. Garnish with a mint sprig and more raspberries.",
    notes: "A fruity summer cooler that is the signature cocktail at the Eclipse Bars in London, England.",
    origin: "UK",
    tags: ["modern", "fruity", "bourbon", "raspberry", "summer"]
  },
  {
    id: "27",
    name: "Edna's Lunchbox",
    image: "https://images.unsplash.com/photo-1544385518-6df7b0dc7be5?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "6 oz chilled light beer",
      "1 oz amaretto",
      "6 oz chilled orange juice"
    ],
    steps: "Combine the orange juice, beer, and amaretto in a frosted mug. Stir well and serve immediately.",
    notes: "The famous signature drink of Edna's club and restaurant in Oklahoma City. It's a surprising and refreshing mix of beer, amaretto, and orange juice.",
    origin: "USA",
    tags: ["beer-cocktail", "amaretto", "orange-juice", "unusual", "refreshing"]
  },
  {
    id: "28",
    name: "El Presidente",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz aged rum",
      "1.5 oz dry vermouth",
      "0.125 oz orange curaçao",
      "0.125 oz grenadine",
      "Orange peel for garnish"
    ],
    steps: "Combine all ingredients in a mixing glass with ice and stir until well-chilled. Strain into a chilled coupe glass. Garnish with an orange peel.",
    notes: "A classic Cuban cocktail that is essentially a rum-based Martini. Modern recipes often use a slightly sweeter blanc vermouth instead of dry vermouth.",
    origin: "Cuba",
    tags: ["classic", "rum", "spirit-forward", "pre-prohibition"]
  },
  {
    id: "29",
    name: "Emerald Cocktail",
    image: "https://i.pinimg.com/564x/e7/87/84/e787840139e6962f3928e1d51a665249.jpg",
    ingredients: [
      "1.5 oz vodka",
      "0.75 oz white crème de cacao",
      "0.75 oz green crème de menthe",
      "1 oz heavy cream"
    ],
    steps: "Fill a cocktail shaker with ice. Add all ingredients, cover, and shake well. Strain into a chilled coupe or cocktail glass.",
    notes: "A creamy, mint-flavored cocktail with a vibrant green hue, perfect for St. Patrick's Day celebrations.",
    origin: "USA",
    tags: ["creamy", "mint", "vodka", "dessert", "green"]
  },
  {
    id: "30",
    name: "Envy Cocktail",
    image: "https://images.unsplash.com/photo-1559068991-b41b8b0dafe0?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz silver tequila",
      "0.75 oz blue curaçao",
      "0.5 oz pineapple juice",
      "Maraschino cherry for garnish"
    ],
    steps: "Add all ingredients to a shaker with ice and shake until well-chilled. Strain into a chilled cocktail glass. Garnish with a maraschino cherry.",
    notes: "Known for its stunning blue-green color, the Envy is a simple and lively tropical cocktail.",
    origin: "Unknown",
    tags: ["tequila", "blue-curacao", "pineapple", "tropical", "blue"]
  },
  {
    id: "31",
    name: "Fallen Angel",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz gin",
      "0.5 oz fresh lime juice",
      "2 dashes white crème de menthe",
      "1 dash Angostura bitters",
      "Mint sprig for garnish"
    ],
    steps: "Shake all ingredients with ice and strain into a chilled cocktail glass. Garnish with a mint sprig.",
    notes: "A once-forgotten Prohibition-era classic from the 1930 'Savoy Cocktail Book'. It's a refreshing gin sour with a distinct minty character.",
    origin: "UK",
    tags: ["classic", "gin-sour", "mint", "prohibition-era"]
  },
  {
    id: "32",
    name: "Fancy Free",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz bourbon or rye whiskey",
      "0.5 oz maraschino liqueur",
      "1 dash Angostura bitters",
      "2 dashes orange bitters",
      "Orange twist for garnish"
    ],
    steps: "Stir all ingredients over ice, then strain into an Old Fashioned glass over a large ice cube. Express the orange twist over the drink and drop it in.",
    notes: "An Old Fashioned variation where maraschino liqueur replaces sugar. First published in 1940, it's a surprisingly dry and complex sipper.",
    origin: "USA",
    tags: ["classic", "rye", "bourbon", "old-fashioned-variation", "spirit-forward"]
  },
  {
    id: "33",
    name: "Fernandito",
    image: "https://images.unsplash.com/photo-1544385518-6df7b0dc7be5?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.75 oz Fernet-Branca",
      "Top with Coca-Cola",
      "Lemon slice for garnish"
    ],
    steps: "Fill a highball glass with ice. Pour Fernet-Branca over the ice, then top with Coca-Cola. Stir gently and garnish with a lemon slice.",
    notes: "An iconic cocktail from Argentina, also known as 'Fernet con Coca'. It became popular in the 1990s and is considered the country's unofficial national drink.",
    origin: "Argentina",
    tags: ["highball", "bitter", "herbal", "simple", "modern-classic"]
  },
  {
    id: "34",
    name: "Fish House Punch",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 oz cognac",
      "1 oz Jamaican rum",
      "0.75 oz peach liqueur",
      "1 oz cold black tea",
      "0.75 oz fresh lemon juice",
      "0.5 oz simple syrup"
    ],
    steps: "Shake all ingredients with ice and strain into a Collins glass filled with fresh ice. Garnish with a lemon slice and grated nutmeg.",
    notes: "A historic American punch dating back to the 18th century. Modern single-serving versions balance the rum and cognac with peach liqueur, lemon, and tea for a complex, fruity flavor.",
    origin: "USA",
    tags: ["punch", "classic", "rum", "cognac", "fruity", "18th-century"]
  },
  {
    id: "35",
    name: "Flamingo",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz light rum",
      "0.5 oz lime juice",
      "0.5 oz pineapple juice",
      "0.25 oz grenadine"
    ],
    steps: "Add all ingredients into a shaker with ice and shake for 10-15 seconds. Strain into a chilled coupe glass. Garnish with a pineapple wedge or lime wheel.",
    notes: "A fruity, pink, rum-based cocktail. The name is likely inspired by the Flamingo Hotel in Las Vegas. Using fresh pineapple juice creates a better frothy head.",
    origin: "USA",
    tags: ["tiki", "rum", "pineapple", "pink", "fruity"]
  },
  {
    id: "36",
    name: "French Connection",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz cognac",
      "1.5 oz amaretto liqueur"
    ],
    steps: "Pour all ingredients directly into an old fashioned glass filled with ice cubes. Stir gently.",
    notes: "A simple and elegant after-dinner drink made with equal parts Cognac and Amaretto. The cocktail is named for the 1971 Gene Hackman film of the same name.",
    origin: "USA",
    tags: ["digestif", "simple", "two-ingredient", "classic", "sweet"]
  },
  {
    id: "37",
    name: "Gibson",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2.5 oz gin",
      "0.5 oz dry vermouth",
      "Pickled cocktail onions for garnish"
    ],
    steps: "Stir gin and vermouth with ice in a mixing glass until well-chilled. Strain into a chilled cocktail glass. Garnish with one or two pickled onions.",
    notes: "A variation on the classic Martini, the Gibson is distinguished by its pickled onion garnish instead of an olive or lemon twist. Early recipes differentiated it by the lack of bitters.",
    origin: "USA",
    tags: ["classic", "martini-variation", "savory", "spirit-forward"]
  },
  {
    id: "38",
    name: "Gimlet",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz gin",
      "1 oz fresh lime juice",
      "0.75 oz simple syrup",
      "Lime wheel for garnish"
    ],
    steps: "Shake all ingredients with ice until well-chilled. Strain into a chilled coupe glass. Garnish with a lime wheel.",
    notes: "A classic cocktail allegedly created by British sailors to combat scurvy. The traditional recipe calls for gin and Rose's Lime Juice Cordial, but modern craft versions use fresh lime juice and simple syrup for a brighter flavor.",
    origin: "UK",
    tags: ["classic", "gin-sour", "refreshing", "simple"]
  },
  {
    id: "39",
    name: "Gin Fizz",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz gin",
      "1 oz fresh lemon juice",
      "0.75 oz simple syrup",
      "1 egg white",
      "Club soda to top"
    ],
    steps: "Add gin, lemon juice, simple syrup, and egg white to a shaker. Dry shake (without ice) vigorously. Add ice and shake again until well-chilled. Strain into a chilled Collins glass and top with club soda.",
    notes: "A classic 19th-century cocktail from Jerry Thomas's 1876 guide. The egg white (which makes it a 'Silver Fizz') creates a silky texture and frothy head. It is closely related to the Tom Collins.",
    origin: "USA",
    tags: ["classic", "fizz", "gin-sour", "refreshing", "19th-century", "frothy"]
  },
  {
    id: "40",
    name: "Godfather",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.75 oz Scotch whisky",
      "0.75 oz amaretto liqueur"
    ],
    steps: "Pour all ingredients directly into an old-fashioned glass filled with ice. Stir gently.",
    notes: "A simple and popular after-dinner drink. The almond flavor of amaretto softens the bite of the scotch. Disaronno claims it was a favorite of actor Marlon Brando.",
    origin: "USA",
    tags: ["classic", "simple", "two-ingredient", "digestif", "whisky"]
  },
  {
    id: "41",
    name: "Godmother",
    image: "https://images.unsplash.com/photo-1581984934376-7a6d37e48b04?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz vodka",
      "0.75 oz amaretto"
    ],
    steps: "Pour vodka and amaretto into an old-fashioned glass over ice and stir.",
    notes: "A variation of the Godfather, substituting vodka for Scotch whisky. It's a smooth, slightly sweet cocktail that is incredibly easy to make.",
    origin: "USA",
    tags: ["classic", "simple", "two-ingredient", "digestif", "vodka"]
  },
  {
    id: "42",
    name: "Golden Dream",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 oz Galliano L'Autentico",
      "1 oz Cointreau",
      "1 oz fresh orange juice",
      "0.5 oz heavy cream"
    ],
    steps: "Combine all ingredients in a cocktail shaker half-filled with ice. Shake vigorously for at least 30 seconds. Strain into a chilled cocktail glass.",
    notes: "A creamy, dessert-like cocktail popular in the 1960s and 70s. It was likely created by Raimundo Alvarez at the Old King Bar in Miami. It is an official IBA cocktail.",
    origin: "USA",
    tags: ["classic", "dessert", "creamy", "orange", "1960s"]
  },
  {
    id: "43",
    name: "Hanky Panky",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz London dry gin",
      "1.5 oz sweet vermouth",
      "2 dashes Fernet-Branca"
    ],
    steps: "Add all ingredients into a mixing glass with ice and stir until well-chilled. Strain into a chilled cocktail glass. Garnish with an orange twist.",
    notes: "Created by Ada 'Coley' Coleman, head bartender at the Savoy Hotel in London in the early 20th century. It's a variation on the Sweet Martini, made distinctive by the bitter Italian digestivo, Fernet-Branca.",
    origin: "UK",
    tags: ["classic", "gin", "vermouth", "bitter", "spirit-forward"]
  },
  {
    id: "44",
    name: "Harvey Wallbanger",
    image: "https://images.unsplash.com/photo-1544385518-6df7b0dc7be5?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz vodka",
      "4 oz orange juice",
      "0.5 oz Galliano L'Autentico",
      "Orange slice for garnish"
    ],
    steps: "Build vodka and orange juice in a highball glass filled with ice. Float Galliano on top by slowly pouring over the back of a bar spoon. Garnish with an orange slice.",
    notes: "A 1970s cocktail that became a cultural phenomenon. It's essentially a Screwdriver with a float of Galliano. The drink was popularized by a marketing campaign featuring a cartoon surfer character.",
    origin: "USA",
    tags: ["classic", "vodka", "orange", "1970s", "floating"]
  },
  {
    id: "45",
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
    id: "83",
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
    id: "112",
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
    id: "113",
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
  },
  {
    id: "92",
    name: "Harvey Wallbanger",
    image: "https://images.unsplash.com/photo-1544385518-6df7b0dc7be5?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz vodka",
      "4 oz orange juice",
      "0.5 oz Galliano L'Autentico",
      "Orange slice for garnish"
    ],
    steps: "Combine vodka and orange juice in a tall glass with ice and stir. Float Galliano on top. Garnish with an orange slice.",
    notes: "A popular disco-era cocktail, essentially a Screwdriver with a float of Galliano, an Italian herbal liqueur. The drink is credited to mixologist Donato 'Duke' Antone.",
    origin: "USA",
    tags: ["classic", "vodka", "orange", "highball", "1970s"]
  },
  {
    id: "93",
    name: "Horse's Neck",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz brandy or bourbon",
      "4 oz ginger ale",
      "1 dash Angostura bitters (optional)",
      "Long spiral of lemon peel for garnish"
    ],
    steps: "Pour brandy and ginger ale directly into a highball glass with ice cubes. Stir gently. Garnish with a long spiral of lemon peel draped over the edge of the glass.",
    notes: "An American cocktail recognized by the IBA, identifiable by its long, curling strip of lemon rind garnish. It is listed as a 'Contemporary Classic'.",
    origin: "USA",
    tags: ["classic", "highball", "brandy", "ginger-ale", "simple"]
  },
  {
    id: "94",
    name: "Imperial Fizz",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz blended whiskey",
      "0.75 oz light rum",
      "0.5 oz fresh lemon juice",
      "0.5 oz sugar",
      "Soda water to top"
    ],
    steps: "Shake whiskey, rum, lemon juice, and sugar with ice and strain into a highball glass over two ice cubes. Fill with soda water, stir, and serve.",
    notes: "A classic fizz variation that combines both whiskey and rum for a more complex base spirit.",
    origin: "Unknown",
    tags: ["classic", "fizz", "highball", "whiskey", "rum"]
  },
  {
    id: "95",
    name: "John Collins",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz London dry gin",
      "1 oz fresh lemon juice",
      "0.5 oz simple syrup",
      "2 oz soda water",
      "Lemon slice and maraschino cherry for garnish"
    ],
    steps: "Pour all ingredients directly into a Collins glass filled with ice. Stir gently. Garnish with a lemon slice and a maraschino cherry.",
    notes: "A classic long drink attested to in 1869, believed to have originated with a headwaiter of that name at Limmer's Old House in London. It is essentially a Tom Collins made with London Dry Gin instead of Old Tom Gin.",
    origin: "UK",
    tags: ["classic", "highball", "gin", "refreshing", "19th-century"]
  },
  {
    id: "96",
    name: "Kamikaze",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 oz vodka",
      "1 oz triple sec",
      "1 oz fresh lime juice"
    ],
    steps: "Shake all ingredients together with ice. Strain into a chilled cocktail glass. Garnish with a lime wedge.",
    notes: "A simple, sharp, and refreshing cocktail made of equal parts vodka, triple sec, and lime juice. It became popular in the 1970s during the rise of vodka.",
    origin: "Japan/USA",
    tags: ["modern-classic", "vodka", "sour", "shot", "1970s"]
  },
  {
    id: "97",
    name: "Kentucky Mule",
    image: "https://images.unsplash.com/photo-1609119309844-ad5e8f74e2e1?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz Kentucky bourbon",
      "0.5 oz fresh lime juice",
      "4 oz ginger beer",
      "Mint sprig and lime wheel for garnish"
    ],
    steps: "In a copper mug or highball glass, pour in the bourbon and lime juice. Add ice and top with ginger beer. Garnish with a sprig of fresh mint and a lime wheel.",
    notes: "A popular variation on the Moscow Mule that substitutes bourbon for vodka, creating a spicier and more robust flavor profile.",
    origin: "USA",
    tags: ["modern-classic", "highball", "bourbon", "ginger-beer", "spicy"]
  },
  {
    id: "98",
    name: "Kir Royale",
    image: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "0.5 oz crème de cassis",
      "5 oz chilled Champagne or dry sparkling wine",
      "Fresh raspberry for garnish (optional)"
    ],
    steps: "Pour the crème de cassis into a champagne flute, then top with chilled Champagne. Garnish with a fresh raspberry if desired.",
    notes: "An elegant and celebratory French apéritif. It is a variation of the classic Kir (white wine and cassis), using Champagne instead of still wine.",
    origin: "France",
    tags: ["classic", "sparkling", "aperitif", "elegant", "two-ingredient"]
  },
  {
    id: "99",
    name: "Last Word",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "0.75 oz gin",
      "0.75 oz green Chartreuse",
      "0.75 oz maraschino liqueur",
      "0.75 oz fresh lime juice"
    ],
    steps: "Shake all ingredients with ice and strain into a chilled cocktail glass.",
    notes: "A gin-based cocktail originating at the Detroit Athletic Club in the 1910s. It's a perfectly balanced, equal-parts cocktail known for its complex, pungent, and sharp flavor profile.",
    origin: "USA",
    tags: ["classic", "gin", "prohibition-era", "sour", "herbal", "equal-parts"]
  },
  {
    id: "100",
    name: "Martinez",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz Old Tom gin",
      "1.5 oz sweet vermouth",
      "1 barspoon maraschino liqueur",
      "2 dashes orange bitters",
      "Orange twist for garnish"
    ],
    steps: "Add all ingredients into a mixing glass with ice and stir until well-chilled. Strain into a chilled coupe glass. Garnish with an orange twist.",
    notes: "Widely regarded as the direct precursor to the Martini. Early recipes varied, but the modern classic combines Old Tom Gin, sweet vermouth, maraschino liqueur, and bitters.",
    origin: "USA",
    tags: ["classic", "gin", "vermouth", "spirit-forward", "19th-century"]
  },
  {
    id: "101",
    name: "Mary Pickford",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz white rum",
      "1.5 oz fresh pineapple juice",
      "1 barspoon maraschino liqueur",
      "1 barspoon grenadine"
    ],
    steps: "Shake all ingredients with ice and strain into a chilled cocktail glass. Garnish with a maraschino cherry.",
    notes: "A Prohibition-era cocktail created in the 1920s at the Hotel Nacional de Cuba for the silent movie star of the same name. It's a sweet, fruity, and refreshing rum drink.",
    origin: "Cuba",
    tags: ["classic", "rum", "fruity", "tropical", "prohibition-era"]
  },
  {
    id: "102",
    name: "Monkey Gland",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz gin",
      "1.5 oz orange juice",
      "1 barspoon absinthe",
      "1 barspoon grenadine"
    ],
    steps: "Shake all ingredients well with ice and strain into a chilled cocktail glass.",
    notes: "Created in the 1920s by Harry MacElhone at Harry's New York Bar in Paris. The name refers to a controversial surgical procedure from the era.",
    origin: "France",
    tags: ["classic", "gin", "orange", "absinthe", "prohibition-era"]
  },
  {
    id: "103",
    name: "Naked & Famous",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "0.75 oz mezcal",
      "0.75 oz Aperol",
      "0.75 oz yellow Chartreuse",
      "0.75 oz fresh lime juice"
    ],
    steps: "Shake all ingredients with ice and fine strain into a chilled coupe glass.",
    notes: "A modern classic created in 2011 by Joaquín Simó. It's described as 'the bastard child born out of an illicit Oaxacan love affair between the classic Last Word and the Paper Plane'.",
    origin: "USA",
    tags: ["modern-classic", "mezcal", "bittersweet", "sour", "equal-parts"]
  },
  {
    id: "104",
    name: "Old Pal",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz rye whiskey",
      "0.75 oz dry vermouth",
      "0.75 oz Campari",
      "Lemon twist for garnish"
    ],
    steps: "Stir all ingredients with ice, then strain into a chilled coupe glass. Garnish with a lemon twist.",
    notes: "A rye whiskey-based version of the Boulevardier, first appearing in Harry MacElhone's 1927 'Barflies and Cocktails'. It uses dry vermouth instead of sweet, resulting in a drier, spicier profile.",
    origin: "France",
    tags: ["classic", "whiskey", "rye", "bittersweet", "spirit-forward"]
  },
  {
    id: "105",
    name: "Painkiller",
    image: "https://images.unsplash.com/photo-1559068991-b41b8b0dafe0?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz Pusser's rum",
      "4 oz pineapple juice",
      "1 oz orange juice",
      "1 oz cream of coconut",
      "Freshly grated nutmeg for garnish"
    ],
    steps: "Add all liquid ingredients to a shaker with ice and shake vigorously. Pour into a hurricane glass or large goblet filled with crushed ice. Garnish with freshly grated nutmeg.",
    notes: "A rich and fruity tiki cocktail created in the 1970s at the Soggy Dollar Bar in the British Virgin Islands. It is a trademarked cocktail that officially must be made with Pusser's Rum.",
    origin: "British Virgin Islands",
    tags: ["tiki", "classic", "rum", "tropical", "creamy", "1970s"]
  },
  {
    id: "106",
    name: "Paradise",
    image: "https://images.unsplash.com/photo-1559068991-b41b8b0dafe0?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz gin",
      "0.75 oz apricot brandy",
      "0.75 oz fresh orange juice"
    ],
    steps: "Pour all ingredients into cocktail shaker, shake well with ice, strain into chilled cocktail glass.",
    notes: "A classic apéritif cocktail that first appears in Harry Craddock's 1930 'The Savoy Cocktail Book'. It's a simple, fruity, and elegant gin drink.",
    origin: "UK",
    tags: ["classic", "gin", "fruity", "aperitif", "pre-prohibition"]
  },
  {
    id: "107",
    name: "Pegu Club",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz London dry gin",
      "0.75 oz orange curaçao",
      "0.75 oz fresh lime juice",
      "1 dash Angostura bitters",
      "1 dash orange bitters"
    ],
    steps: "Shake all ingredients with ice and strain into a chilled coupe glass. Garnish with a lime wedge.",
    notes: "The signature drink of the Pegu Club in Burma, a British colonial-era institution. It's a tart, dry, and refreshing gin sour with complex bitter notes.",
    origin: "Burma (Myanmar)",
    tags: ["classic", "gin-sour", "colonial-era", "refreshing", "tart"]
  },
  {
    id: "108",
    name: "Pink Gin",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz Plymouth gin",
      "4 dashes Angostura bitters",
      "Lemon peel for garnish"
    ],
    steps: "Chill a cocktail glass. Swirl the Angostura bitters around the inside of the chilled glass to coat it, discarding any excess. Add the chilled gin and stir. Garnish with a lemon peel.",
    notes: "A classic British cocktail from the mid-19th century, consisting simply of gin and a dash of Angostura bitters, which gives the drink its signature pinkish hue.",
    origin: "UK",
    tags: ["classic", "gin", "simple", "spirit-forward", "19th-century"]
  },
  {
    id: "109",
    name: "Planter's Punch",
    image: "https://images.unsplash.com/photo-1559068991-b41b8b0dafe0?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz Jamaican rum",
      "1 oz fresh lime juice",
      "1 oz sugar cane juice",
      "Pineapple slice and cherry for garnish"
    ],
    steps: "Pour all ingredients into a shaker filled with ice. Shake well. Pour into a large glass filled with fresh ice. Garnish with a pineapple slice and a cocktail cherry.",
    notes: "An IBA Official Cocktail originating from Jamaica. The classic rhyme for the recipe is 'One of Sour, Two of Sweet, Three of Strong, Four of Weak'.",
    origin: "Jamaica",
    tags: ["classic", "tiki", "rum", "punch", "fruity"]
  },
  {
    id: "110",
    name: "Porto Flip",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "0.5 oz brandy",
      "1.5 oz ruby port",
      "0.33 oz egg yolk",
      "Freshly grated nutmeg for garnish"
    ],
    steps: "Shake all ingredients vigorously with ice. Strain into a chilled cocktail glass. Garnish with freshly grated nutmeg.",
    notes: "A classic 'flip' style cocktail (containing egg yolk) first recorded in Jerry Thomas's 1862 'The Bartender's Guide'. It's a rich, creamy, and comforting after-dinner drink.",
    origin: "USA",
    tags: ["classic", "flip", "dessert", "port", "brandy", "19th-century"]
  },
  {
    id: "111",
    name: "Rabo de Galo",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz cachaça",
      "0.5 oz sweet vermouth",
      "0.5 oz Cynar",
      "Orange twist for garnish"
    ],
    steps: "Stir all ingredients with ice in a mixing glass. Strain into a rocks glass filled with fresh ice. Garnish with an orange twist.",
    notes: "A classic Brazilian cocktail whose name literally translates to 'cock's tail'. It originated in the 1950s and typically combines cachaça with a bitter and a vermouth.",
    origin: "Brazil",
    tags: ["classic", "cachaca", "bittersweet", "spirit-forward", "aperitivo"]
  },
  {
    id: "112",
    name: "Ramos Gin Fizz",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz gin",
      "0.5 oz fresh lime juice",
      "0.5 oz fresh lemon juice",
      "1 oz heavy cream",
      "1 egg white",
      "1 tsp simple syrup",
      "3 drops orange flower water",
      "Club soda to top"
    ],
    steps: "Combine all ingredients except soda water in a shaker. Dry shake vigorously for at least 45 seconds. Add ice and shake again until well-chilled. Strain into a chilled Collins glass without ice. Slowly top with soda water, allowing the foam to rise above the rim of the glass.",
    notes: "An iconic New Orleans cocktail created in 1888 by Henry C. Ramos. It is famously labor-intensive due to the long shaking time required to achieve its signature thick, frothy head.",
    origin: "USA",
    tags: ["classic", "new-orleans", "gin-fizz", "frothy", "creamy", "labor-intensive"]
  },
  {
    id: "113",
    name: "Rattlesnake",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz rye whiskey",
      "0.75 oz fresh lemon juice",
      "0.75 oz simple syrup",
      "0.5 oz egg white",
      "Absinthe to rinse",
      "Angostura bitters for garnish"
    ],
    steps: "Rinse a chilled coupe glass with absinthe and set aside. Combine remaining ingredients in a shaker and dry shake for 10-12 seconds. Add ice and shake again until well-chilled. Fine-strain into the prepared glass. Garnish with a few drops of bitters on the foam.",
    notes: "A classic whiskey sour variation with a hint of absinthe, first appearing in Harry Craddock's 1930 'The Savoy Cocktail Book'. The name is said to come from the idea that it could either cure a rattlesnake bite or make you see them.",
    origin: "USA/UK",
    tags: ["classic", "whiskey-sour", "rye", "absinthe", "frothy"]
  },
  {
    id: "114",
    name: "Remember the Maine",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz rye whiskey",
      "0.75 oz sweet vermouth",
      "2 tsp cherry liqueur (Cherry Heering)",
      "0.5 tsp absinthe"
    ],
    steps: "Combine all ingredients in a mixing glass with ice and stir until well-chilled. Strain into a chilled coupe glass. Garnish with a cherry.",
    notes: "A rich whiskey cocktail from Charles H. Baker, Jr.'s 1939 book 'The Gentleman's Companion'. It's a complex, Manhattan-like drink with herbal and cherry notes.",
    origin: "USA/Cuba",
    tags: ["classic", "whiskey", "rye", "spirit-forward", "prohibition-era"]
  },
  {
    id: "115",
    name: "Rusty Nail",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz Scotch whisky",
      "0.75 oz Drambuie",
      "Lemon twist for garnish"
    ],
    steps: "Pour all ingredients directly into an old-fashioned glass filled with ice. Stir gently. Garnish with a lemon twist.",
    notes: "A simple, two-ingredient cocktail made by mixing Scotch whisky and Drambuie, a Scotch-based liqueur flavored with honey and herbs.",
    origin: "USA",
    tags: ["classic", "scotch", "simple", "two-ingredient", "digestif"]
  },
  {
    id: "116",
    name: "Sazerac",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 sugar cube",
      "3 dashes Peychaud's bitters",
      "2 oz rye whiskey",
      "0.25 oz absinthe",
      "Lemon peel for garnish"
    ],
    steps: "Rinse a chilled old-fashioned glass with absinthe, discarding the excess, and set aside. In a mixing glass, muddle the sugar cube with the Peychaud's bitters. Add the rye whiskey, fill with ice, and stir until well-chilled. Strain into the prepared glass. Express the lemon peel over the drink and discard.",
    notes: "The official cocktail of New Orleans, created in the mid-1800s. It's a potent and aromatic combination of rye whiskey, bitters, and an absinthe rinse.",
    origin: "USA",
    tags: ["classic", "new-orleans", "whiskey", "rye", "spirit-forward", "19th-century"]
  },
  {
    id: "117",
    name: "Screwdriver",
    image: "https://images.unsplash.com/photo-1544385518-6df7b0dc7be5?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz vodka",
      "5 oz orange juice",
      "Orange slice for garnish"
    ],
    steps: "Pour vodka and orange juice into a highball glass filled with ice. Stir well. Garnish with an orange slice.",
    notes: "A simple highball of vodka and orange juice. It reportedly gets its name from American oil workers who originally stirred the drink with a screwdriver.",
    origin: "USA",
    tags: ["classic", "highball", "vodka", "simple", "brunch"]
  },
  {
    id: "118",
    name: "Sidecar",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz cognac",
      "0.75 oz orange liqueur (Cointreau)",
      "0.75 oz fresh lemon juice",
      "Sugar for rim (optional)",
      "Orange twist for garnish"
    ],
    steps: "Coat the rim of a coupe glass with sugar, if desired. Add all liquid ingredients to a shaker with ice and shake until well-chilled. Strain into the prepared glass. Garnish with an orange twist.",
    notes: "A classic sour cocktail featuring cognac, orange liqueur, and lemon juice. It was likely invented around World War I in either London or Paris and is a direct descendant of the Brandy Crusta.",
    origin: "France/UK",
    tags: ["classic", "sour", "cognac", "brandy", "WWI-era"]
  },
  {
    id: "119",
    name: "Stinger",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz cognac",
      "1 oz white crème de menthe",
      "Mint sprig for garnish"
    ],
    steps: "Shake all ingredients with ice and strain into a glass filled with crushed ice. Garnish with a mint sprig.",
    notes: "A classic duo cocktail made with brandy and crème de menthe. It was a popular high-society drink in the US from the 1890s through the 1970s.",
    origin: "USA",
    tags: ["classic", "digestif", "brandy", "mint", "two-ingredient"]
  },
  {
    id: "120",
    name: "Tipperary",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz Irish whiskey",
      "1 oz sweet vermouth",
      "0.5 oz green Chartreuse",
      "2 dashes Angostura bitters"
    ],
    steps: "Stir all ingredients with ice in a mixing glass until well-chilled. Strain into a chilled coupe glass. Garnish with an orange twist.",
    notes: "A classic Irish whiskey cocktail that is a variation on the Bijou. The first recipe appeared in Hugo Ensslin's 1916 book. Modern versions often increase the proportion of whiskey.",
    origin: "USA",
    tags: ["classic", "irish-whiskey", "spirit-forward", "herbal"]
  },
  {
    id: "121",
    name: "Tom Collins",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz Old Tom gin",
      "1 oz fresh lemon juice",
      "0.5 oz simple syrup",
      "Club soda to top",
      "Lemon wheel and maraschino cherry for garnish"
    ],
    steps: "Combine gin, lemon juice, and simple syrup in a Collins glass with ice. Stir to combine. Top with club soda. Garnish with a lemon wheel and a maraschino cherry.",
    notes: "A classic gin highball that is essentially a sparkling lemonade with gin. It is traditionally made with Old Tom Gin, a slightly sweeter style of gin popular in the 19th century.",
    origin: "UK/USA",
    tags: ["classic", "highball", "gin", "refreshing", "19th-century"]
  },
  {
    id: "122",
    name: "Tuxedo",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz Old Tom gin",
      "1 oz dry vermouth",
      "0.5 barspoon maraschino liqueur",
      "1 barspoon absinthe",
      "2 dashes orange bitters",
      "Lemon twist and cherry for garnish"
    ],
    steps: "Stir all ingredients with ice in a mixing glass until well-chilled. Strain into a chilled coupe glass. Garnish with a skewered lemon twist and a cherry.",
    notes: "A sophisticated variation on the Martini, named after the Tuxedo Club in New York. It's a complex, aromatic cocktail with multiple variations.",
    origin: "USA",
    tags: ["classic", "martini-variation", "gin", "spirit-forward", "19th-century"]
  },
  {
    id: "123",
    name: "Vieux Carré",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1 oz rye whiskey",
      "1 oz cognac",
      "1 oz sweet vermouth",
      "1 barspoon Bénédictine",
      "2 dashes Peychaud's bitters",
      "2 dashes Angostura bitters",
      "Orange or lemon peel for garnish"
    ],
    steps: "Combine all ingredients in a mixing glass with ice and stir until well-chilled. Strain into a rocks glass over a large ice cube. Garnish with an orange or lemon peel.",
    notes: "Meaning 'Old Square' in French, this cocktail was created in the 1930s at the Hotel Monteleone in New Orleans' French Quarter. It's a complex and warming blend of rye, cognac, and liqueurs.",
    origin: "USA",
    tags: ["classic", "new-orleans", "whiskey", "cognac", "spirit-forward", "prohibition-era"]
  },
  {
    id: "124",
    name: "Vodka Tonic",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz vodka",
      "4 oz tonic water",
      "Lime wedge for garnish"
    ],
    steps: "Fill a highball glass with ice. Add vodka and top with tonic water. Squeeze a lime wedge over the drink and drop it in.",
    notes: "A simple, classic highball. The ratio of vodka to tonic can be adjusted to taste, but a 1:2 or 1:3 ratio is common. A generous squeeze of lime is essential.",
    origin: "Global",
    tags: ["classic", "highball", "vodka", "simple", "refreshing"]
  },
  {
    id: "125",
    name: "Ward 8",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz rye whiskey",
      "0.5 oz fresh lemon juice",
      "0.5 oz fresh orange juice",
      "1 tsp grenadine"
    ],
    steps: "Shake all ingredients with ice and strain into a chilled cocktail glass. Garnish with a cherry or orange slice.",
    notes: "A classic whiskey sour variation originating in 1898 in Boston, Massachusetts, at the Locke-Ober Café. It was named in honor of a local political boss.",
    origin: "USA",
    tags: ["classic", "whiskey-sour", "rye", "fruity", "pre-prohibition"]
  },
  {
    id: "126",
    name: "White Lady",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "2 oz gin",
      "0.75 oz Cointreau",
      "0.75 oz fresh lemon juice",
      "0.5 oz egg white"
    ],
    steps: "Add all ingredients to a shaker and dry shake (without ice). Add ice and shake again until well-chilled. Fine strain into a chilled coupe glass. Garnish with a lemon twist.",
    notes: "A classic gin sour, essentially a Sidecar made with gin instead of brandy. The recipe was popularized by Harry Craddock in his 1930 'The Savoy Cocktail Book'. The addition of egg white has become standard for a silky texture.",
    origin: "UK/France",
    tags: ["classic", "gin-sour", "frothy", "elegant", "prohibition-era"]
  },
  {
    id: "127",
    name: "Widow's Kiss",
    image: "https://images.unsplash.com/photo-1576729211808-f2ed4db73c1a?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz Calvados",
      "0.75 oz Bénédictine",
      "0.75 oz yellow Chartreuse",
      "2 dashes Angostura bitters",
      "Cherry for garnish"
    ],
    steps: "Stir all ingredients with ice in a mixing glass until well-chilled. Strain into a chilled coupe glass. Garnish with a cherry.",
    notes: "A potent, herbal, and complex cocktail from the late 19th century. It's a formidable drink featuring apple brandy and two classic French herbal liqueurs.",
    origin: "USA",
    tags: ["classic", "spirit-forward", "herbal", "apple-brandy", "digestif"]
  },
  {
    id: "128",
    name: "Yellow Bird",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&q=80",
    ingredients: [
      "1.5 oz white rum",
      "0.5 oz Galliano",
      "0.5 oz triple sec",
      "0.5 oz fresh lime juice"
    ],
    steps: "Shake all ingredients with ice and strain into a chilled cocktail glass.",
    notes: "A tropical cocktail whose name may come from a popular Haitian tune. The IBA recipe is a simple sour, but other variations are more complex, often including pineapple and orange juice.",
    origin: "Caribbean/USA",
    tags: ["classic", "tiki", "rum", "fruity", "tropical"]
  }
];
