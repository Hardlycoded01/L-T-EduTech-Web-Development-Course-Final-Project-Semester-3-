// Selecting UI elements
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");
const translateBtn = document.getElementById("translateBtn");
const historyList = document.getElementById("history");

// Maximum translation history limit
const MAX_HISTORY = 10;

// Add translation entry to history
function addHistory(input, output, from, to) {
  const item = document.createElement("li");

  // History text format
  item.innerHTML = `<strong>${from} → ${to}</strong>: ${input}<br><span>${output}</span>`;

  // Start animation style
  item.style.opacity = 0;
  item.style.transform = "translateY(-20px)";

  // Add to top of history list
  historyList.prepend(item);

  // Smooth fade-in animation
  setTimeout(() => {
    item.style.transition = "all 0.5s ease";
    item.style.opacity = 1;
    item.style.transform = "translateY(0)";
  }, 50);

  // Remove oldest entries after limit reaches
  while (historyList.children.length > MAX_HISTORY) {
    historyList.removeChild(historyList.lastChild);
  }
}

// Fetch translation from API
async function translateText(text, from, to) {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
    );
    const data = await response.json();
    return data.responseData.translatedText; // Return translated text
  } catch (error) {
    return "Error: Could not fetch translation.";
  }
}

// Main translation handler
async function performTranslation() {
  const text = inputText.value.trim();
  if (!text) return; // Ignore empty input

  const from = sourceLang.value;
  const to = targetLang.value;

  outputText.value = "Translating..."; // Temporary message

  const translated = await translateText(text, from, to);
  outputText.value = translated;

  // Store result in history
  addHistory(text, translated, from, to);
}

// Translate button click
translateBtn.addEventListener("click", performTranslation);

// Auto-translate after typing stops for 1s
let typingTimer;
inputText.addEventListener("input", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(performTranslation, 1000);
});

// Auto-scroll history to top on update
const observer = new MutationObserver(() => {
  historyList.scrollTop = 0;
});
observer.observe(historyList, { childList: true });
