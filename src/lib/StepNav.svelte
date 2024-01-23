<script>
    import config from './content/config.json';
    import { collections } from './stores/collections';
    import { location, collectionId, recordId } from './stores/location';    
</script>

<nav class="step-nav">
    {#if $location === ''}
    <span>Dashboard</span>
    {:else}
        <a href="#/">
            <span>Dashboard</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
        </a>
        {#if $location === 'assets'}
            <span>Assets</span>
        {:else if $location === 'settings'}
            <span>Settings</span>
        {:else if $collectionId && !$recordId}
            <span>{config[$collectionId].title}</span>
        {:else if $collectionId && $recordId}
            <a href="#/content/{$collectionId}">
                <span>{config[$collectionId].title}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
            </a>
            <span>{$collections[$collectionId][$recordId].title ?? $recordId}</span>
        {/if}
    {/if}
</nav>

<style>
    .step-nav {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        font-size: 0.7rem;
        margin: 0 0 6rem;
        /* text-transform: capitalize; */
    }
    .step-nav a {
        display: flex;
        align-items: center;
        text-decoration: none;
        font-weight: 700;
    }
    .step-nav span, .step-nav svg {
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
    }
    .step-nav svg {
        width: 1rem;
        height: 1rem;
    }
</style>