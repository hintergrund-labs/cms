<script>
    import { changes } from '$lib/stores/collections';
    import { collectionId, recordId } from '$lib/stores/location';

    /** @type {any} */
    export let record;

    /** @type {any} */
    export let config;

    $: if(record && config) {
        Object.entries(config.fields).map(([name, field]) => {
            if (field.widget === 'derived') {
                let value = record[field.source];
                if (field.mode === 'slug'){
                    value = value.toLowerCase().replace(/\s+/g, '-')
                        .replace(/[^\w\-]+/g, '')
                        .replace(/\-\-+/g, '-')
                        .replace(/^-+/, '')
                        .replace(/-+$/, '');
                }
                record[name] = value;
            }
        });
    }

    function persistLocal() {
        changes.update((changes) => {
            if ($recordId !== undefined) {
                changes[$collectionId] ??= {};
                changes[$collectionId][$recordId] ??= {};
                changes[$collectionId][$recordId] = record;
            } else {
                changes[$collectionId] ??= {};
                changes[$collectionId] = record;
            }
            return changes;
        });
    }
</script>

{#if record}
    <div class="container-record">
        {#each Object.entries(config.fields) as [name, field]}
            {#if field.hidden}
                <input type="hidden" bind:value="{record[name]}" />
            {:else}
                {#if field.widget === 'string'}
                    <div class="field">
                        <label for="{name}">{name}</label>
                        <input type="text" name="{name}" id={name} bind:value="{record[name]}" on:change={() => persistLocal()} />
                    </div>
                {:else if field.widget === 'text'}
                    <div class="field">
                        <label for="{name}">{name}</label>
                        <textarea name="{name}" id={name} rows="4" bind:value={record[name]} on:change={() => persistLocal()}></textarea>
                    </div>
                {:else if field.widget === 'number'}
                    <div class="field">
                        <label for="{name}">{name}</label>
                        <input type="number" name="{name}" id={name} bind:value="{record[name]}" on:change={() => persistLocal()} />
                    </div>
                {:else if field.widget === 'richtext'}
                    <!-- <RichEditor name={name} record={record} persistLocal={persistLocal} /> -->
                    <div class="field">
                        <label for="{name}">{name}</label>
                        <textarea name="{name}" id={name} rows="4" bind:value={record[name]} on:change={() => persistLocal()}></textarea>
                        <div class="rich-editor">
                            {@html record[name]}
                        </div>
                    </div>
                {:else if field.widget === 'checkbox'}
                    <div class="field">
                        <label for="{name}">{name}</label>
                        <button class="checkbox" on:click|self={() => record[name] = !record[name]}>
                            <input type="checkbox" name="{name}" id={name} bind:checked="{record[name]}" on:change={() => persistLocal()}/>
                        </button>
                    </div>
                {:else if field.widget === 'date'}
                    <div class="field">
                        <label for="{name}">{name}</label>
                        <input type="date" name="{name}" id={name} bind:value="{record[name]}" on:change={() => persistLocal()}/>
                    </div>
                {:else if field.widget === 'datetime'}
                    <div class="field">
                        <label for="{name}">{name}</label>
                        <input type="datetime-local" name="{name}" id={name} value="{record[name]}" on:change={() => persistLocal()}/>
                    </div>
                {:else if field.widget === 'tags'}
                    <div class="field">
                        <label for="{name}">{name}</label>
                        <input type="text" name="{name}" id={name} value="{record[name]}" on:change={() => persistLocal()}/>
                    </div>
                {:else if field.widget === 'relation'}
                    <div class="field">
                        <label for="{name}">{name}</label>
                        <input type="text" name="{name}" id={name} value="{record[name]}" on:change={() => persistLocal()}/>
                    </div>
                {:else if field.widget === 'select'}
                    <div class="field">
                        <label for="{name}">{name}</label>
                        <select name="{name}" id={name} bind:value="{record[name]}" on:change={() => persistLocal()}>
                            {#each field.options as option}
                                <option value="{option.value}">{option.label}</option>
                            {/each}
                        </select>
                    </div>
                {:else if field.widget === 'derived'}
                    <div class="field">
                        <label for="{name}">{name}</label>
                        <input type="text" name="{name}" id={name} value="{record[name]}" on:change={() => persistLocal()}/>
                    </div>
                {/if}
            {/if}
        {/each}
        <button>Commit</button>
    </div>
{/if}


<style>
.container-record {
    flex: 1 1 0;
}
.field {
    margin-bottom: 1rem;
}
.field label {
    text-transform: capitalize;
    display: block;
    border: 0;
    position: relative;
    margin: 2rem 0 0.5rem;
    font-size: 0.875rem;
}
.field input[type="text"], .field input[type="date"], .field textarea, .field .checkbox, .field .rich-editor {
    display: block;
    width: 100%;
    padding: 1rem;
    margin: 0;
    border: 1px solid #f0f0f0;
    border-radius: 0;
    box-shadow: 0 2px 3px 0 rgb(0 2 4 / 5%), 0 10px 4px -8px rgb(0 2 4 / 2%);
    position: relative;
}
.field input[type="text"]:hover, .field input[type="text"]:active, .field input[type="text"]:focus, .field input[type="date"]:hover, .field input[type="date"]:active, .field input[type="date"]:focus, .field textarea:hover, .field textarea:active, .field textarea:focus, .field .checkbox:focus-within, .field .checkbox:hover {
    outline: none;
    border-color: #ccc;
    box-shadow: 0 2px 3px 0 rgb(0 2 4 / 10%), 0 10px 4px -4px rgb(0 2 4 / 5%);
}
.field textarea {
    resize: vertical;
}
</style>