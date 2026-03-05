---
layout: home

hero:
  name: Earnest Wikis
  text: AI-Generated Documentation
  tagline: Comprehensive documentation automatically generated from GitHub repositories
  image:
    src: /hero-docs.svg
    alt: Wiki Documentation
  actions:
    - theme: brand
      text: Browse All Wikis
      link: /wikis/
    - theme: alt
      text: Generate Wiki
      link: https://earnest-ai-tools.staging.earnest.com/wiki-agent
---

<script setup>
import { data as wikis } from './.vitepress/wikis.data.ts'
import { withBase } from 'vitepress'
</script>

<div class="wikis-section">

## Published Documentation

<div v-if="wikis && wikis.length > 0">
  <div class="wikis-table">
    <div class="table-header">
      <div class="col-repo">Repository</div>
      <div class="col-description">Description</div>
      <div class="col-stats">Stats</div>
      <div class="col-actions"></div>
    </div>
    <div v-for="wiki in wikis" :key="wiki.slug" class="table-row">
      <div class="col-repo">
        <a :href="withBase(wiki.url)" class="wiki-title">{{ wiki.title }}</a>
        <a :href="`https://github.com/${wiki.owner}/${wiki.repo}`" target="_blank" class="github-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
            <path d="M9 18c-4.51 2-5-2-7-2"/>
          </svg>
          {{ wiki.owner }}/{{ wiki.repo }}
        </a>
      </div>
      <div class="col-description">
        <p>{{ wiki.description }}</p>
      </div>
      <div class="col-stats">
        <span class="stat-item">
          <span class="stat-label">Pages</span>
          <span class="stat-value">{{ wiki.pageCount }}</span>
        </span>
        <span class="stat-item">
          <span class="stat-label">Updated</span>
          <span class="stat-value">{{ new Date(wiki.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
        </span>
      </div>
      <div class="col-actions">
        <a :href="withBase(wiki.url)" class="view-button">
          View Docs →
        </a>
      </div>
    </div>
  </div>
</div>

<div v-else class="no-wikis">
  <p>No wikis have been published yet.</p>
  <p class="help-text">Use the <a href="https://earnest-ai-tools.staging.earnest.com/wiki-agent">Earnest AI Tools Wiki Agent</a> to generate comprehensive documentation!</p>
</div>

</div>

<style scoped>
.wikis-section {
  max-width: 1400px;
  margin: 3rem auto;
  padding: 0 1.5rem;
}

.wikis-section h2 {
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
}

.wikis-table {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 3fr 1.5fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 3fr 1.5fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}


.col-repo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.wiki-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  text-decoration: none;
  transition: color 0.2s ease;
}

.wiki-title:hover {
  color: var(--vp-c-brand-dark);
  text-decoration: underline;
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s ease;
}

.github-link:hover {
  color: var(--vp-c-brand);
}

.github-link svg {
  flex-shrink: 0;
}

.col-description p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.col-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.stat-label {
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}

.stat-value {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.col-actions {
  display: flex;
  justify-content: flex-end;
}

.view-button {
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand-3);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.view-button:hover {
  background: var(--vp-c-brand-soft);
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

@media (max-width: 1024px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .table-header {
    display: none;
  }

  .table-row {
    padding: 1.5rem;
  }

  .col-stats {
    flex-direction: row;
    gap: 1.5rem;
  }

  .col-actions {
    justify-content: flex-start;
  }

  .view-button {
    display: inline-block;
    width: auto;
  }
}
</style>
