<script lang="ts">
  // Svelte 5 Runes for state management
  let query = $state('');
  let results = $state<any[]>([]);
  let loading = $state(false);

  async function handleSearch() {
    if (!query) return;
    loading = true;

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({ query }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      results = data.matches;
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }
</script>

<div class="container">
  <h1>Semantic Search</h1>
  
  <div class="search-box">
    <input 
      type="text" 
      bind:value={query} 
      placeholder="Ask about Svelte or Typescript..."
    />
    <button onclick={handleSearch} disabled={loading}>
      {loading ? 'Searching...' : 'Search'}
    </button>
  </div>

  <div class="results">
    {#each results as match}
      <div class="card">
        <h3>{match.metadata.title} <span class="score">({(match.score * 100).toFixed(0)}%)</span></h3>
        <p>{match.metadata.text}</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .container { max-width: 600px; margin: 2rem auto; font-family: sans-serif; }
  .search-box { display: flex; gap: 10px; margin-bottom: 2rem; }
  .card { padding: 1rem; border: 1px solid #ddd; margin-bottom: 1rem; border-radius: 8px; }
  .score { color: #888; font-size: 0.8rem; }
</style>