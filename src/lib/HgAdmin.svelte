<script>
	import { onMount } from 'svelte';
    import MainMenu from './MainMenu.svelte';
	import StepNav from './StepNav.svelte';
    import Assets from './Assets.svelte';
    import { collections, config, fetchData } from './stores/collections.js';
    import { changes } from './stores/changes.js';
    import RecordList from './RecordList.svelte';
    import Record from './Record.svelte';
    import { location, collectionId, recordId } from './stores/location.js';
	import Header from './Header.svelte';
    
    onMount(async () => {
        let data = await fetchData();
        config.set(data.config);
        collections.set(data.collections);
    });

    changes.subscribe((changes) => {
        collections.update(
            (collections) => {
                for (const [id, collection] of Object.entries(changes)) {
                    collections[id] = {...collections[id], ...collection};
                }
                return collections;
            }
        )
    });

    $: {
        if (Object.keys($changes).length > 0) {
            localStorage.setItem('changes', JSON.stringify($changes));
        }
    }

    /**
     * @param {string} collectionId
     */
    export function createNewRecord(collectionId) {
        let recId = generateId();
        const collectionConfig = $config[collectionId];
        let record = {};
        for (const [name, field] of Object.entries(collectionConfig.fields)) {
            record[name] = field.default !== undefined ? field.default : '';
        }
        changes.update((changes) => {
            /** @type {any}*/
            changes[collectionId] ??= {};
            changes[collectionId][recId] ??= {};
            changes[collectionId][recId] = record;

            return changes;
        });
        window.location.href = `#/content/${collectionId}/${recId}`;
    }
    /**
     * Generates a unique ID
     * @returns {string} - A unique ID
     */
    export function generateId() {
        return Math.random().toString(36).substring(2, 12);
    }
</script>

<div>
    <Header />
    <div class="container">
        <MainMenu />
        <main>
            <StepNav />
            <!-- /* Router -->
            {#if $location === 'content' && $config && $collectionId }
                {#if $config[$collectionId] && $config[$collectionId].hasOwnProperty('isCollection') && $config[$collectionId].isCollection}
                    {#if $recordId}
                        <Record record={$collections[$collectionId][$recordId]} config={$config[$collectionId]}/>
                    {:else}
                        <RecordList collection={$collections[$collectionId]} config={$config[$collectionId]}/>
                    {/if}
                {:else}
                    <Record record={$collections[$collectionId]} config={$config[$collectionId]}/>
                {/if}
            {:else if $location === 'assets'}
                <Assets />
            {:else if ($location === '' || $location === 'content') && $config}
                <h2>Content</h2>
                <div class="cards content">
                    {#each Object.entries($config) as [id, content]}
                        <a class="card" href="#/content/{id}">
                            <h4>
                                {content.title}
                            </h4>
                            {#if content.description}
                                <p>{content.description}</p>
                            {/if}
                            {#if content.isCollection}
                            <a href="#/content/{id}/new" on:click|preventDefault={() => createNewRecord(id)}>
                                <svg class="add-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke="#656d76" fill="none" stroke-linecap="round" stroke-linejoin="round">
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
                        <p>Images, PDF's and other files</p>
                    </a>
                </div>
                {:else}
                loading...
                {/if}
                <!-- Router */-->
            </main>
    </div>
</div>

<style>
:global(
    *,
    *::before,
    *::after
) {
    box-sizing: border-box;
}
:global(:root) {
    font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif;
    color: rgb(36, 41, 47);
}
.container {
    display: flex;
    flex-direction: row;
    min-height: calc(100vh - 3.5rem);
    background-color: #fff;
}
main {
    padding: 4rem 2rem 2rem;
    min-width: 0px;
    width: 100%;
    overflow-x: hidden;
}
h2 {
    margin: 1.5rem 0 1rem;
    scroll-margin-top: 4rem;
    line-height: 1.25;
    padding-bottom: 0.5rem;
    font-size: 1.5rem;
    border-bottom: 1px solid rgb(208, 215, 222);
    font-weight: 500;
}
.cards {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 1fr;
}
@media screen and (max-width: 768px) {
    .cards {
        grid-template-columns: 1fr;
    }
}
.card {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-color: rgb(208, 215, 222);
    border-radius: 0.375rem;
    border-style: solid;
    border-width: max(1px, 0.0625rem);
    position: relative;
    padding: 1rem;
}
.card:hover {
    background-color: rgb(246, 248, 250);
}
.card h4 {
    margin: 0;
    white-space: nowrap;
    font-weight: 600;
}
.card p {
    color: #656d76;
}
.add-icon {
    width: 2rem;
    height: 2rem;
    position: absolute;
    top: 1rem;
    right: 1rem;
    margin: 0 auto;
}
.add-icon:hover {
    fill: rgb(36, 41, 47);
    stroke: rgb(246, 248, 250);
}

/* global styles (main.css)*/
:global(a),
:global(a:visited) {
	color: rgb(36, 41, 47);
	text-decoration: none;
}
:global(.btn){
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    appearance: none;
    user-select: none;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 2rem;
    min-width: max-content;
    color: rgb(36, 41, 47);
    background-color: rgb(246, 248, 250);
    box-shadow: rgba(31, 35, 40, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset;
    border-radius: 0.375rem;
    border-width: 1px;
    border-style: solid;
    border-image: initial;
    border-color: rgba(31,35,40,0.15);
    text-decoration: none;
    padding: 0 0.75rem;
    gap: 0.5rem;
    transition: 80ms cubic-bezier(0.65,0,0.35,1);
    transition-property: color,fill,background-color,border-color;
}
:global(.btn:hover){
    background-color: rgb(243, 244, 246);
    border-color: rgba(31,35,40,0.15);
}

:global(.btn.danger){
    color: #cf222e;
    fill: #cf222e;
    background-color: #f6f8fa;
    border-color: rgba(31,35,40,0.15);
    box-shadow: 0 1px 0 rgba(31,35,40,0.04),inset 0 1px 0 rgba(255,255,255,0.25);
}
:global(.btn.danger:hover){
    color: #ffffff;
    fill: #ffffff;
    background-color: #a40e26;
    border-color: rgba(31,35,40,0.15);
    box-shadow: 0 1px 0 rgba(31,35,40,0.04);
}
:global(.btn.primary){
    color: #ffffff;
    background-color: #1f883d;
    border-color: rgba(31,35,40,0.15);
    box-shadow: 0 1px 0 rgba(31,35,40,0.1),inset 0 1px 0 rgba(255,255,255,0.03);
}
:global(.btn.primary:hover){
    background-color: #1a7f37;
    border-color: rgba(31,35,40,0.15);
}
</style>
