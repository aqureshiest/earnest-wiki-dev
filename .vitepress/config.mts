import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Earnest Wikis',
  description: 'AI-generated documentation for GitHub repositories',
  base: '/earnest-wiki-dev/',

  // Mermaid configuration
  mermaid: {
    // Optional: configure mermaid theme and other options
  },

  themeConfig: {
    sidebar: {
      '/wikis/aqureshiest-nano-task-manager/': [
      {
            "text": "Getting Started",
            "items": [
                  {
                        "text": "Project Overview",
                        "link": "/wikis/aqureshiest-nano-task-manager/overview"
                  },
                  {
                        "text": "Getting Started",
                        "link": "/wikis/aqureshiest-nano-task-manager/getting-started"
                  },
                  {
                        "text": "Limitations & Considerations",
                        "link": "/wikis/aqureshiest-nano-task-manager/limitations-and-future"
                  }
            ],
            "collapsed": false
      },
      {
            "text": "Architecture",
            "items": [
                  {
                        "text": "Architecture & Design",
                        "link": "/wikis/aqureshiest-nano-task-manager/architecture"
                  },
                  {
                        "text": "Data Model",
                        "link": "/wikis/aqureshiest-nano-task-manager/data-model"
                  },
                  {
                        "text": "Technology Stack",
                        "link": "/wikis/aqureshiest-nano-task-manager/technology-stack"
                  }
            ],
            "collapsed": false
      },
      {
            "text": "API",
            "items": [
                  {
                        "text": "API Reference",
                        "link": "/wikis/aqureshiest-nano-task-manager/api-reference"
                  }
            ],
            "collapsed": false
      },
      {
            "text": "Implementation",
            "items": [
                  {
                        "text": "Backend Implementation",
                        "link": "/wikis/aqureshiest-nano-task-manager/backend-structure"
                  },
                  {
                        "text": "Frontend Implementation",
                        "link": "/wikis/aqureshiest-nano-task-manager/frontend-structure"
                  }
            ],
            "collapsed": false
      }
]
    },

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
}))
