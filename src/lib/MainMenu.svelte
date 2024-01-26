<script>
    import config from './content/config.json';
	import { fade, slide } from 'svelte/transition';
    import { location, collectionId } from './stores/location';
    
    let contentOpen = true;
</script>

<aside>
    <div class="box">
        <div class="label">
            Content
        </div>
        {#each Object.entries(config) as [id, content]}
            <a class:active={$collectionId === id} class="menu-item" href="#/content/{id}">
                <span >{content.title}</span>
            </a>
        {/each}
        <div class="ruler"></div>
        <a class:active={$location === 'assets'} class="menu-item"  href="#/assets">
            <span>Assets</span>
        </a>
    </div>
</aside>

<style>
aside {
    display: block;
    border-right: 1px solid rgb(216, 222, 228);
}
.box {
    position: sticky;
    top: 3.5rem;
    height: calc(100vh - 3.5rem);
    width: 260px;
    padding: 1rem 0.5rem 0;
}
a {
    display: block;
    position: relative;
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    padding: 0.325rem 0.5rem;
    border-radius: 0.325rem;
    transition: background 33ms linear 0s;
    color: rgb(36, 41, 47);
    cursor: pointer;
    appearance: none;
    background: unset;
    border: unset;
    width: calc(100% - 16px);
    font-family: unset;
    text-align: unset;
    margin-top: unset;
    margin-bottom: unset;
}
a:hover {
    background-color: rgba(208, 215, 222, 0.32);
}
a.active {
    background-color: rgba(208, 215, 222, 0.24)
}
.label {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgb(87, 96, 106);
    padding: 0.75rem 1rem;
}
.ruler {
    height: 1px;
    background-color: rgba(208, 215, 222, 0.48);
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}
.active span::before {
    content: '';
    position: absolute;
    left: -0.5rem;
    top: 0;
    bottom: 0;
    width: 0.25rem;
    background-color: rgb(9, 105, 218);
    border-radius: 0.25rem;
}
</style>