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
      '/wikis/meetearnest-pricing-service-v2/': [
      {
            "text": "Getting Started",
            "items": [
                  {
                        "text": "Service Overview",
                        "link": "/wikis/meetearnest-pricing-service-v2/service-overview"
                  },
                  {
                        "text": "Technology Stack",
                        "link": "/wikis/meetearnest-pricing-service-v2/technology-stack"
                  },
                  {
                        "text": "Local Development Setup",
                        "link": "/wikis/meetearnest-pricing-service-v2/local-development-setup"
                  }
            ],
            "collapsed": false
      },
      {
            "text": "Architecture",
            "items": [
                  {
                        "text": "Architecture Overview",
                        "link": "/wikis/meetearnest-pricing-service-v2/architecture-overview"
                  },
                  {
                        "text": "Request Flow Through the Service",
                        "link": "/wikis/meetearnest-pricing-service-v2undefined"
                  },
                  {
                        "text": "Product Domains",
                        "link": "/wikis/meetearnest-pricing-service-v2/product-domains"
                  },
                  {
                        "text": "Database Schema and Data Model",
                        "link": "/wikis/meetearnest-pricing-service-v2/data-model"
                  }
            ],
            "collapsed": false
      },
      {
            "text": "API Reference",
            "items": [
                  {
                        "text": "API Endpoints Reference",
                        "link": "/wikis/meetearnest-pricing-service-v2/api-endpoints"
                  }
            ],
            "collapsed": false
      },
      {
            "text": "Features",
            "items": [
                  {
                        "text": "Rate Management and Versioning",
                        "link": "/wikis/meetearnest-pricing-service-v2/rate-management"
                  },
                  {
                        "text": "Scoring System",
                        "link": "/wikis/meetearnest-pricing-service-v2/scoring-system"
                  },
                  {
                        "text": "State-Based Eligibility and Licensing",
                        "link": "/wikis/meetearnest-pricing-service-v2/state-eligibility"
                  },
                  {
                        "text": "Experiments and Feature Flags",
                        "link": "/wikis/meetearnest-pricing-service-v2undefined"
                  }
            ],
            "collapsed": false
      },
      {
            "text": "Development",
            "items": [
                  {
                        "text": "Testing Strategy and Practices",
                        "link": "/wikis/meetearnest-pricing-service-v2undefined"
                  },
                  {
                        "text": "Adding a New Product Type",
                        "link": "/wikis/meetearnest-pricing-service-v2undefined"
                  }
            ],
            "collapsed": false
      },
      {
            "text": "Operations",
            "items": [
                  {
                        "text": "Database Migrations with Alembic",
                        "link": "/wikis/meetearnest-pricing-service-v2undefined"
                  },
                  {
                        "text": "Deployment Pipeline and Process",
                        "link": "/wikis/meetearnest-pricing-service-v2undefined"
                  },
                  {
                        "text": "Monitoring and Observability",
                        "link": "/wikis/meetearnest-pricing-service-v2undefined"
                  },
                  {
                        "text": "Secrets Management with Vault",
                        "link": "/wikis/meetearnest-pricing-service-v2undefined"
                  },
                  {
                        "text": "Troubleshooting Common Issues",
                        "link": "/wikis/meetearnest-pricing-service-v2undefined"
                  }
            ],
            "collapsed": false
      }
],
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
