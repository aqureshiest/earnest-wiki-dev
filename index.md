---
layout: home

hero:
  name: Earnest Wikis
  text: AI-Generated Documentation
  tagline: Comprehensive documentation automatically generated from GitHub repositories
  actions:
    - theme: brand
      text: Browse All Wikis
      link: /wikis/
    - theme: alt
      text: View on GitHub
      link: https://github.com/meetearnest/earnest-wiki

features:
  - icon: 🤖
    title: AI-Generated
    details: Documentation automatically created by analyzing repository code
  - icon: 🔍
    title: Comprehensive
    details: Architecture, APIs, guides, and tutorials all in one place
  - icon: ⚡
    title: Fast Search
    details: Built-in search to quickly find what you need
  - icon: 📚
    title: Always Up-to-Date
    details: Regenerate documentation whenever your code changes
---

<script setup>
import { data as wikis } from './.vitepress/wikis.data.ts'
import { withBase } from 'vitepress'
</script>

<div class="wikis-section">

## Published Documentation

<div v-if="wikis && wikis.length > 0" class="wiki-grid">
  <div v-for="wiki in wikis" :key="wiki.slug" class="wiki-card">
    <div class="wiki-card-header">
      <h3>
        <a :href="withBase(wiki.url)">{{ wiki.title }}</a>
      </h3>
      <div class="wiki-meta">
        <span class="wiki-repo">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          {{ wiki.owner }}/{{ wiki.repo }}
        </span>
        <span class="wiki-pages">📄 {{ wiki.pageCount }} pages</span>
        <span class="wiki-date">🕒 {{ new Date(wiki.generatedAt).toLocaleDateString() }}</span>
      </div>
    </div>
    <p class="wiki-description">{{ wiki.description }}</p>
    <a :href="withBase(wiki.url)" class="wiki-link">
      View Documentation →
    </a>
  </div>
</div>

<div v-else class="no-wikis">
  <p>No wikis have been published yet.</p>
  <p class="help-text">Use the <a href="https://github.com/meetearnest/earnest-ai-tools">Earnest AI Tools Wiki Agent</a> to generate comprehensive documentation!</p>
</div>

</div>

<style scoped>
.wikis-section {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1.5rem;
}

.wiki-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.wiki-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.wiki-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.wiki-card-header h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  line-height: 1.4;
}

.wiki-card-header h3 a {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 600;
}

.wiki-card-header h3 a:hover {
  text-decoration: underline;
}

.wiki-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}

.wiki-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.wiki-repo svg {
  opacity: 0.8;
}

.wiki-description {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.wiki-link {
  display: inline-flex;
  align-items: center;
  color: var(--vp-c-brand);
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  transition: gap 0.2s ease;
}

.wiki-link:hover {
  gap: 0.5rem;
}

.no-wikis {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--vp-c-text-2);
}

.help-text {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.help-text a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.help-text a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .wiki-grid {
    grid-template-columns: 1fr;
  }
}
</style>
