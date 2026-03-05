import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    title: "Earnest Wikis",
    description: "AI-generated documentation for GitHub repositories",
    base: "/earnest-wiki-dev/",
    ignoreDeadLinks: true,

    // Mermaid configuration
    mermaid: {
      // Optional: configure mermaid theme and other options
    },

    themeConfig: {
      sidebar: {
'/wikis/meetearnest-data-airflow-dags/': [
            {
                  'text': 'Getting Started',
                  'items': [
                        {
                              'text': 'Repository Overview',
                              'link': '/wikis/meetearnest-data-airflow-dags/overview'
                        },
                        {
                              'text': 'System Architecture',
                              'link': '/wikis/meetearnest-data-airflow-dags/architecture'
                        },
                        {
                              'text': 'Local Development Setup',
                              'link': '/wikis/meetearnest-data-airflow-dags/local-development-setup'
                        },
                        {
                              'text': 'Deployment Guide',
                              'link': '/wikis/meetearnest-data-airflow-dags/deployment-guide'
                        }
                  ],
                  'collapsed': false
            },
            {
                  'text': 'DAG Development',
                  'items': [
                        {
                              'text': 'DAG Organization and Structure',
                              'link': '/wikis/meetearnest-data-airflow-dags/dag-organization'
                        },
                        {
                              'text': 'DAG Builder Framework',
                              'link': '/wikis/meetearnest-data-airflow-dags/dag-builder-framework'
                        },
                        {
                              'text': 'Creating New DAGs',
                              'link': '/wikis/meetearnest-data-airflow-dags/creating-new-dags'
                        },
                        {
                              'text': 'Data Flow Patterns',
                              'link': '/wikis/meetearnest-data-airflow-dags/data-flow-patterns'
                        }
                  ],
                  'collapsed': false
            },
            {
                  'text': 'DAG Reference',
                  'items': [
                        {
                              'text': 'Extract DAGs',
                              'link': '/wikis/meetearnest-data-airflow-dags/extract-dags'
                        },
                        {
                              'text': 'Transform DAGs',
                              'link': '/wikis/meetearnest-data-airflow-dags/transform-dags'
                        },
                        {
                              'text': 'Custom Script DAGs',
                              'link': '/wikis/meetearnest-data-airflow-dags/custom-script-dags'
                        },
                        {
                              'text': 'Maintenance DAGs',
                              'link': '/wikis/meetearnest-data-airflow-dags/maintenance-dags'
                        }
                  ],
                  'collapsed': false
            },
            {
                  'text': 'DBT Integration',
                  'items': [
                        {
                              'text': 'DBT Integration',
                              'link': '/wikis/meetearnest-data-airflow-dags/dbt-integration'
                        },
                        {
                              'text': 'DBT Models Reference',
                              'link': '/wikis/meetearnest-data-airflow-dags/dbt-models-reference'
                        },
                        {
                              'text': 'Adding DBT Models',
                              'link': '/wikis/meetearnest-data-airflow-dags/adding-dbt-models'
                        }
                  ],
                  'collapsed': false
            },
            {
                  'text': 'Infrastructure & Integrations',
                  'items': [
                        {
                              'text': 'Database Abstraction Layer',
                              'link': '/wikis/meetearnest-data-airflow-dags/database-abstraction'
                        },
                        {
                              'text': 'Data Warehouse Connections',
                              'link': '/wikis/meetearnest-data-airflow-dags/data-warehouses'
                        },
                        {
                              'text': 'S3 Storage Patterns',
                              'link': '/wikis/meetearnest-data-airflow-dags/s3-storage'
                        },
                        {
                              'text': 'External System Integrations',
                              'link': '/wikis/meetearnest-data-airflow-dags/external-integrations'
                        }
                  ],
                  'collapsed': false
            },
            {
                  'text': 'Utilities Reference',
                  'items': [
                        {
                              'text': 'Common Utilities',
                              'link': '/wikis/meetearnest-data-airflow-dags/common-utilities'
                        },
                        {
                              'text': 'Configuration Management',
                              'link': '/wikis/meetearnest-data-airflow-dags/configuration-management'
                        }
                  ],
                  'collapsed': false
            },
            {
                  'text': 'Operations',
                  'items': [
                        {
                              'text': 'Testing Strategy',
                              'link': '/wikis/meetearnest-data-airflow-dags/testing-strategy'
                        },
                        {
                              'text': 'Monitoring and Alerting',
                              'link': '/wikis/meetearnest-data-airflow-dags/monitoring-alerting'
                        },
                        {
                              'text': 'Troubleshooting Guide',
                              'link': '/wikis/meetearnest-data-airflow-dags/troubleshooting'
                        }
                  ],
                  'collapsed': false
            }
      ]
      },

      nav: [
        { text: "Home", link: "/" },
        { text: "Wikis", link: "/wikis/" },
      ],

      socialLinks: [
        { icon: "github", link: "https://github.com/meetearnest/earnest-wiki" },
      ],

      search: {
        provider: "local",
      },

      footer: {
        message: "Generated with Earnest AI Tools",
      },
    },
  }),
);
