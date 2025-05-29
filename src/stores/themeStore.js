import { defineStore } from 'pinia'

export const useThemeStore = defineStore('themeStore', {
  state: () => ({
    theme: 'light',
  }),
  actions: {
    setTheme(newTheme) {
      this.theme = newTheme
      const bodyElement = document.querySelector('body')
      bodyElement.setAttribute('data-bs-theme', this.theme)
    },
  },
})
