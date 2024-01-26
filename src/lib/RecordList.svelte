<script>
    import { collectionId } from "./stores/location";
    /** @type {any} */
    export let config;

    /** @type {any} */
    export let collection;

    let selected = [];
</script>

<h2>{config.title}</h2>

{#if selected.length > 0}
<div class="btn-list">
    <button class="btn" on:click={() => {
    }}>Duplicate</button>
    <button class="btn danger" on:click={() => {
    }}>Delete</button>
</div>
{/if}

<div class="table-container">
    <table cellspacing="0" cellpadding="0">
        <thead>
            <tr>
                <th class="checkbox">
                    <input type="checkbox" checked={selected.length === Object.keys(collection).length} on:click={() => {
                        if (selected.length === Object.keys(collection).length) {
                            selected = [];
                        } else {
                            selected = Object.keys(collection);
                        }
                    }}/>
                </th>
                {#if config.listFields}
                    {#each Object.entries(config.fields) as [name, field]}
                        {#if config.listFields.includes(name)}
                            <th class="list-heading-item">{field.label}</th>
                        {/if}
                    {/each}
                {:else}
                    {#each Object.values(config.fields) as field}
                        <th class="list-heading-item">{field.label}</th>
                    {/each}
                {/if}
            </tr>
        </thead>
        <tbody>
            {#each Object.entries(collection) as [id, entry] }
                <tr class:selected={selected.includes(id)}>
                    <td class="list-item-item checkbox" on:click={() => {
                            let index = selected.indexOf(id);
                            if (index > -1) {
                                selected = selected.filter((_, i) => i !== index);
                            } else {
                                selected = [...selected, id];
                            }
                        }}>
                        <input type="checkbox" checked={selected.includes(id)} />
                    </td>
                    {#if config.listFields}
                        {#each Object.keys(config.fields) as name}
                            {#if config.listFields.includes(name)}
                                <td class="list-item-item">
                                    <a class="list-item" href="#/content/{$collectionId}/{id}">
                                        {typeof entry[name] === 'string' && (entry[name]).length > 30 ? (entry[name]).substring(0, 30) + "..." : entry[name]}
                                    </a>
                                </td>
                            {/if}
                        {/each}
                    {:else}
                        {#each Object.keys(config.fields) as name}
                            <td class="list-item-item">
                                <a class="list-item" href="#/content/{$collectionId}/{id}">
                                    {typeof entry[name] === 'string' && (entry[name]).length > 30 ? (entry[name]).substring(0, 30) + "..." : entry[name]}
                                </a>
                            </td>
                        {/each}
                    {/if}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
h2 {
    margin: 1.5rem 0 1rem;
    scroll-margin-top: 4rem;
    line-height: 1.25;
    padding-bottom: 0.5rem;
    font-size: 1.5rem;
    font-weight: 500;
}
.table-container {
    overflow-x: auto;
}
table {
    width: 100%;
    background-color: rgb(255, 255, 255);
    border-spacing: 0px;
    border-collapse: separate;
    font-size: 0.875rem;
    table-layout: fixed;
}
tr.selected {
    background-color: rgb(246, 248, 250);
}
th {
    color: rgb(101, 109, 118);
    font-weight: 600;
    padding: 1rem 1.5rem;
    text-align: start;
    white-space: nowrap;
}
.checkbox {
    width: 2rem;
}
td.checkbox {
    padding: 1rem 1.5rem;
}
th, td {
    border-bottom: 1px solid rgb(208, 215, 222);
    overflow: hidden;
}

tbody a {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    padding: 1rem 1.5rem;
    white-space: nowrap;
}
tbody tr {
    transition: all 0.3s ease;
}
tbody tr:hover {
    background-color: rgb(246, 248, 250);
}
.btn-list {
    display: flex;
    justify-content: start;
    margin-bottom: 1rem;
    gap: 1rem;
}
</style>