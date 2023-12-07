<script>
    import config from '$lib/content/config.json';
	import { fade, slide } from 'svelte/transition';
    import { location, collectionId } from '$lib/stores/location';
    /** @type { HTMLFormElement } */
    let logoutForm;
    let contentOpen = true;
    /** @type {number} */
    let innerWidth;
    $: mobile = innerWidth < 700;
    let mobileOpen = false;
</script>

<svelte:window bind:innerWidth></svelte:window>

{#if mobile && !mobileOpen}
<button class="burger" class:open={mobileOpen} on:click={() => mobileOpen = true} in:fade={{duration: 500}}>
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-menu-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <line x1="4" y1="6" x2="20" y2="6"></line>
        <line x1="4" y1="12" x2="20" y2="12"></line>
        <line x1="4" y1="18" x2="20" y2="18"></line>
     </svg>
</button>
{/if}
<aside class:mobile class:open={mobileOpen}>
    <div class="menu-x">
        {#if mobile && mobileOpen}
        <svg on:click={() => mobileOpen = false} xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        {/if}
    </div>
    <div class="logo">
        Logo
    </div>

    <div class="main-items">
        <a class="menu-item dropdown {($location === '' || $location === 'content') ? 'active' : ''}" href="#/" on:click={()=> {if ($location === '' || !contentOpen) contentOpen = !contentOpen}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                <path d="M16 5l3 3" />
            </svg>
            <span>Content</span>
            <svg class="arrow {(contentOpen) ? "down" : ""}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <polyline points="9 6 15 12 9 18" />
              </svg>
        </a>
        {#if contentOpen}
            {#each Object.entries(config) as [id, content]}
                <a transition:slide={{duration: 200}} class="menu-item sub" href="#/content/{id}">
                    {#if $collectionId === id}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <polyline points="9 6 15 12 9 18"></polyline>
                    </svg>
                    {/if}
                    {content.title}
                </a>
            {/each}
        {/if}
        <a class="menu-item {$location === 'media' ? 'active' : ''}" href="#/media" on:click={() => contentOpen = !contentOpen}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M15 8h.01"></path>
                <path d="M12 20h-5a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v5"></path>
                <path d="M4 15l4 -4c.928 -.893 2.072 -.893 3 0l4 4"></path>
                <path d="M14 14l1 -1c.617 -.593 1.328 -.793 2.009 -.598"></path>
                <path d="M16 19h6"></path>
                <path d="M19 16v6"></path>
            </svg>
            <span>Media</span>
        </a>
    </div>
    <div>
        <a class="menu-item" href="#/settings">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-settings" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
            </svg>
        </a>       
        <a class="menu-item" on:click|preventDefault={() => {logoutForm.submit()}} href="/api/auth/logout" rel="external">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <line x1="4" y1="12" x2="14" y2="12" />
                <line x1="4" y1="12" x2="8" y2="16" />
                <line x1="4" y1="12" x2="8" y2="8" />
                <line x1="20" y1="4" x2="20" y2="20" />
                </svg>
        </a>
        <form bind:this={logoutForm} method="POST" action="/api/auth/logout"></form>
    </div>
</aside>

<style>
aside {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: rgb(68 74 87 / 5%) 0px 2px 6px 0px, rgb(68 74 87 / 10%) 0px 1px 3px 0px;
    width: 25rem;
    position: relative;
    transition: width ease-out 0.1s;
    height: 100vh;
    padding-bottom: 2rem;
}
aside.mobile {
    overflow: hidden;
    width: 0;
}
aside.mobile.open {
    width: 25rem;
}
.burger {
    position:absolute;
    padding: 2rem;
    margin: 0;
    background-color: transparent;
    appearance: none;
    border: none;
    cursor: pointer;
}
.menu-x {
    position: absolute;
    padding: 2rem;
    right: 0;
    cursor: pointer;
}
.logo {
    padding: 2rem;
    min-height: 6rem;
}
.menu-item {
    display: flex;
    align-items: center;
    height: 4rem;
    padding: 1rem 2rem;
    cursor: pointer;
    color: #000;
    font-weight: 800;
}
.menu-item span {
    flex-grow: 1;
    text-align: center;
}
.menu-item svg {
    flex-shrink: 0;
}
.menu-item:hover {
    color: #666;
}
.menu-item.active {
    background-color: #f0f0f0;
}
a {
    text-decoration: none;
    white-space: nowrap;
}
.menu-item.sub {
    height: 3.5rem;
    font-weight: 400;
}
.menu-item.sub svg {
    margin-right: 0.5rem;
}
.main-items {
    flex-grow: 1;
}
.dropdown {
    justify-content: space-between;
}
.arrow {
    margin-right: 0;
    animation: none;
    transition: transform ease-in-out 0.1s;
}
.arrow.down {
    transform: rotate(90deg);
}
svg {
    width: 1.5rem;
    height: 1.5rem;
}
.sub svg {
    width: 1rem;
}

form {
    display: none;
}
@keyframes swing { 
    0%, 30%, 50%, 70%, 100% {
    transform: rotate(0deg);
    } 10% {
    transform: rotate(10deg);
    } 40% {
    transform: rotate(-10deg);
    } 60% {
    transform: rotate(5deg);
    } 80% {
    transform: rotate(-5deg);
    }
}
</style>