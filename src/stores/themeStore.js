import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('themeStore', () => {
  const theme = ref('light')

  const setTheme = (newTheme) => {
    theme.value = newTheme
    const bodyElement = document.querySelector('body')
    bodyElement.setAttribute('data-bs-theme', theme.value)
  }

  return {
    theme,
    setTheme,
  }
})
