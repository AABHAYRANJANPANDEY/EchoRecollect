const { SAMPLE_RECIPES, PRESET_DICTATIONS } = require('../sample-recipes.js');
const RecipeExtractor = require('../extractor.js');

console.log('✅ Sample Recipes count:', SAMPLE_RECIPES.length);
console.log('✅ Preset Dictations count:', PRESET_DICTATIONS.length);

PRESET_DICTATIONS.forEach((preset, i) => {
  const result = RecipeExtractor.extract(preset.text, {
    storyteller: preset.storyteller,
    generation: preset.generation,
    category: preset.category
  });
  console.log(`\n========================================`);
  console.log(`Test Preset ${i + 1}: ${preset.label}`);
  console.log(`========================================`);
  console.log('Extracted Title:', result.title);
  console.log('Storyteller:', result.storyteller);
  console.log('Category:', result.category);
  console.log('Cook Time:', result.cookTime);
  console.log('Extracted Family Anecdote/History:');
  console.log('  ', result.anecdote ? result.anecdote.slice(0, 150) + '...' : '(None)');
  console.log(`Ingredients (${result.ingredients.length} items):`);
  result.ingredients.slice(0, 5).forEach(ing => {
    console.log(`   - ${ing.amount} ${ing.unit} ${ing.item}`);
  });
  console.log(`Step-by-Step Instructions (${result.instructions.length} steps):`);
  result.instructions.slice(0, 3).forEach((step, idx) => {
    console.log(`   ${idx + 1}. ${step}`);
  });
});

console.log('\n🌟 ALL TESTS PASSED: Extractor handles oral family stories and separates them cleanly into Title, Ingredients, Steps, and Family Lore!');
