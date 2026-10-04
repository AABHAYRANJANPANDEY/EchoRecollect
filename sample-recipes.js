/**
 * EchoRecollect - Initial Heirloom Sample Recipes & Audio Presets
 */

const SAMPLE_RECIPES = [
  {
    id: "heirloom-1",
    title: "Nonna's Slow-Simmered Sunday Gravy",
    storyteller: "Grandma Rosa",
    generation: "1st Generation (Naples to Brooklyn)",
    year: "Circa 1952",
    category: "Sunday Dinners",
    image: "assets/images/hero_banner.jpg",
    prepTime: "20 mins",
    cookTime: "3.5 hours",
    servings: "6-8",
    tags: ["Sunday Tradition", "Italian Heirloom", "Pasta", "Slow Cook"],
    isFavorite: true,
    anecdote: "My mother, Carmela, made this every Sunday without fail. When Papa worked double shifts at the docks in Red Hook, the scent of browning garlic and sweet tomatoes greeted him three blocks away. Nonno always insisted on hand-crushing the San Marzanos—he said blenders bruised the soul of the tomato. If any of the grandkids ran through the kitchen, Nonna would hand them a torn crust of crusty bread dipped straight into the simmering pot.",
    rawDictation: "Oh honey, Carmela always made this in the cold months. When Papa worked double shifts at the docks in Red Hook, the scent of browning garlic and sweet tomatoes greeted him three blocks away. You need 2 cans of whole San Marzano tomatoes—crush them with your hands, don't you dare use a machine! Get 4 cloves of garlic, smashed flat, and 1 large yellow onion, finely diced. In your heaviest pot, heat 1/3 cup of good extra virgin olive oil. Brown 1 pound of sweet Italian pork sausage and half a pound of beef short ribs first until deeply caramelized. Take the meat out, then gently sauté the onions and garlic until translucent. Splash in half a cup of dry red wine to scrape the bottom, then stir in 2 tablespoons of tomato paste and all those crushed tomatoes. Toss in 1 fresh bay leaf, a pinch of red pepper flakes, and salt to taste. Nestle the meats back in, turn the flame to the lowest whisper, and let it burble for three and a half hours until the meat is falling apart. Finish with a fistful of torn fresh basil right before tossing with rigatoni.",
    ingredients: [
      { amount: "2", unit: "cans (28 oz each)", item: "Whole San Marzano tomatoes, hand-crushed" },
      { amount: "1", unit: "lb", item: "Sweet Italian pork sausage links" },
      { amount: "0.5", unit: "lb", item: "Beef short ribs or bone-in pork chops" },
      { amount: "0.33", unit: "cup", item: "Extra virgin olive oil" },
      { amount: "4", unit: "cloves", item: "Garlic, peeled and smashed flat" },
      { amount: "1", unit: "large", item: "Yellow onion, finely diced" },
      { amount: "2", unit: "tbsp", item: "Tomato paste" },
      { amount: "0.5", unit: "cup", item: "Dry red wine (Chianti or Cabernet)" },
      { amount: "1", unit: "leaf", item: "Fresh bay leaf" },
      { amount: "1", unit: "pinch", item: "Red pepper flakes & sea salt" },
      { amount: "1", unit: "cup", item: "Fresh basil leaves, hand-torn" }
    ],
    instructions: [
      "Heat olive oil in a heavy Dutch oven over medium heat. Brown the sausages and short ribs on all sides until deeply caramelized (about 10 minutes). Remove meats to a plate.",
      "In the remaining oil, sauté the diced onion and smashed garlic over medium-low heat until soft and fragrant, about 6 minutes. Do not let garlic burn.",
      "Stir in tomato paste and cook for 2 minutes to concentrate flavor. Deglaze the pot with red wine, scraping up all browned bits from the bottom.",
      "Add hand-crushed tomatoes, bay leaf, and a pinch of red pepper flakes and salt. Bring to a gentle bubble.",
      "Nestle the browned meats back into the sauce. Reduce flame to low, partially cover with a wooden spoon holding the lid ajar, and simmer for 3 to 3.5 hours, stirring occasionally.",
      "Remove bay leaf. Stir in fresh torn basil right before spooning over al dente rigatoni with grated Pecorino Romano."
    ],
    dateAdded: "2026-09-12"
  },
  {
    id: "heirloom-2",
    title: "Aunt Clara's Golden Lemon Ricotta Cake",
    storyteller: "Aunt Clara",
    generation: "2nd Generation",
    year: "1968",
    category: "Desserts & Baking",
    image: "assets/images/lemon_ricotta.jpg",
    prepTime: "15 mins",
    cookTime: "50 mins",
    servings: "8 slices",
    tags: ["Baking", "Citrus", "Easter Tradition", "Tea Time"],
    isFavorite: true,
    anecdote: "Aunt Clara baked this cake for every springtime baptism and Easter brunch. The secret was always whole-milk ricotta from the local dairy and lemons picked right from Uncle Sal's small backyard tree. She used to say, 'Life gives you lemons, but wise women fold them into ricotta and powdered sugar.' The texture is miraculously moist and custard-like in the center.",
    rawDictation: "Every spring Aunt Clara baked this for Easter brunch. She always told us that whole-milk ricotta was the entire secret—never skim! Grab 1 cup of whole-milk ricotta cheese and 1 stick of unsalted butter softened to room temperature. You beat the butter with 1 cup of granulated sugar until light and fluffy. Beat in 3 large eggs one at a time. Then grate the zest of 2 large organic lemons and squeeze in 2 tablespoons of fresh juice. Fold in the ricotta until smooth. In another bowl, whisk 1.5 cups of all-purpose flour, 1 teaspoon of baking powder, and a half teaspoon of kosher salt. Fold dry into wet gently with a spatula. Pour into a greased 9-inch springform pan. Bake at 350 degrees Fahrenheit for 45 to 50 minutes until golden on top and a toothpick comes out with just a tender crumb. Dust heavily with powdered sugar once cooled.",
    ingredients: [
      { amount: "1", unit: "cup", item: "Whole-milk ricotta cheese (drained if watery)" },
      { amount: "0.5", unit: "cup (1 stick)", item: "Unsalted butter, room temperature" },
      { amount: "1", unit: "cup", item: "Granulated cane sugar" },
      { amount: "3", unit: "large", item: "Eggs, room temperature" },
      { amount: "2", unit: "whole", item: "Organic lemons (zest of both + 2 tbsp juice)" },
      { amount: "1.5", unit: "cups", item: "All-purpose unbleached flour" },
      { amount: "1", unit: "tsp", item: "Baking powder" },
      { amount: "0.5", unit: "tsp", item: "Kosher salt" },
      { amount: "2", unit: "tbsp", item: "Powdered sugar (for dusting)" }
    ],
    instructions: [
      "Preheat oven to 350°F (175°C). Butter and flour a 9-inch round springform or cake pan and line bottom with parchment paper.",
      "In a large bowl, cream softened butter and sugar with a hand mixer until pale and fluffy (about 3-4 minutes).",
      "Add eggs one at a time, beating thoroughly after each addition. Mix in lemon zest, lemon juice, and pureed whole-milk ricotta until creamy.",
      "Gently fold in flour, baking powder, and salt with a rubber spatula until just incorporated. Do not overmix.",
      "Spread batter evenly into the prepared pan. Bake for 48 to 52 minutes until golden on top and a tester inserted into the center comes out clean.",
      "Cool on wire rack for 20 minutes before releasing. Dust generously with confectioner's sugar and garnish with fresh lemon slices."
    ],
    dateAdded: "2026-09-20"
  },
  {
    id: "heirloom-3",
    title: "Great-Grandma Evelyn's Heritage Lattice Apple Pie",
    storyteller: "Great-Grandma Evelyn",
    generation: "Heirloom Matriarch",
    year: "1938",
    category: "Desserts & Baking",
    image: "assets/images/apple_pie.jpg",
    prepTime: "35 mins",
    cookTime: "55 mins",
    servings: "8 slices",
    tags: ["Autumn Tradition", "Thanksgiving", "Pie", "Generational Secret"],
    isFavorite: false,
    anecdote: "During the late thirties in upstate New York, apples were abundant in autumn when everything else was scarce. Evelyn taught three generations of daughters how to feel the dough with cold fingertips rather than measuring tools. She always whispered: 'Keep your butter cold, your heart warm, and never skip the cinnamon-sugar egg wash.'",
    rawDictation: "During the thirties in upstate New York, apples were our riches. Evelyn taught all of us how to feel the dough with cold fingers. For the filling: peel and thinly slice 6 cups of mixed tart apples like Granny Smith and Honeycrisp. Toss them with 3/4 cup brown sugar, 1 teaspoon ground cinnamon, 1/4 teaspoon nutmeg, 2 tablespoons all-purpose flour, and 1 tablespoon lemon juice. For the crust, you need 2.5 cups of cold flour, 1 cup of frozen salted butter cubed small, and 6 to 8 tablespoons of ice water. Cut butter into flour until pea-sized, sprinkle water until it clumps, divide into two discs and chill for an hour. Roll out bottom crust into 9-inch pie dish, pile in spiced apples and dot with 2 tablespoons butter. Weave a lattice top with remaining pastry. Brush with beaten egg wash and sprinkle coarse demerara sugar. Bake at 400 degrees for 20 minutes, then drop heat to 375 and bake another 35 minutes until the cider juices bubble up thick.",
    ingredients: [
      { amount: "6", unit: "cups", item: "Tart crisp apples (Honeycrisp & Granny Smith, peeled & sliced)" },
      { amount: "2.5", unit: "cups", item: "Cold all-purpose pastry flour" },
      { amount: "1", unit: "cup (2 sticks)", item: "Salted butter, diced small and chilled solid" },
      { amount: "6-8", unit: "tbsp", item: "Ice cold water" },
      { amount: "0.75", unit: "cup", item: "Packed light brown sugar" },
      { amount: "1", unit: "tsp", item: "Ground Saigon cinnamon" },
      { amount: "0.25", unit: "tsp", item: "Freshly grated nutmeg" },
      { amount: "2", unit: "tbsp", item: "Flour or cornstarch (to thicken juices)" },
      { amount: "1", unit: "whole", item: "Egg (beaten with 1 tbsp cream for golden wash)" },
      { amount: "1", unit: "tbsp", item: "Coarse turbinado sugar for topping" }
    ],
    instructions: [
      "Make crust: Cut cold butter into flour and a pinch of salt until crumbly. Stir in ice water tablespoon by tablespoon until dough gathers. Form two discs, wrap in wax paper, and refrigerate for at least 1 hour.",
      "Toss sliced apples in a large bowl with brown sugar, cinnamon, nutmeg, lemon juice, and flour until fruit is glossy and coated.",
      "Roll bottom pastry disc into a 12-inch circle. Ease into a deep 9-inch pie dish. Heap apple slices high into the center.",
      "Roll top pastry and cut into 10-12 even strips. Weave a classic lattice pattern over the mounded apples. Trim and crimp edges decoratively.",
      "Brush crust with beaten egg wash and sprinkle generously with coarse sugar.",
      "Bake at 400°F (200°C) for 20 minutes. Lower oven to 375°F (190°C) and bake 35-40 minutes longer until juices burble thickly through lattice. Cool completely before slicing."
    ],
    dateAdded: "2026-09-28"
  }
];

// Preset voice dictations to demonstrate Voice Memo & Extractor instantly
const PRESET_DICTATIONS = [
  {
    label: "Grandma Rosa's Sunday Gravy (1952)",
    storyteller: "Grandma Rosa",
    generation: "1st Generation",
    year: "1952",
    category: "Sunday Dinners",
    text: `Oh honey, Carmela always made this in the cold winter months in Brooklyn. When Papa worked double shifts at the docks in Red Hook, the scent of browning garlic and sweet tomatoes greeted him three blocks away. Nonno always insisted on hand-crushing the San Marzanos—he said blenders bruised the soul of the tomato. 

You need 2 cans of whole San Marzano tomatoes—crush them with your hands, don't you dare use a machine! Get 4 cloves of garlic, smashed flat, and 1 large yellow onion, finely diced. In your heaviest pot, heat 1/3 cup of good extra virgin olive oil. Brown 1 pound of sweet Italian pork sausage and half a pound of beef short ribs first until deeply caramelized. 

Take the meat out, then gently sauté the onions and garlic until translucent. Splash in half a cup of dry red wine to scrape the bottom, then stir in 2 tablespoons of tomato paste and all those crushed tomatoes. Toss in 1 fresh bay leaf, a pinch of red pepper flakes, and salt to taste. Nestle the meats back in, turn the flame to the lowest whisper, and let it burble for three and a half hours until the meat is falling apart. Finish with a fistful of torn fresh basil right before tossing with rigatoni.`
  },
  {
    label: "Uncle Joe's Cast-Iron Skillet Cornbread",
    storyteller: "Uncle Joe",
    generation: "Southern Branch",
    year: "1975",
    category: "Breads & Baking",
    text: `Listen here, you can't make proper cornbread unless that cast iron skillet is smoking hot before the batter ever touches it! We learned this on the porch in Georgia back in '75 during the sweltering July harvests. Aunt May would never let anyone add sugar—she swore sugar turned cornbread into birthday cake, but I sneak in just a little tablespoon.

Start with 2 cups of stone-ground yellow cornmeal, 1 cup of all-purpose flour, 1 teaspoon of baking soda, and 1 teaspoon of sea salt. In a separate bowl, whisk together 2 large eggs and 2 cups of rich cultured buttermilk. Now here is the real family secret: put 4 tablespoons of bacon drippings or pure butter right into your 10-inch skillet and stick it inside the 425-degree oven for 10 minutes until sizzling. 

Mix your wet and dry ingredients gently. Pour the hot melted bacon fat right into the batter, stir it three times, then immediately pour everything back into that scorching hot skillet. You should hear a mighty sizzle! Bake it for 22 to 25 minutes until the top is golden cracked and the bottom has that heavenly crunchy crust. Serve it warm with wildflower honey and sweet butter.`
  },
  {
    label: "Abuela Sofia's Cinnamon Arroz con Leche",
    storyteller: "Abuela Sofia",
    generation: "Matriarch",
    year: "1964",
    category: "Desserts & Baking",
    text: `Mi corazón, whenever rain beat on the metal roof in Michoacán, my grandmother would stand over the clay pot stirring this rice. The smell of Mexican cinnamon sticks and sweet condensed milk filled every room and brought all the cousins running. It taught us patience because you cannot rush rice cooked in milk.

Take 1 cup of long-grain white rice and rinse it once in cold water. In a heavy saucepan, bring 2 cups of water to a simmer with 2 whole Mexican cinnamon sticks (canela) and 2 strips of fresh lime peel. Add the rice and cook low for 15 minutes until the water is almost absorbed and the rice is tender. 

Now pour in 4 cups of whole milk and 1 can of sweetened condensed milk. Turn heat to gentle low. You must stir continuously with a wooden spoon for 25 to 30 minutes so the bottom never catches. When it turns thick and velvety like warm custard, take it off the heat and stir in 1 teaspoon of pure vanilla extract. Discard the lime peel and cinnamon sticks. Spoon into small heirloom dessert bowls and dust each one with freshly ground cinnamon.`
  }
];

if (typeof window !== 'undefined') {
  window.SAMPLE_RECIPES = SAMPLE_RECIPES;
  window.PRESET_DICTATIONS = PRESET_DICTATIONS;
}
if (typeof globalThis !== 'undefined') {
  globalThis.SAMPLE_RECIPES = SAMPLE_RECIPES;
  globalThis.PRESET_DICTATIONS = PRESET_DICTATIONS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SAMPLE_RECIPES, PRESET_DICTATIONS };
}
