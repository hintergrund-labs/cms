<script>
	import { onMount } from 'svelte';
    import MainMenu from './MainMenu.svelte';
	import StepNav from './StepNav.svelte';
    import Assets from './Assets.svelte';
    import { collections, changes } from './stores/collections.js';
    import RecordList from './RecordList.svelte';
    import Record from './Record.svelte';
    import { location, collectionId, recordId } from './stores/location.js';
    import { generateId } from './utils.js';

	// TODO: fetch from API
	import configFile from './content/config.json';
	import globalsFile from './content/globals.json';
	import todosFile from './content/todos.json';
    let content = { };
    
    $: collections.set(content);
    $: config = $collections.config;

	onMount(async () => {
        // Fetch content
        try {
            setTimeout(() => {
                content = { config: configFile, globals: globalsFile, todos: todosFile}
            }, 1000);
            await fetch('/hg-admin/collections')
                .then(response => response.json())
                .then(json => content = json);
        } catch (error) {
            console.error('Failed to fetch:', error);
        }

		// Content changes store
		changes.subscribe((/** @type {{ [s: string]: any; }} */ changes) => {
            if (Object.keys(changes).length > 0) {
                localStorage.setItem('changes', JSON.stringify(changes));
                collections.update(
                    (/** @type {{ [x: string]: any; }} */ collections) => {
                        for (const [id, collection] of Object.entries(changes)) {
                            collections[id] = {...collections[id], ...collection};
                        }
                        return collections;
                    }
                );
            }
        });
	});
    
    // $: commitFiles = Object.keys($changes).map((id) => {
    //     return {[id]: $collections[id]};
    // });

    
    /**
     * @param {string} collectionId
     */
    function createRecord(collectionId){
        let recId = generateId();
        const collectionConfig = config[collectionId];
        let record = {};
        for (const [name, field] of Object.entries(collectionConfig.fields)) {
            record[name] = field.default !== undefined ? field.default : '';
        }
        changes.update(changes => {
            /** @type {any}*/
            changes[collectionId] ??= {};
            changes[collectionId][recId] ??= {};
            changes[collectionId][recId] = record;

            return changes;
        });
        window.location.href = `#/content/${collectionId}/${recId}`;
    }
</script>

<!-- <svelte:options customElement="hintergrund-admin" /> -->

<div class="container">
    <MainMenu />
    <main>
        <StepNav />
		<!-- /* Router -->
		{#if $location === 'content' && $collectionId && config}
            {#if config[$collectionId].hasOwnProperty('isCollection') && config[$collectionId].isCollection}
                {#if $recordId}
                    <Record record={$collections[$collectionId][$recordId]} config={config[$collectionId]}/>
                {:else}
                    <RecordList collection={$collections[$collectionId]} config={config[$collectionId]}/>
                {/if}
            {:else}
                <Record record={$collections[$collectionId]} config={config[$collectionId]}/>
            {/if}
        {:else if $location === 'assets'}
            <Assets />
        {:else if $location === 'settings'}
            settings
        {:else if ($location === '' || $location === 'content') && config}
            <h2>Content</h2>
            <div class="cards content">
                {#each Object.entries(config) as [id, content]}
                    <a class="card" href="#/content/{id}">
                        <h4>
                            {content.title}
                        </h4>
                        {#if content.isCollection}
                        <a href="#/content/{id}/new" on:click|preventDefault={() => createRecord(id)}>
                            <svg class="add-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <circle cx="12" cy="12" r="9"></circle>
                                <line x1="9" y1="12" x2="15" y2="12"></line>
                                <line x1="12" y1="9" x2="12" y2="15"></line>
                            </svg>
                        </a>
                        {/if}
                    </a>
                {/each}
            </div>

            <h2>Assets</h2>
            <div class="cards">
                <a class="card" href="#/assets">
                    <h4>Assets</h4>
                </a>
            </div>
            {:else}
            loading...
            {/if}
            <!-- Router */-->
        </main>
</div>

<style>
.container {
    display: flex;
    min-height: 100vh;
    font-family: sans-serif;
    background-color: #fff;
    color: #333;
}
main {
    padding: 8rem 2rem 2rem;
    width: 100%;
    overflow-x: hidden;
}
h2 {
    margin-top: 2rem;
}
.cards {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
}
@media screen and (max-width: 1200px) {
    .cards {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
@media screen and (max-width: 900px) {
    .cards {
        grid-template-columns: 1fr 1fr;
    }
}
@media screen and (max-width: 600px) {
    .cards {
        grid-template-columns: 1fr;
    }
}
.card {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 8rem;
    background-color: #f0f0f0;
    position: relative;
}
.card:hover {
    background-color: #ddd;
}
.card h4 {
    position: absolute;
    top: 0;
    left: 0;
    padding: 1rem;
    white-space: nowrap;
}
.add-icon {
    width: 2rem;
    height: 2rem;
    display: block;
    margin: 0 auto;
}
.add-icon:hover {
    fill: #000;
    stroke: #ddd;
}

/* global styles (main.css)*/
:global(a),
:global(a:visited) {
	color: var(--txtPrimaryColor);
	text-decoration: none;
}

:global(.btn) {
	color: inherit;
	background-color: var(--fg);
	color: var(--bg);
	padding: 0.5rem 1rem;
	border-radius: 5px;
	display: flex;
	align-items: center;
}

:global(h1) {
	font-size: min(10vw, 4rem);
	font-weight: 600;
	margin: 0;
	text-align: center;
	top: 10vh;
	left: 0;
	width: 100%;
	padding: 0 2.5rem;
	box-sizing: border-box;
	line-height: 1;
}
</style>
