/**
 * EchoRecollect - AI Recipe & Story Extractor
 * Heuristic Natural Language Processing engine tailored for family oral histories,
 * voice memo dictations, and unstructured heirloom kitchen stories.
 */

const RecipeExtractor = (function () {
  // Common culinary measurement units
  const UNITS = [
    'cups?', 'cup', 'tbsp', 'tablespoons?', 'tsp', 'teaspoons?', 'oz', 'ounces?',
    'lbs?', 'pounds?', 'g', 'grams?', 'kg', 'kilograms?', 'pinch(es)?', 'dash(es)?',
    'fistfuls?', 'handfuls?', 'cloves?', 'cans?', 'stalks?', 'bunches?', 'slices?',
    'sticks?', 'leaves?', 'pieces?', 'drizzles?', 'splash(es)?', 'drops?', 'bottles?'
  ];
  const unitRegexPattern = new RegExp(`^(\\d+(?:\\.\\d+)?(?:\\/\\d+)?|half|quarter|one|two|three|four|five|six|seven|eight|nine|ten|a dozen|a)?\\s*(${UNITS.join('|')})\\b`, 'i');

  // Conversational nostalgia & anecdote markers
  const ANECDOTE_KEYWORDS = [
    'back in', 'when i was', 'my mother', 'my father', 'grandma', 'grandpa', 'nonna',
    'nonno', 'abuela', 'abuelo', 'aunt', 'uncle', 'papa', 'mama', 'sister', 'brother',
    'cousin', 'childhood', 'remember', 'tradition', 'every sunday', 'easter', 'thanksgiving',
    'christmas', 'holidays', 'neighborhood', 'porch', 'kitchen', 'docks', 'harvest',
    'roof', 'years ago', 'in 19', 'in 18', 'secret was', 'insisted', 'taught us',
    'taught me', 'would say', 'whispered', 'story', 'heirloom', 'passed down'
  ];

  // Action verbs that typically initiate recipe steps
  const ACTION_VERBS = [
    'heat', 'preheat', 'sear', 'brown', 'sauté', 'saute', 'fry', 'boil', 'simmer', 'reduce',
    'stir', 'mix', 'whisk', 'beat', 'fold', 'knead', 'roll', 'crush', 'chop', 'dice',
    'mince', 'slice', 'peel', 'grate', 'zest', 'season', 'splash', 'deglaze', 'pour',
    'spread', 'bake', 'roast', 'broil', 'chill', 'refrigerate', 'cool', 'dust', 'garnish',
    'serve', 'toss', 'drain', 'rinse', 'combine', 'cut', 'brush', 'sprinkle', 'weave'
  ];

  // Common number words converter
  const WORD_NUMBERS = {
    'half': '0.5',
    'half a': '0.5',
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9',
    'ten': '10',
    'dozen': '12'
  };

  /**
   * Main extractor function
   * @param {string} rawText - Unstructured voice memo or narrative text
   * @param {object} meta - Optional provided metadata (e.g. storyteller name, era)
   */
  function extract(rawText, meta = {}) {
    if (!rawText || typeof rawText !== 'string') {
      throw new Error('Please provide story or recipe text to extract.');
    }

    const cleanedText = rawText.trim().replace(/[—–]/g, ', ');
    // Split into sentences and paragraphs
    const paragraphs = cleanedText.split(/\n+/).map(p => p.trim()).filter(Boolean);
    const sentences = cleanedText
      .replace(/([.?!])\s*(?=[A-Z0-9])/g, "$1|")
      .split("|")
      .map(s => s.trim())
      .filter(s => s.length > 3);

    // 1. Separate Family Anecdote vs Recipe Content
    const anecdoteSentences = [];
    const recipeSentences = [];

    sentences.forEach(sentence => {
      const lower = sentence.toLowerCase();
      let isAnecdote = false;

      // Check if sentence strongly matches nostalgic keywords
      const matchesAnecdote = ANECDOTE_KEYWORDS.some(kw => lower.includes(kw));
      // Check if it lacks action verbs or ingredient measurements
      const hasActionVerb = ACTION_VERBS.some(v => new RegExp(`\\b${v}\\b`, 'i').test(lower));
      const hasMeasure = /\b\d+(\s*\/\s*\d+)?\s*(cup|cups|tbsp|tsp|tablespoon|teaspoon|oz|ounce|pound|lbs|clove|pinch|stick)\b/i.test(lower);

      if (matchesAnecdote && (!hasActionVerb || !hasMeasure)) {
        isAnecdote = true;
      } else if (matchesAnecdote && (lower.includes('when') || lower.includes('back in') || lower.includes('used to say') || lower.includes('secret was always'))) {
        isAnecdote = true;
      }

      if (isAnecdote) {
        anecdoteSentences.push(sentence);
      } else {
        recipeSentences.push(sentence);
      }
    });

    // 2. Fallback if no distinct anecdote was captured
    let finalAnecdote = anecdoteSentences.join(' ');
    if (!finalAnecdote && paragraphs.length > 1) {
      // Often the first paragraph contains the oral history lore
      finalAnecdote = paragraphs[0];
    } else if (!finalAnecdote) {
      finalAnecdote = `Recalled by ${meta.storyteller || 'family member'}, preserved for future generations with all its heartfelt tradition.`;
    }

    // 3. Extract Ingredients
    const rawCandidateLines = cleanedText.split(/[.\n;]+/).map(l => l.trim()).filter(Boolean);
    const ingredients = [];
    const foundIngredientsSet = new Set();

    // Regex to match quantity + unit + item
    // Examples: "2 cans of whole San Marzano tomatoes", "4 cloves of garlic, smashed flat", "1/3 cup of good extra virgin olive oil"
    const ingredientRegex = /(?:take|need|get|grab|with|use|add|into|toss)?\s*(\d+(?:[./]\d+)?|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|half|quarter)\b)?\s*(?:a\s+)?(cups?|tablespoons?|tbsp|teaspoons?|tsp|pounds?|lbs?|ounces?|oz|grams?|cloves?|pinches?|pinch|cans?|stalks?|bunches?|slices?|sticks?|leaves?|fistfuls?|handfuls?)?\s*(?:of\s+)?([a-zA-Z\s-]+?)(?=(?:,|\band\b|first|then|next|and heat|until|for\s+\d+|in a|bake|simmer|before|$|\.))/gi;

    rawCandidateLines.forEach(line => {
      let match;
      const testLine = line.replace(/^(you need|grab|take|get|start with|for the filling:?|for the crust:?)\s*/i, '');
      
      // Look for explicit ingredient cues
      const directMatches = testLine.matchAll(ingredientRegex);
      for (const m of directMatches) {
        let rawAmount = (m[1] || '').trim();
        let unit = (m[2] || '').trim();
        let item = (m[3] || '').trim();

        // Clean up common filler words in item
        item = item.replace(/^(good|fresh|ripe|cold|pure|whole|sweet|tender|packed)\s+/i, (match) => match);
        item = item.replace(/\b(first|then|slowly|well|gently)\b/gi, '').trim();

        // Normalizing word numbers
        if (WORD_NUMBERS[rawAmount.toLowerCase()]) {
          rawAmount = WORD_NUMBERS[rawAmount.toLowerCase()];
        }

        // Deduplication & validation
        const invalidTokens = ['oven', 'degree', 'harvest', 'during', 'until', 'minute', 'minutes', 'hours', 'back in', 'the meat', 'degrees', 'seconds', 'oh honey', 'listen here', 'hear'];
        const isInvalid = invalidTokens.some(tok => item.toLowerCase().includes(tok));

        // If no unit, verify item is actually an identifiable food noun
        if (!unit) {
          const isFoodNoun = /\b(egg|eggs|garlic|onion|onions|tomatoes|tomato|basil|bay leaf|lemon|lemons|salt|pepper|oil|butter|sugar|flour|cinnamon|apple|apples|sausage|meat|ribs|pork|beef|rice|lime|lime peel|vanilla|honey|nutmeg|buttermilk|cornmeal|cheese|ricotta)\b/i.test(item);
          if (!isFoodNoun) return;
        }

        if (item.length >= 3 && !isInvalid && !ACTION_VERBS.includes(item.toLowerCase()) && item.split(' ').length < 7) {
          // Exclude conversational artifacts like "until deeply caramelized"
          if (!/^(the |until |and |for |with |to |in a |on a )/i.test(item)) {
            const key = item.toLowerCase();
            if (!foundIngredientsSet.has(key)) {
              foundIngredientsSet.add(key);
              ingredients.push({
                amount: rawAmount || '1',
                unit: unit ? unit.toLowerCase() : '',
                item: capitalize(item)
              });
            }
          }
        }
      }
    });

    // If ingredient regex didn't catch enough, do fallback search on common food staples
    if (ingredients.length < 3) {
      const fallbackStaples = [
        'flour', 'sugar', 'butter', 'eggs', 'salt', 'olive oil', 'garlic', 'tomatoes',
        'onion', 'milk', 'ricotta', 'cinnamon', 'vanilla', 'cornmeal', 'buttermilk', 'wine'
      ];
      fallbackStaples.forEach(staple => {
        if (new RegExp(`\\b${staple}\\b`, 'i').test(cleanedText) && !foundIngredientsSet.has(staple)) {
          foundIngredientsSet.add(staple);
          ingredients.push({
            amount: 'To taste',
            unit: '',
            item: capitalize(staple)
          });
        }
      });
    }

    // 4. Extract Step-by-Step Instructions
    const instructions = [];
    recipeSentences.forEach(sentence => {
      const lower = sentence.toLowerCase();
      const hasAction = ACTION_VERBS.some(v => new RegExp(`\\b${v}\\b`, 'i').test(lower));
      const hasStepWord = /\b(first|then|next|after that|finally|simmer|bake|heat|mix|pour|stir|spread|whisk|knead|let it|dust|serve)\b/i.test(lower);

      if ((hasAction || hasStepWord) && sentence.length > 15) {
        // Exclude pure nostalgic storytelling sentences
        if (!lower.includes('when papa') && !lower.includes('learned this on the porch') && !lower.includes('taught us patience')) {
          let cleanStep = sentence
            .replace(/^(oh honey,?\s*|listen here,?\s*|now here is the real secret:?\s*|you know,?\s*|like i said,?\s*|mi corazón,?\s*)/i, '')
            .trim();
          cleanStep = capitalize(cleanStep);
          if (cleanStep.length > 10 && !instructions.includes(cleanStep)) {
            instructions.push(cleanStep);
          }
        }
      }
    });

    // Fallback instructions if text was concise
    if (instructions.length === 0) {
      instructions.push(
        "Combine ingredients in a traditional baking dish or skillet as directed by family memory.",
        "Cook gently over medium heat until fragrant, golden, and thoroughly warmed through.",
        "Serve with love at the family table."
      );
    }

    // 5. Infer Title
    let title = meta.title || '';
    if (!title) {
      const storytellerName = meta.storyteller || 'Family';
      let foodType = 'Heirloom Dish';

      if (/\b(cornbread|skillet)\b/i.test(cleanedText)) foodType = 'Cast-Iron Skillet Cornbread';
      else if (/\b(arroz|rice pudding|arroz con leche)\b/i.test(cleanedText)) foodType = 'Cinnamon Arroz con Leche';
      else if (/\b(ricotta|lemon cake)\b/i.test(cleanedText)) foodType = 'Lemon Ricotta Cake';
      else if (/\b(gravy|pasta|rigatoni|san marzano)\b/i.test(cleanedText)) foodType = 'Slow-Simmered Sunday Gravy';
      else if (/\b(apple pie|pie|crust)\b/i.test(cleanedText)) foodType = 'Heritage Apple Pie';
      else if (/\b(soup|stew)\b/i.test(cleanedText)) foodType = 'Comfort Hearth Stew';
      else if (/\b(cookie|biscuit)\b/i.test(cleanedText)) foodType = 'Old-Fashioned Cookies';
      else if (/\b(bread|sourdough|loaf)\b/i.test(cleanedText)) foodType = 'Country Hearth Bread';

      title = `${storytellerName}'s ${foodType}`;
    }

    // 6. Time and Metadata Extraction
    let prepTime = '20 mins';
    let cookTime = '45 mins';

    const minMatches = cleanedText.match(/(\d+(?:\s*to\s*\d+)?)\s*(?:minutes|mins|hours|hrs)/gi);
    if (minMatches && minMatches.length > 0) {
      cookTime = minMatches[minMatches.length - 1];
    }

    // Category deduction - preserve user choice if provided
    let category = meta.category;
    if (!category || category === 'Sunday Dinners') {
      if (/\b(cornbread|bread|baking|biscuit|flour)\b/i.test(cleanedText) && !/pasta|gravy/i.test(cleanedText)) {
        category = 'Breads & Baking';
      } else if (/\b(cake|pie|cookie|sweet|dessert|arroz con leche)\b/i.test(cleanedText)) {
        category = 'Desserts & Baking';
      } else if (/\b(soup|stew|broth)\b/i.test(cleanedText)) {
        category = 'Soups & Stews';
      } else if (/\b(gravy|pasta|sausage|meat|roast)\b/i.test(cleanedText)) {
        category = 'Sunday Dinners';
      } else {
        category = 'Sunday Dinners';
      }
    }

    // Tags
    const tags = ['Family Tradition', 'Heirloom'];
    if (meta.storyteller) tags.push(meta.storyteller);
    if (category) tags.push(category);

    return {
      title: title,
      storyteller: meta.storyteller || 'Grandma',
      generation: meta.generation || 'Heirloom Keeper',
      year: meta.year || 'Circa ' + (new Date().getFullYear() - 40),
      category: category,
      prepTime: prepTime,
      cookTime: cookTime,
      servings: meta.servings || '4-6 servings',
      anecdote: finalAnecdote,
      ingredients: ingredients,
      instructions: instructions,
      tags: [...new Set(tags)],
      rawDictation: rawText,
      extractedAt: new Date().toISOString()
    };
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return {
    extract: extract
  };
})();

if (typeof window !== 'undefined') {
  window.RecipeExtractor = RecipeExtractor;
}
if (typeof globalThis !== 'undefined') {
  globalThis.RecipeExtractor = RecipeExtractor;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RecipeExtractor;
}
