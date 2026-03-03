import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'aqureshiest/nano-task-manager',
  description: 'Documentation for aqureshiest/nano-task-manager',
  base: '/aqureshiest-nano-task-manager/',

  themeConfig: {
    nav: [
  {
    "text": "Home",
    "link": "/"
  },
  {
    "text": "Documentation",
    "link": "/overview"
  }
],

    sidebar: [
  {
    "text": "Getting Started",
    "items": [
      {
        "text": "Project Overview",
        "link": "/overview"
      },
      {
        "text": "Getting Started",
        "link": "/getting-started"
      },
      {
        "text": "Limitations & Considerations",
        "link": "/limitations-and-future"
      }
    ],
    "collapsed": false
  },
  {
    "text": "Architecture",
    "items": [
      {
        "text": "Architecture & Design",
        "link": "/architecture"
      },
      {
        "text": "Data Model",
        "link": "/data-model"
      },
      {
        "text": "Technology Stack",
        "link": "/technology-stack"
      }
    ],
    "collapsed": false
  },
  {
    "text": "API",
    "items": [
      {
        "text": "API Reference",
        "link": "/api-reference"
      }
    ],
    "collapsed": false
  },
  {
    "text": "Implementation",
    "items": [
      {
        "text": "Backend Implementation",
        "link": "/backend-structure"
      },
      {
        "text": "Frontend Implementation",
        "link": "/frontend-structure"
      }
    ],
    "collapsed": false
  }
],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/aqureshiest/nano-task-manager' }
    ],

    footer: {
      message: 'Generated with Earnest AI Tools',
      copyright: 'Repository: aqureshiest/nano-task-manager'
    }
  },

  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  }
})
