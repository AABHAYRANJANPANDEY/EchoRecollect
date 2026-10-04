/**
 * EchoRecollect — Main Application Controller
 * Handles Voice Memo logging, Speech Recognition, AI Extraction review,
 * Digital Cookbook Library, Printable Keepsake Cards, and Settings.
 */

(function () {
  'use strict';

  // Storage Keys
  const STORAGE_RECIPES_KEY = 'echorecollect_recipes_v1';
  const STORAGE_SETTINGS_KEY = 'echorecollect_settings_v1';

  // Application State
  const state = {
    recipes: [],
    settings: {
      familyName: 'The Rossi Family Cookbook',
      subtitle: 'Preserving recipes, memories, and wisdom passed through generations.',
      theme: 'warm'
    },
    activeTab: 'logger',
    activeCategory: 'ALL',
    searchQuery: '',
    storytellerFilter: 'ALL',
    sortBy: 'NEWEST',
    isRecording: false,
    speechRecognition: null,
    audioVisualizerTimer: null,
    currentExtracted: null,
    activeDetailRecipe: null
  };

  // DOM Elements Cache
  const elements = {
    // Navigation & Tabs
    tabNavLogger: document.getElementById('tabNavLogger'),
    tabNavLibrary: document.getElementById('tabNavLibrary'),
    tabNavSettings: document.getElementById('tabNavSettings'),
    loggerPanel: document.getElementById('loggerPanel'),
    libraryPanel: document.getElementById('libraryPanel'),
    settingsPanel: document.getElementById('settingsPanel'),
    libraryCountBadge: document.getElementById('libraryCountBadge'),

    // Branding & Header
    headerFamilyBadge: document.getElementById('headerFamilyBadge'),
    headerFamilyNameText: document.getElementById('headerFamilyNameText'),
    heroFamilyTitleText: document.getElementById('heroFamilyTitleText'),
    heroSubtitleText: document.getElementById('heroSubtitleText'),
    heroEditNameBtn: document.getElementById('heroEditNameBtn'),
    footerFamilyName: document.getElementById('footerFamilyName'),
    quickThemeToggle: document.getElementById('quickThemeToggle'),
    quickExportAllBtn: document.getElementById('quickExportAllBtn'),

    // Hero Stats
    statRecipeCount: document.getElementById('statRecipeCount'),
    statStorytellersCount: document.getElementById('statStorytellersCount'),
    statPrintableCount: document.getElementById('statPrintableCount'),

    // Voice Memo & Story Logger
    dictationText: document.getElementById('dictationText'),
    inputStoryteller: document.getElementById('inputStoryteller'),
    inputGeneration: document.getElementById('inputGeneration'),
    inputCategory: document.getElementById('inputCategory'),
    micBtn: document.getElementById('micBtn'),
    micBtnLabel: document.getElementById('micBtnLabel'),
    recordingTimer: document.getElementById('recordingTimer'),
    simAudioBtn: document.getElementById('simAudioBtn'),
    waveformCanvas: document.getElementById('waveformCanvas'),
    waveformNotice: document.getElementById('waveformNotice'),
    clearDictationBtn: document.getElementById('clearDictationBtn'),
    extractBtn: document.getElementById('extractBtn'),
    extractBtnLabel: document.getElementById('extractBtnLabel'),
    presetChipsContainer: document.getElementById('presetChipsContainer'),

    // AI Extractor Review Card
    extractorEmptyState: document.getElementById('extractorEmptyState'),
    extractedResultCard: document.getElementById('extractedResultCard'),
    extractedTitle: document.getElementById('extractedTitle'),
    extractedStorytellerBadge: document.getElementById('extractedStorytellerBadge'),
    extractedPrepTime: document.getElementById('extractedPrepTime'),
    extractedCookTime: document.getElementById('extractedCookTime'),
    extractedServings: document.getElementById('extractedServings'),
    extractedAnecdote: document.getElementById('extractedAnecdote'),
    extractedIngredientsList: document.getElementById('extractedIngredientsList'),
    extractedInstructionsList: document.getElementById('extractedInstructionsList'),
    addIngredientBtn: document.getElementById('addIngredientBtn'),
    addInstructionBtn: document.getElementById('addInstructionBtn'),
    saveExtractedBtn: document.getElementById('saveExtractedBtn'),
    printExtractedDirectBtn: document.getElementById('printExtractedDirectBtn'),

    // Library Controls & Grid
    librarySearchInput: document.getElementById('librarySearchInput'),
    clearLibrarySearchBtn: document.getElementById('clearLibrarySearchBtn'),
    libraryStorytellerFilter: document.getElementById('libraryStorytellerFilter'),
    librarySortFilter: document.getElementById('librarySortFilter'),
    categoryPillsRow: document.getElementById('categoryPillsRow'),
    recipesGrid: document.getElementById('recipesGrid'),
    libraryEmptyState: document.getElementById('libraryEmptyState'),
    btnGoToRecord: document.getElementById('btnGoToRecord'),

    // Settings
    settingFamilyName: document.getElementById('settingFamilyName'),
    settingFamilySubtitle: document.getElementById('settingFamilySubtitle'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    themeOptions: document.querySelectorAll('.theme-card-option'),
    exportArchiveBtn: document.getElementById('exportArchiveBtn'),
    importArchiveFile: document.getElementById('importArchiveFile'),
    resetSampleDataBtn: document.getElementById('resetSampleDataBtn'),

    // Modals
    recipeDetailModal: document.getElementById('recipeDetailModal'),
    closeDetailModalBtn: document.getElementById('closeDetailModalBtn'),
    modalTopCategory: document.getElementById('modalTopCategory'),
    modalCoverImg: document.getElementById('modalCoverImg'),
    modalStorytellerHeader: document.getElementById('modalStorytellerHeader'),
    modalTitle: document.getElementById('modalTitle'),
    modalPrepTime: document.getElementById('modalPrepTime'),
    modalCookTime: document.getElementById('modalCookTime'),
    modalServings: document.getElementById('modalServings'),
    modalAnecdote: document.getElementById('modalAnecdote'),
    modalAnecdoteAuthor: document.getElementById('modalAnecdoteAuthor'),
    modalIngredientsList: document.getElementById('modalIngredientsList'),
    modalInstructionsList: document.getElementById('modalInstructionsList'),
    modalCopyTextBtn: document.getElementById('modalCopyTextBtn'),
    modalPrintCardBtn: document.getElementById('modalPrintCardBtn'),

    // Print Keepsake Card Modal
    printModal: document.getElementById('printModal'),
    closePrintModalBtn: document.getElementById('closePrintModalBtn'),
    triggerBrowserPrintBtn: document.getElementById('triggerBrowserPrintBtn'),
    printCardFamilyName: document.getElementById('printCardFamilyName'),
    printCardRecipeTitle: document.getElementById('printCardRecipeTitle'),
    printCardMetaLine: document.getElementById('printCardMetaLine'),
    printCardAnecdote: document.getElementById('printCardAnecdote'),
    printCardIngredientsList: document.getElementById('printCardIngredientsList'),
    printCardStepsList: document.getElementById('printCardStepsList'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer')
  };

  /* ==========================================================
     Initialization
     ========================================================== */
  function init() {
    loadSettings();
    loadRecipes();
    initSpeechRecognition();
    setupCanvasVisualizer();
    setupEventListeners();
    renderAll();
  }

  /* ==========================================================
     Storage & State Handlers
     ========================================================== */
  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) {
        state.settings = Object.assign(state.settings, JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load settings from localStorage', e);
    }
    applySettingsToUI();
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(state.settings));
      applySettingsToUI();
      showToast('Settings saved successfully!');
    } catch (e) {
      console.error('Failed to save settings', e);
      showToast('Could not save settings.');
    }
  }

  function applySettingsToUI() {
    const { familyName, subtitle, theme } = state.settings;
    document.documentElement.setAttribute('data-theme', theme || 'warm');

    if (elements.headerFamilyNameText) elements.headerFamilyNameText.textContent = familyName;
    if (elements.heroFamilyTitleText) elements.heroFamilyTitleText.textContent = familyName;
    if (elements.heroSubtitleText) elements.heroSubtitleText.textContent = subtitle;
    if (elements.footerFamilyName) elements.footerFamilyName.textContent = familyName;
    if (elements.printCardFamilyName) elements.printCardFamilyName.textContent = familyName;

    if (elements.settingFamilyName) elements.settingFamilyName.value = familyName;
    if (elements.settingFamilySubtitle) elements.settingFamilySubtitle.value = subtitle;

    // Theme selector cards
    elements.themeOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.themeName === theme);
    });
  }

  function loadRecipes() {
    try {
      const saved = localStorage.getItem(STORAGE_RECIPES_KEY);
      if (saved) {
        state.recipes = JSON.parse(saved);
      } else if (typeof SAMPLE_RECIPES !== 'undefined' && Array.isArray(SAMPLE_RECIPES)) {
        state.recipes = JSON.parse(JSON.stringify(SAMPLE_RECIPES));
        saveRecipesToStorage();
      }
    } catch (e) {
      console.warn('Could not load recipes from localStorage', e);
      if (typeof SAMPLE_RECIPES !== 'undefined') {
        state.recipes = JSON.parse(JSON.stringify(SAMPLE_RECIPES));
      }
    }
  }

  function saveRecipesToStorage() {
    try {
      localStorage.setItem(STORAGE_RECIPES_KEY, JSON.stringify(state.recipes));
    } catch (e) {
      console.error('Failed to save recipes to localStorage', e);
    }
  }

  /* ==========================================================
     Navigation & Tab Management
     ========================================================== */
  function switchTab(tabName) {
    state.activeTab = tabName;

    // Nav buttons
    elements.tabNavLogger.classList.toggle('active', tabName === 'logger');
    elements.tabNavLibrary.classList.toggle('active', tabName === 'library');
    elements.tabNavSettings.classList.toggle('active', tabName === 'settings');

    // Tab panels
    elements.loggerPanel.classList.toggle('active', tabName === 'logger');
    elements.libraryPanel.classList.toggle('active', tabName === 'library');
    elements.settingsPanel.classList.toggle('active', tabName === 'settings');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ==========================================================
     Voice Memo & Speech Recognition
     ========================================================== */
  let recordStartTime = 0;
  let timerInterval = null;

  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      elements.micBtn.title = 'Speech Recognition is not supported in this browser. Use simulated dictation or type directly.';
      return;
    }

    state.speechRecognition = new SpeechRecognition();
    state.speechRecognition.continuous = true;
    state.speechRecognition.interimResults = true;
    state.speechRecognition.lang = 'en-US';

    state.speechRecognition.onstart = () => {
      state.isRecording = true;
      elements.micBtn.classList.add('recording');
      elements.micBtnLabel.textContent = 'Listening... (Click to stop)';
      startRecordingTimer();
      startVisualizerAnimation();
      elements.waveformNotice.textContent = 'Live audio recording & transcribing...';
    };

    state.speechRecognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      if (currentTranscript.trim()) {
        const existing = elements.dictationText.value;
        elements.dictationText.value = existing ? existing + ' ' + currentTranscript : currentTranscript;
        elements.dictationText.scrollTop = elements.dictationText.scrollHeight;
      }
    };

    state.speechRecognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      stopRecording();
      showToast('Microphone note: ' + event.error);
    };

    state.speechRecognition.onend = () => {
      stopRecording();
    };
  }

  function toggleSpeechRecording() {
    if (!state.speechRecognition) {
      showToast('Web Speech API not supported in this browser. Trying simulated dictation!');
      simulateRelativeAudioDictation();
      return;
    }

    if (state.isRecording) {
      state.speechRecognition.stop();
      stopRecording();
    } else {
      try {
        state.speechRecognition.start();
      } catch (err) {
        console.error('Failed to start speech recognition', err);
        stopRecording();
      }
    }
  }

  function startRecordingTimer() {
    recordStartTime = Date.now();
    elements.recordingTimer.textContent = '00:00';
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - recordStartTime) / 1000);
      const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const secs = String(elapsed % 60).padStart(2, '0');
      elements.recordingTimer.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  function stopRecording() {
    state.isRecording = false;
    elements.micBtn.classList.remove('recording');
    elements.micBtnLabel.textContent = 'Start Microphone Dictation';
    clearInterval(timerInterval);
    stopVisualizerAnimation();
    elements.waveformNotice.textContent = 'Speech audio level visualizer active when speaking';
  }

  /* Audio Waveform Canvas Animation */
  let animFrameId = null;
  let canvasCtx = null;
  let wavePhase = 0;

  function setupCanvasVisualizer() {
    const canvas = elements.waveformCanvas;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth || 500;
    canvas.height = canvas.offsetHeight || 48;
    canvasCtx = canvas.getContext('2d');
    drawIdleWave();
  }

  function drawIdleWave() {
    if (!canvasCtx) return;
    const { width, height } = elements.waveformCanvas;
    canvasCtx.clearRect(0, 0, width, height);

    canvasCtx.beginPath();
    canvasCtx.moveTo(0, height / 2);
    canvasCtx.strokeStyle = 'rgba(200, 90, 50, 0.2)';
    canvasCtx.lineWidth = 2;
    for (let x = 0; x < width; x += 5) {
      const y = height / 2 + Math.sin(x * 0.03) * 3;
      canvasCtx.lineTo(x, y);
    }
    canvasCtx.stroke();
  }

  function startVisualizerAnimation() {
    cancelAnimationFrame(animFrameId);
    function animate() {
      if (!state.isRecording) return;
      const { width, height } = elements.waveformCanvas;
      canvasCtx.clearRect(0, 0, width, height);

      canvasCtx.beginPath();
      canvasCtx.moveTo(0, height / 2);
      canvasCtx.strokeStyle = '#C85A32';
      canvasCtx.lineWidth = 2.5;

      wavePhase += 0.12;
      for (let x = 0; x < width; x += 4) {
        const amplitude = (Math.sin(x * 0.05 + wavePhase) + Math.cos(x * 0.02 + wavePhase * 1.5)) * 12;
        const y = height / 2 + amplitude;
        canvasCtx.lineTo(x, y);
      }
      canvasCtx.stroke();

      animFrameId = requestAnimationFrame(animate);
    }
    animate();
  }

  function stopVisualizerAnimation() {
    cancelAnimationFrame(animFrameId);
    drawIdleWave();
  }

  /* Simulated Audio & Dictation Typing Effect */
  let simulationRunning = false;

  function simulateRelativeAudioDictation() {
    if (simulationRunning) return;
    simulationRunning = true;

    // Pick preset 1 or 2
    const preset = (typeof PRESET_DICTATIONS !== 'undefined' && PRESET_DICTATIONS.length > 0)
      ? PRESET_DICTATIONS[Math.floor(Math.random() * PRESET_DICTATIONS.length)]
      : {
          label: "Grandma's Dictation",
          storyteller: "Grandma Rosa",
          generation: "1st Generation",
          category: "Sunday Dinners",
          text: "Back in 1952 in Brooklyn, my mother Carmela always made this in the cold winter months..."
        };

    elements.inputStoryteller.value = preset.storyteller || 'Grandma Rosa';
    elements.inputGeneration.value = preset.generation || 'Circa 1952';
    elements.inputCategory.value = preset.category || 'Sunday Dinners';
    elements.dictationText.value = '';

    elements.simAudioBtn.disabled = true;
    elements.simAudioBtn.innerHTML = '🔊 <em>Dictating audio...</em>';
    state.isRecording = true;
    startRecordingTimer();
    startVisualizerAnimation();

    const fullText = preset.text;
    let charIdx = 0;
    const speed = 12; // chars per tick for smooth natural streaming

    const typerInterval = setInterval(() => {
      charIdx += speed;
      elements.dictationText.value = fullText.substring(0, charIdx);
      elements.dictationText.scrollTop = elements.dictationText.scrollHeight;

      if (charIdx >= fullText.length) {
        clearInterval(typerInterval);
        simulationRunning = false;
        elements.simAudioBtn.disabled = false;
        elements.simAudioBtn.innerHTML = '🔊 <span>Simulate Relative Dictation</span>';
        stopRecording();
        showToast('Voice memo finished dictating! Click "Extract Recipe & Lore".');
      }
    }, 45);
  }

  /* Preset Loaders */
  function loadPresetDictation(idx) {
    if (typeof PRESET_DICTATIONS === 'undefined' || !PRESET_DICTATIONS[idx]) return;
    const preset = PRESET_DICTATIONS[idx];
    elements.inputStoryteller.value = preset.storyteller;
    elements.inputGeneration.value = preset.generation;
    elements.inputCategory.value = preset.category;
    elements.dictationText.value = preset.text;
    showToast(`Loaded ${preset.storyteller}'s dictation.`);
  }

  /* ==========================================================
     AI Recipe & Story Extractor Logic
     ========================================================== */
  function handleExtract() {
    const rawText = elements.dictationText.value.trim();
    if (!rawText) {
      showToast('Please type or dictate a recipe story first!');
      elements.dictationText.focus();
      return;
    }

    // Set UI to loading state
    elements.extractBtn.disabled = true;
    elements.extractBtnLabel.textContent = '✨ Extracting lore & steps...';

    // Simulate smooth processing transition (feels like real AI intelligence)
    setTimeout(() => {
      try {
        const metadata = {
          storyteller: elements.inputStoryteller.value.trim() || 'Grandma',
          generation: elements.inputGeneration.value.trim() || 'Heirloom Keeper',
          category: elements.inputCategory.value || 'Sunday Dinners'
        };

        const result = RecipeExtractor.extract(rawText, metadata);
        state.currentExtracted = result;

        renderExtractedReviewCard(result);

        elements.extractorEmptyState.style.display = 'none';
        elements.extractedResultCard.style.display = 'block';
        elements.extractedResultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        showToast('Successfully extracted recipe & family lore!');
      } catch (err) {
        console.error('Extraction error:', err);
        showToast('Extraction note: ' + err.message);
      } finally {
        elements.extractBtn.disabled = false;
        elements.extractBtnLabel.textContent = 'Extract Recipe & Family Lore';
      }
    }, 600);
  }

  function renderExtractedReviewCard(data) {
    elements.extractedTitle.value = data.title || 'Untitled Heirloom Recipe';
    elements.extractedStorytellerBadge.textContent = data.storyteller || 'Family Member';
    elements.extractedPrepTime.value = data.prepTime || '20 mins';
    elements.extractedCookTime.value = data.cookTime || '45 mins';
    elements.extractedServings.value = data.servings || '4-6';
    elements.extractedAnecdote.value = data.anecdote || '';

    // Render Ingredients
    elements.extractedIngredientsList.innerHTML = '';
    (data.ingredients || []).forEach((ing, index) => {
      addIngredientRowToEditor(ing.amount, ing.unit, ing.item);
    });

    // Render Instructions
    elements.extractedInstructionsList.innerHTML = '';
    (data.instructions || []).forEach((step, index) => {
      addInstructionRowToEditor(step);
    });
  }

  function addIngredientRowToEditor(amount = '1', unit = '', item = '') {
    const row = document.createElement('div');
    row.className = 'ingredient-item-row';
    row.innerHTML = `
      <input type="text" class="ing-amount-input" placeholder="Amount" value="${escapeHtml(amount)}">
      <input type="text" class="ing-unit-input" placeholder="Unit" value="${escapeHtml(unit)}">
      <input type="text" class="ing-desc-input" placeholder="Ingredient name & notes" value="${escapeHtml(item)}">
      <button type="button" class="remove-row-btn" title="Remove ingredient">✕</button>
    `;
    row.querySelector('.remove-row-btn').addEventListener('click', () => row.remove());
    elements.extractedIngredientsList.appendChild(row);
  }

  function addInstructionRowToEditor(stepText = '') {
    const row = document.createElement('div');
    row.className = 'step-item-row';
    const currentCount = elements.extractedInstructionsList.children.length + 1;
    row.innerHTML = `
      <span class="step-num-badge">${currentCount}</span>
      <textarea class="step-text-input" placeholder="Cooking step description...">${escapeHtml(stepText)}</textarea>
      <button type="button" class="remove-row-btn" title="Remove step">✕</button>
    `;
    row.querySelector('.remove-row-btn').addEventListener('click', () => {
      row.remove();
      updateStepNumbersInEditor();
    });
    elements.extractedInstructionsList.appendChild(row);
  }

  function updateStepNumbersInEditor() {
    const rows = elements.extractedInstructionsList.querySelectorAll('.step-item-row');
    rows.forEach((row, i) => {
      const badge = row.querySelector('.step-num-badge');
      if (badge) badge.textContent = i + 1;
    });
  }

  function gatherExtractedDataFromEditor() {
    const title = elements.extractedTitle.value.trim() || 'Untitled Heirloom Recipe';
    const storyteller = elements.inputStoryteller.value.trim() || 'Family Member';
    const generation = elements.inputGeneration.value.trim() || 'Heirloom Keeper';
    const category = elements.inputCategory.value || 'Sunday Dinners';
    const prepTime = elements.extractedPrepTime.value.trim() || '20 mins';
    const cookTime = elements.extractedCookTime.value.trim() || '45 mins';
    const servings = elements.extractedServings.value.trim() || '4-6';
    const anecdote = elements.extractedAnecdote.value.trim();

    // Gather ingredients
    const ingredients = [];
    const ingRows = elements.extractedIngredientsList.querySelectorAll('.ingredient-item-row');
    ingRows.forEach(row => {
      const amount = row.querySelector('.ing-amount-input').value.trim();
      const unit = row.querySelector('.ing-unit-input').value.trim();
      const item = row.querySelector('.ing-desc-input').value.trim();
      if (item) {
        ingredients.push({ amount, unit, item });
      }
    });

    // Gather steps
    const instructions = [];
    const stepRows = elements.extractedInstructionsList.querySelectorAll('.step-item-row');
    stepRows.forEach(row => {
      const text = row.querySelector('.step-text-input').value.trim();
      if (text) instructions.push(text);
    });

    // Default image matching category or hero
    let image = 'assets/images/hero_banner.jpg';
    if (category.toLowerCase().includes('dessert') || title.toLowerCase().includes('cake')) {
      image = 'assets/images/lemon_ricotta.jpg';
    } else if (category.toLowerCase().includes('pie') || title.toLowerCase().includes('pie')) {
      image = 'assets/images/apple_pie.jpg';
    }

    return {
      id: 'recipe-' + Date.now(),
      title,
      storyteller,
      generation,
      year: metadataYear(generation),
      category,
      image,
      prepTime,
      cookTime,
      servings,
      tags: ['Family Tradition', storyteller, category],
      isFavorite: false,
      anecdote,
      ingredients,
      instructions,
      rawDictation: elements.dictationText.value.trim(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
  }

  function metadataYear(gen) {
    const match = gen.match(/\b(19\d\d|20\d\d)\b/);
    return match ? match[1] : 'Circa ' + (new Date().getFullYear() - 30);
  }

  function handleSaveExtractedToCookbook() {
    const newRecipe = gatherExtractedDataFromEditor();
    state.recipes.unshift(newRecipe);
    saveRecipesToStorage();
    renderAll();

    showToast(`Saved "${newRecipe.title}" to Digital Cookbook Library!`);
    switchTab('library');
  }

  function handlePrintExtractedDirectly() {
    const tempRecipe = gatherExtractedDataFromEditor();
    openPrintCardModal(tempRecipe);
  }

  /* ==========================================================
     Digital Cookbook Library: Render, Search, Filter & Actions
     ========================================================== */
  function renderAll() {
    renderLibraryStorytellersFilter();
    renderCookbookGrid();
    updateStatsAndBadges();
  }

  function updateStatsAndBadges() {
    const total = state.recipes.length;
    elements.libraryCountBadge.textContent = total;
    elements.statRecipeCount.textContent = total;
    elements.statPrintableCount.textContent = `${total} Cards`;

    const uniqueStorytellers = new Set(state.recipes.map(r => r.storyteller).filter(Boolean));
    elements.statStorytellersCount.textContent = uniqueStorytellers.size || 1;
  }

  function renderLibraryStorytellersFilter() {
    const select = elements.libraryStorytellerFilter;
    const currentVal = select.value;
    const storytellers = [...new Set(state.recipes.map(r => r.storyteller).filter(Boolean))].sort();

    select.innerHTML = '<option value="ALL">All Family Storytellers</option>';
    storytellers.forEach(st => {
      const opt = document.createElement('option');
      opt.value = st;
      opt.textContent = st;
      select.appendChild(opt);
    });

    if (storytellers.includes(currentVal)) {
      select.value = currentVal;
    }
  }

  function renderCookbookGrid() {
    const grid = elements.recipesGrid;
    const query = state.searchQuery.toLowerCase().trim();
    const category = state.activeCategory;
    const storyteller = state.storytellerFilter;
    const sortBy = state.sortBy;

    let filtered = state.recipes.filter(recipe => {
      // Category filter
      if (category === 'FAVORITES' && !recipe.isFavorite) return false;
      if (category !== 'ALL' && category !== 'FAVORITES' && recipe.category !== category) return false;

      // Storyteller filter
      if (storyteller !== 'ALL' && recipe.storyteller !== storyteller) return false;

      // Search query filter (matches title, ingredients, storyteller, anecdote)
      if (query) {
        const titleMatch = (recipe.title || '').toLowerCase().includes(query);
        const stMatch = (recipe.storyteller || '').toLowerCase().includes(query);
        const anecdoteMatch = (recipe.anecdote || '').toLowerCase().includes(query);
        const ingMatch = (recipe.ingredients || []).some(i => (i.item || '').toLowerCase().includes(query));
        if (!titleMatch && !stMatch && !anecdoteMatch && !ingMatch) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'NEWEST') {
        return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
      } else if (sortBy === 'OLDEST') {
        return (a.year || '').localeCompare(b.year || '');
      } else if (sortBy === 'TITLE_AZ') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
      elements.libraryEmptyState.style.display = 'flex';
      return;
    } else {
      elements.libraryEmptyState.style.display = 'none';
    }

    filtered.forEach(recipe => {
      const card = createRecipeCardElement(recipe);
      grid.appendChild(card);
    });
  }

  function createRecipeCardElement(recipe) {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.dataset.id = recipe.id;

    const fallbackImg = 'assets/images/hero_banner.jpg';
    const imgSrc = recipe.image || fallbackImg;
    const isFav = recipe.isFavorite;

    card.innerHTML = `
      <div class="card-img-container">
        <img src="${imgSrc}" alt="${escapeHtml(recipe.title)}" loading="lazy">
        <button class="card-favorite-btn ${isFav ? 'favorited' : ''}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}" aria-label="Favorite recipe">
          ${isFav ? '❤️' : '🤍'}
        </button>
        <span class="card-category-badge">${escapeHtml(recipe.category || 'Family Tradition')}</span>
      </div>

      <div class="card-content">
        <div class="card-storyteller-line">
          <span>👵</span> <span>${escapeHtml(recipe.storyteller || 'Family')}</span>
          <span style="opacity:0.6;">· ${escapeHtml(recipe.year || '')}</span>
        </div>
        <h3 class="card-recipe-title">
          <a href="#" class="view-recipe-link">${escapeHtml(recipe.title)}</a>
        </h3>
        <p class="card-anecdote-quote">
          "${escapeHtml(recipe.anecdote || 'A cherished recipe preserved for our family table.')}"
        </p>

        <div class="card-cooking-meta">
          <span class="meta-item">⏱️ ${escapeHtml(recipe.prepTime || '15 mins')}</span>
          <span class="meta-item">🔥 ${escapeHtml(recipe.cookTime || '45 mins')}</span>
          <span class="meta-item">🥣 ${(recipe.ingredients || []).length} items</span>
        </div>
      </div>

      <div class="card-actions-bar">
        <button class="view-recipe-btn" type="button">
          Read & Cook <span>→</span>
        </button>
        <div class="card-action-icons">
          <button class="card-tool-btn print-btn" title="Print Keepsake Card" aria-label="Print Card">🖨️</button>
          <button class="card-tool-btn delete-btn" title="Delete Recipe" aria-label="Delete Recipe">🗑️</button>
        </div>
      </div>
    `;

    // Events
    const favBtn = card.querySelector('.card-favorite-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      recipe.isFavorite = !recipe.isFavorite;
      favBtn.classList.toggle('favorited', recipe.isFavorite);
      favBtn.textContent = recipe.isFavorite ? '❤️' : '🤍';
      saveRecipesToStorage();
      if (state.activeCategory === 'FAVORITES') {
        renderCookbookGrid();
      }
    });

    const openRecipeHandler = (e) => {
      e.preventDefault();
      openRecipeDetailModal(recipe);
    };

    card.querySelector('.view-recipe-link').addEventListener('click', openRecipeHandler);
    card.querySelector('.view-recipe-btn').addEventListener('click', openRecipeHandler);

    card.querySelector('.print-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openPrintCardModal(recipe);
    });

    card.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Are you sure you want to remove "${recipe.title}" from your cookbook?`)) {
        state.recipes = state.recipes.filter(r => r.id !== recipe.id);
        saveRecipesToStorage();
        renderAll();
        showToast('Recipe removed.');
      }
    });

    return card;
  }

  /* ==========================================================
     Recipe Detail / Cook-Along Modal
     ========================================================== */
  function openRecipeDetailModal(recipe) {
    state.activeDetailRecipe = recipe;

    elements.modalTopCategory.textContent = recipe.category || 'Family Heirloom';
    elements.modalCoverImg.src = recipe.image || 'assets/images/hero_banner.jpg';
    elements.modalStorytellerHeader.textContent = `👵 Recalled by ${recipe.storyteller || 'Family'} · ${recipe.generation || ''} (${recipe.year || ''})`;
    elements.modalTitle.textContent = recipe.title;

    elements.modalPrepTime.textContent = recipe.prepTime || '20 mins';
    elements.modalCookTime.textContent = recipe.cookTime || '45 mins';
    elements.modalServings.textContent = recipe.servings || '4-6';

    elements.modalAnecdote.textContent = `"${recipe.anecdote || 'A treasured family memory.'}"`;
    elements.modalAnecdoteAuthor.textContent = `— Told by ${recipe.storyteller || 'Our Family'}`;

    // Ingredients Checklist
    elements.modalIngredientsList.innerHTML = '';
    (recipe.ingredients || []).forEach(ing => {
      const label = document.createElement('label');
      label.className = 'checklist-item';
      label.innerHTML = `
        <input type="checkbox">
        <span><strong>${escapeHtml(ing.amount || '')} ${escapeHtml(ing.unit || '')}</strong> ${escapeHtml(ing.item)}</span>
      `;
      const checkbox = label.querySelector('input');
      checkbox.addEventListener('change', () => {
        label.classList.toggle('checked', checkbox.checked);
      });
      elements.modalIngredientsList.appendChild(label);
    });

    // Step-by-Step Instructions
    elements.modalInstructionsList.innerHTML = '';
    (recipe.instructions || []).forEach((step, idx) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'modal-step-item';
      stepDiv.innerHTML = `
        <span class="modal-step-badge">${idx + 1}</span>
        <div class="modal-step-text">${escapeHtml(step)}</div>
      `;
      elements.modalInstructionsList.appendChild(stepDiv);
    });

    elements.recipeDetailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeRecipeDetailModal() {
    elements.recipeDetailModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function copyFormattedRecipeText(recipe) {
    if (!recipe) return;
    const text = `
=== ${recipe.title} ===
Family: ${state.settings.familyName}
Storyteller: ${recipe.storyteller} (${recipe.year})
Category: ${recipe.category}
Prep: ${recipe.prepTime} | Cook: ${recipe.cookTime} | Servings: ${recipe.servings}

FAMILY LORE & MEMORIES:
"${recipe.anecdote}"

INGREDIENTS:
${(recipe.ingredients || []).map(i => `• ${i.amount} ${i.unit} ${i.item}`).join('\n')}

INSTRUCTIONS:
${(recipe.instructions || []).map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

Preserved with EchoRecollect
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      showToast('Recipe & story copied to clipboard!');
    }).catch(err => {
      console.warn('Clipboard write failed', err);
      showToast('Could not copy automatically.');
    });
  }

  /* ==========================================================
     Print & Export Keepsake Card Modal
     ========================================================== */
  function openPrintCardModal(recipe) {
    if (!recipe) return;

    elements.printCardFamilyName.textContent = state.settings.familyName;
    elements.printCardRecipeTitle.textContent = recipe.title;
    elements.printCardMetaLine.textContent = `Recalled by ${recipe.storyteller || 'Family'} · ${recipe.year || ''} · Prep: ${recipe.prepTime || '20m'} · Cook: ${recipe.cookTime || '45m'} · Servings: ${recipe.servings || '4-6'}`;
    elements.printCardAnecdote.textContent = `"${recipe.anecdote || 'A cherished family memory.'}"`;

    // Ingredients
    elements.printCardIngredientsList.innerHTML = '';
    (recipe.ingredients || []).forEach(ing => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${escapeHtml(ing.amount)} ${escapeHtml(ing.unit)}</strong> ${escapeHtml(ing.item)}`;
      elements.printCardIngredientsList.appendChild(li);
    });

    // Steps
    elements.printCardStepsList.innerHTML = '';
    (recipe.instructions || []).forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      elements.printCardStepsList.appendChild(li);
    });

    elements.printModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePrintModal() {
    elements.printModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function triggerPrint() {
    window.print();
  }

  /* ==========================================================
     Archive Backup, Import & Export
     ========================================================== */
  function exportArchiveJSON() {
    const archiveData = {
      familyTitle: state.settings.familyName,
      subtitle: state.settings.subtitle,
      exportedAt: new Date().toISOString(),
      recipes: state.recipes
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(archiveData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    const sanitizedFamily = (state.settings.familyName || 'FamilyCookbook').replace(/[^a-zA-Z0-9_-]/g, '_');
    dlAnchor.setAttribute('download', `${sanitizedFamily}_EchoRecollect_Backup.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();

    showToast('Cookbook backup downloaded!');
  }

  function importArchiveJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (Array.isArray(parsed.recipes)) {
          state.recipes = parsed.recipes;
          if (parsed.familyTitle) state.settings.familyName = parsed.familyTitle;
          if (parsed.subtitle) state.settings.subtitle = parsed.subtitle;

          saveSettings();
          saveRecipesToStorage();
          renderAll();
          showToast(`Successfully imported ${parsed.recipes.length} family recipes!`);
          switchTab('library');
        } else {
          showToast('Invalid archive file format.');
        }
      } catch (err) {
        console.error('Failed to parse archive file', err);
        showToast('Error reading JSON file.');
      }
    };
    reader.readAsText(file);
  }

  function resetSampleRecipes() {
    if (confirm('Reset your cookbook to the initial starter heirloom recipes? Any unsaved edits will be replaced.')) {
      if (typeof SAMPLE_RECIPES !== 'undefined') {
        state.recipes = JSON.parse(JSON.stringify(SAMPLE_RECIPES));
        saveRecipesToStorage();
        renderAll();
        showToast('Reset to starter heirloom recipes.');
      }
    }
  }

  /* ==========================================================
     Toast Notifications
     ========================================================== */
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span><span>${escapeHtml(message)}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================
     Event Listeners Setup
     ========================================================== */
  function setupEventListeners() {
    // Navigation Tabs
    elements.tabNavLogger.addEventListener('click', () => switchTab('logger'));
    elements.tabNavLibrary.addEventListener('click', () => switchTab('library'));
    elements.tabNavSettings.addEventListener('click', () => switchTab('settings'));
    elements.btnGoToRecord.addEventListener('click', () => switchTab('logger'));

    // Header Family Badge & Hero Edit Name
    const openSettingsForName = () => {
      switchTab('settings');
      elements.settingFamilyName.focus();
      elements.settingFamilyName.select();
    };
    elements.headerFamilyBadge.addEventListener('click', openSettingsForName);
    elements.heroEditNameBtn.addEventListener('click', openSettingsForName);

    // Quick Theme Toggle
    elements.quickThemeToggle.addEventListener('click', () => {
      const themes = ['warm', 'parchment', 'midnight', 'rosewood'];
      const nextIdx = (themes.indexOf(state.settings.theme) + 1) % themes.length;
      state.settings.theme = themes[nextIdx];
      saveSettings();
    });

    elements.quickExportAllBtn.addEventListener('click', exportArchiveJSON);

    // Voice Recorder
    elements.micBtn.addEventListener('click', toggleSpeechRecording);
    elements.simAudioBtn.addEventListener('click', simulateRelativeAudioDictation);

    // Presets
    const presetBtns = elements.presetChipsContainer.querySelectorAll('.preset-chip');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.presetIdx, 10);
        loadPresetDictation(idx);
      });
    });

    // Clear Dictation
    elements.clearDictationBtn.addEventListener('click', () => {
      elements.dictationText.value = '';
      showToast('Text cleared.');
    });

    // AI Extractor Trigger
    elements.extractBtn.addEventListener('click', handleExtract);

    // Extractor Editor Controls
    elements.addIngredientBtn.addEventListener('click', () => addIngredientRowToEditor());
    elements.addInstructionBtn.addEventListener('click', () => addInstructionRowToEditor());
    elements.saveExtractedBtn.addEventListener('click', handleSaveExtractedToCookbook);
    elements.printExtractedDirectBtn.addEventListener('click', handlePrintExtractedDirectly);

    // Library Search & Filters
    elements.librarySearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      elements.clearLibrarySearchBtn.style.display = state.searchQuery ? 'block' : 'none';
      renderCookbookGrid();
    });

    elements.clearLibrarySearchBtn.addEventListener('click', () => {
      elements.librarySearchInput.value = '';
      state.searchQuery = '';
      elements.clearLibrarySearchBtn.style.display = 'none';
      renderCookbookGrid();
    });

    elements.libraryStorytellerFilter.addEventListener('change', (e) => {
      state.storytellerFilter = e.target.value;
      renderCookbookGrid();
    });

    elements.librarySortFilter.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderCookbookGrid();
    });

    // Category Pills
    const pills = elements.categoryPillsRow.querySelectorAll('.category-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.activeCategory = pill.dataset.cat;
        renderCookbookGrid();
      });
    });

    // Settings
    elements.saveSettingsBtn.addEventListener('click', () => {
      state.settings.familyName = elements.settingFamilyName.value.trim() || 'Our Family Cookbook';
      state.settings.subtitle = elements.settingFamilySubtitle.value.trim();
      saveSettings();
    });

    elements.themeOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        state.settings.theme = opt.dataset.themeName;
        saveSettings();
      });
    });

    elements.exportArchiveBtn.addEventListener('click', exportArchiveJSON);
    elements.importArchiveFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importArchiveJSON(e.target.files[0]);
      }
    });
    elements.resetSampleDataBtn.addEventListener('click', resetSampleRecipes);

    // Modals
    elements.closeDetailModalBtn.addEventListener('click', closeRecipeDetailModal);
    elements.modalCopyTextBtn.addEventListener('click', () => copyFormattedRecipeText(state.activeDetailRecipe));
    elements.modalPrintCardBtn.addEventListener('click', () => {
      closeRecipeDetailModal();
      openPrintCardModal(state.activeDetailRecipe);
    });

    elements.closePrintModalBtn.addEventListener('click', closePrintModal);
    elements.triggerBrowserPrintBtn.addEventListener('click', triggerPrint);

    // Close modals on clicking overlay backdrop
    elements.recipeDetailModal.addEventListener('click', (e) => {
      if (e.target === elements.recipeDetailModal) closeRecipeDetailModal();
    });
    elements.printModal.addEventListener('click', (e) => {
      if (e.target === elements.printModal) closePrintModal();
    });

    // Close modals on ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeRecipeDetailModal();
        closePrintModal();
      }
    });

    // Window resize waveform canvas
    window.addEventListener('resize', () => {
      if (elements.waveformCanvas) {
        elements.waveformCanvas.width = elements.waveformCanvas.offsetWidth || 500;
        elements.waveformCanvas.height = elements.waveformCanvas.offsetHeight || 48;
        if (!state.isRecording) drawIdleWave();
      }
    });
  }

  // Self-boot
  document.addEventListener('DOMContentLoaded', init);
})();
