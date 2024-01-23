<script>
    import { collectionId } from "./stores/location";
    /** @type {any} */
    export let config;

    /** @type {any} */
    export let collection;

</script>

<h2>{config.title}</h2>
<!-- <div class="search">
    <input type="text" placeholder="Search" />
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-search" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <circle cx="10" cy="10" r="7"></circle>
        <line x1="21" y1="21" x2="15" y2="15"></line>
     </svg>
</div> -->
<div class="table-container">
    <table cellspacing="0" cellpadding="0">
        <thead>
            <tr>
                {#if config.listFields}
                    {#each Object.entries(config.fields) as [name, field]}
                        {#if config.listFields.includes(name)}
                            <td class="list-heading-item">{field.label}</td>
                        {/if}
                    {/each}
                {:else}
                    {#each Object.values(config.fields) as field}
                        <td class="list-heading-item">{field.label}</td>
                    {/each}
                {/if}
            </tr>
        </thead>
        <tbody>
            {#each Object.entries(collection) as [id, entry] }
                <tr>
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
:global(:root) {
    --tableRowColor: #fff;
	--tableRowHoverColor: #ddd;
	--tableRowOddColor: #f7f7f7;
}
.table-container {
    overflow-x: auto;
}
table {
    width: 100%;
    border-collapse: collapse;
}
td {
    height: 4rem;
}
thead td {
    padding: 0 1rem;
}
tbody a {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    padding: 0 1rem;
    white-space: nowrap;
}
tbody tr {
    transition: all 0.3s ease;
}
tbody tr:nth-child(odd){
    background-color: var(--tableRowOddColor);
}
tbody tr:hover {
    background-color: var(--tableRowHoverColor);
}
.search {
    position: relative;
    margin-bottom: 1rem;
}
.search input {
    width: 100%;
    height: 3rem;
    padding: 0 2rem;
    border: 1px solid #f0f0f0;
    border-radius: 0;
    box-shadow: 0 2px 3px 0 rgb(0 2 4 / 5%), 0 10px 4px -8px rgb(0 2 4 / 2%);
}
.search input:not(:disabled):active, .search input:not(:disabled):focus {
    border-color: #ccc;
    outline: none;
    box-shadow: 0 2px 3px 0 rgb(0 2 4 / 10%), 0 10px 4px -4px rgb(0 2 4 / 5%);
}
.search svg {
    position: absolute;
    right: 1em;
    top: 50%;
    transform: translateY(-50%);
    height: 1rem;
}
</style>