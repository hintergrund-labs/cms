<script>
    import config from './content/config.json';
    import { collections } from './stores/collections';
    import { location, collectionId, recordId } from './stores/location';    
</script>

{#if $location !== ''}
<nav>
    <ol>
            <li class="link">
                <a href="#/">
                    Dashboard
                </a>
            </li>
            
            {#if $location === 'assets'}
                <li>
                    Assets
                </li>
            {:else if $collectionId && !$recordId}
                <li>{config[$collectionId].title}</li>
            {:else if $collectionId && $recordId && $collections[$collectionId] && $collections[$collectionId][$recordId]}
                    <li class="link">
                        <a href="#/content/{$collectionId}">
                            {config[$collectionId].title}
                        </a>
                    </li>
                    <li>{$collections[$collectionId][$recordId].title ?? $recordId}</li>
            {/if}
        </ol>
    </nav>
{/if}

<style>
    nav {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 0 0 6rem;
        font-size: 0.875rem;
    }
    ol {
        margin-top: 0px;
        margin-bottom: 0px;
        padding-left: 0px;
    }
    li {
        display: inline-block;
        white-space: nowrap;
        list-style: none;
    }
    a {
        color: rgb(9, 105, 218);
        display: inline-block;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
    li.link::after {
        padding-right: 0.5em;
        padding-left: 0.5em;
        color: rgb(101, 109, 118);
        content: "/";
    }
</style>