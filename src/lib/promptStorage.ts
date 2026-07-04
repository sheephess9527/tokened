const STORAGE_KEY = 'tokened:prompt'

export function loadSavedPrompt(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function savePrompt(prompt: string): void {
  try {
    if (prompt.trim()) {
      localStorage.setItem(STORAGE_KEY, prompt)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    /* storage unavailable */
  }
}

export function clearSavedPrompt(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable */
  }
}