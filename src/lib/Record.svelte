<script>
    import { changes } from './stores/changes';
    import { collectionId, recordId } from './stores/location';

    /** @type {any} */
    export let record;

    /** @type {any} */
    export let config;

    // Set derived
    $: if (record && config && config.fields) {
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

{#if config && record}
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
                        <input type="datetime-local" name="{name}" id={name} bind:value="{record[name]}" on:change={() => persistLocal()}/>
                    </div>
                <!-- {:else if field.widget === 'list'}
                    <div class="field">
                        <label for="{name}">{name}</label>
                        <input type="text" name="{name}" id={name} value="{record[name]}" on:change={() => persistLocal()}/>
                    </div> -->
                <!-- {:else if field.widget === 'relation'}
                    <div class="field">
                        <label for="{name}">{name}</label>
                        <input type="text" name="{name}" id={name} value="{record[name]}" on:change={() => persistLocal()}/>
                    </div> -->
                {:else if field.widget === 'select-single'}
                    <div class="field">
                        <label for="{name}">{name}</label>
                        <select name="{name}" id={name} bind:value="{record[name]}" on:change={() => persistLocal()}>
                            {#each field.options as option}
                                <option value="{option.value}">{option.label}</option>
                            {/each}
                        </select>
                    </div>
                {:else if field.widget === 'select-multiple'}
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
.field input[type="text"], .field input[type="date"], .field input[type="datetime-local"], .field textarea, .field .checkbox, .field .rich-editor, .field select, .field input[type="number"] {
    display: block;
    position: relative;
    outline: none;
    box-shadow: rgba(225, 228, 232, 0.2) 0px 2px 0px inset;
    box-sizing: border-box;
    background-color: rgb(255, 255, 255);
    border: 1px solid rgb(207, 217, 224);
    border-radius: 6px;
    color: rgb(65, 77, 99);
    font-size: 0.875rem;
    line-height: 1.25rem;
    padding: 10px 0.75rem;
    margin: 0px;
    cursor: auto;
    width: 100%;
    height: 40px;
    max-height: 40px;
}
.field input[type="text"]:active, .field input[type="text"]:focus, .field input[type="date"]:active, .field input[type="date"]:focus, .field textarea:active, .field textarea:focus, .field .checkbox:focus-within, .field select:active, .field select:focus, .field input[type="datetime-local"]:active, .field input[type="datetime-local"]:focus, input[type="number"]:active, input[type="number"]:focus {
    border-color: rgb(0, 89, 200);
    box-shadow: rgb(152, 203, 255) 0px 0px 0px 3px;
}
.field textarea {
    resize: vertical;
}
.field select {
    appearance: none;
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZT0iY3VycmVudENvbG9yIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik02IDlsNiA2bDYgLTYiIC8+PC9zdmc+") no-repeat 98.5% 50%;
}
input, select {
    vertical-align: middle;
}
</style>