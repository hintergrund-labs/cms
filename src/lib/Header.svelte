<script>
    import { changes } from './stores/changes';
    import { config } from './stores/collections.js';
    /** @type { HTMLFormElement } */
    let logoutForm;

    let confirmModal = false;

    $: if (Object.keys($changes).length === 0) {
        confirmModal = false;
    }

    function discardChange(collectionId, recordId = undefined){
        changes.update((changes) => {
            if (recordId !== undefined) {
                delete changes[collectionId][recordId];
            } else {
                delete changes[collectionId];
            }
            return changes;
        });
    }
    
    function saveChanges(){
        fetch('/hg-admin/collections', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify($changes)
        }).then(response => {
            if (response.status === 200) {
                changes.set({});
                confirmModal = false;
            }
        });
    }
</script>

{#if confirmModal}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="overlay-backdrop" on:click={() => confirmModal = false}>
    <modal-dialog class="overlay" on:click|stopPropagation>
        {#if $config}
        <div>
            <h2>Review your changes</h2>
        </div>
            <div class="changes">
                {#each Object.entries($changes) as [collectionId, collectionChanges]}
                    {#if $config[collectionId] && $config[collectionId].hasOwnProperty('isCollection') && $config[collectionId].isCollection}
                        {#each Object.entries(collectionChanges) as [recordId, change]}
                            <div class="card">
                                <div>
                                    <h4>{$config[collectionId].title}: {change.title}</h4>
                                </div>
                                <div class="change-actions">
                                    <button class="btn danger" on:click={discardChange(collectionId,recordId)}>Discard</button>
                                    <a href={`#/content/${collectionId}/${recordId}`} class="btn" on:click={() => confirmModal = false}>View Changes</a>
                                </div>
                            </div>
                        {/each}
                    {:else}
                        <div class="card">
                            <h4>{$config[collectionId].title}</h4>
                            <div class="change-actions">
                                <button class="btn danger" on:click={discardChange(collectionId)}>Discard</button>
                                <a href={`#/content/${collectionId}`} class="btn" on:click={() => confirmModal = false}>View Changes</a>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
            <div class="btn-end">
                <button class="btn" on:click={(() => confirmModal = false)}>Cancel</button>
                <button class="btn primary" on:click={saveChanges}>Save {Object.keys($changes).length > 1 ? 'All' : ''}</button>
            </div>
        {:else}
            <div><h2>No changes found</h2></div>
        {/if}
    </modal-dialog>
</div>
{/if}

<header>
    <div class="logo">
        <a href="https://github.com/hintergrund-labs/cms" style="margin-right: 1rem">
            <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 16 16" width="NaN" height="24px" fill="currentColor" style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 01-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 010 8c0-4.42 3.58-8 8-8z"></path></svg>
        </a>
        <a href="https://hintergrund.dev/">
            Hintergrund CMS
        </a>
    </div>
    <div class="header-actions">
        {#if $changes && Object.keys($changes).length > 0}
            <button class="btn primary" on:click={() => confirmModal = true}>
                Save
                <div class="btn-notification">{Object.keys($changes).length}</div>
            </button>
            
        {/if}
        <a class="sign-out" on:click|preventDefault={() => {logoutForm.submit()}} href="/hg-admin/logout" rel="external">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M3 3.25c0-.966.784-1.75 1.75-1.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.25.25 0 0 0-.25.25v17.5c0 .138.112.25.25.25h5.5a.75.75 0 0 1 0 1.5h-5.5A1.75 1.75 0 0 1 3 20.75Zm16.006 9.5H10.75a.75.75 0 0 1 0-1.5h8.256l-3.3-3.484a.75.75 0 0 1 1.088-1.032l4.5 4.75a.75.75 0 0 1 0 1.032l-4.5 4.75a.75.75 0 0 1-1.088-1.032Z"></path></svg>
        </a>
        <form bind:this={logoutForm} method="POST" action="/hg-admin/logout"></form>
    </div>
</header>

<style>
header {
    position: sticky;
    top: 0px;
    z-index: 1;
    display: flex;
    height: 3.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgb(216, 222, 228);
    background-color: rgb(255, 255, 255);
}
.logo {
    min-height: 6rem;
    display: flex;
    align-items: center;
    
}
.header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}
.btn.primary {
    position: relative;
}
.btn-notification {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
    width: 1.25rem;
    height: 1.25rem;
    background-color: #cf352f;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.75rem;
    color: #fff;
    border: 2px solid #fff;
    font-weight: 900;
}
.sign-out {
    display: flex;
}
.overlay-backdrop {
    align-items: center;
    background-color: rgba(175,184,193,0.2);
    bottom: 0;
    display: flex;
    justify-content: center;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 999;
}
.overlay {
    background-color: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(31,35,40,0.12), 0 8px 24px rgba(66,74,83,0.12);
    display: flex;
    flex-direction: column;
    max-height: min(100vh - 2rem, 600px);
    min-width: 192px;
    opacity: 1;
    white-space: normal;
    width: min(600px,100vw - 4rem);
}
modal-dialog h2 {
    margin: 1.5rem 0 1rem;
    scroll-margin-top: 4rem;
    line-height: 1.25;
    padding: 0.5rem;
    font-size: 1.5rem;
    border-bottom: 1px solid rgb(208, 215, 222);
    font-weight: 500;
}
.changes {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid rgb(208, 215, 222);
}
.card {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-color: rgb(208, 215, 222);
    border-radius: 0.375rem;
    border-style: solid;
    border-width: max(1px, 0.0625rem);
    position: relative;
    padding: 1rem;
}
.card h4 {
    margin-top: 0;
    white-space: nowrap;
    font-weight: 600;
}
.card .change-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.btn-end {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
    gap: 1rem;
}
</style>