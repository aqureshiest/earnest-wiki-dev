# Published Wikis

Browse comprehensive AI-generated documentation for various GitHub repositories.

<script setup>
import { data as wikis } from '../.vitepress/wikis.data.ts'
import { withBase } from 'vitepress'
</script>

<div v-if="wikis && wikis.length > 0" class="wikis-list">
  <div v-for="wiki in wikis" :key="wiki.slug" class="wiki-item">
    <h2>
      <a :href="withBase(wiki.url)">{{ wiki.title }}</a>
    </h2>
    <div class="wiki-info">
      <span class="repo-link">
        <a :href="`https://github.com/${wiki.owner}/${wiki.repo}`" target="_blank">
          {{ wiki.owner }}/{{ wiki.repo }} ↗
        </a>
      </span>
      <span class="separator">•</span>
      <span>{{ wiki.pageCount }} pages</span>
      <span class="separator">•</span>
      <span>Updated {{ new Date(wiki.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
    </div>
    <p class="wiki-desc">{{ wiki.description }}</p>
  </div>
</div>

<div v-else class="no-content">
  <p>No wikis available yet. Check back soon!</p>
</div>

<style scoped>
.wikis-list {
  margin-top: 2rem;
}

.wiki-item {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.wiki-item:last-child {
  border-bottom: none;
}

.wiki-item h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
}

.wiki-item h2 a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.wiki-item h2 a:hover {
  text-decoration: underline;
}

.wiki-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.75rem;
}

.repo-link a {
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.repo-link a:hover {
  color: var(--vp-c-brand);
  text-decoration: underline;
}

.separator {
  opacity: 0.5;
}

.wiki-desc {
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.no-content {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .wiki-item h2 {
    font-size: 1.25rem;
  }

  .wiki-info {
    font-size: 0.85rem;
  }
}
</style>
