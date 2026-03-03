import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Earnest Wikis',
  description: 'AI-generated documentation for GitHub repositories',
  base: '/earnest-wiki-dev/',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Wikis', link: '/wikis/' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/meetearnest/earnest-wiki' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Generated with Earnest AI Tools',
      copyright: 'Copyright © 2024-present'
    }
  }
})
