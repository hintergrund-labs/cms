<script>
    import { onMount } from 'svelte';
	import Spinner from './Spinner.svelte';
    let selected;
    /** @type {FileList} */
    let files;
    /** @type {File | undefined} */
    let file;
    
    // TODO: Filter based on asset type
    /** @type {{fileName: string, path: string}[]} */
    let assets = [];

    let updating = false;

    let response = {
        status: null,
        message: null
    };

    onMount(async () => {
        getAssets();
    })

    async function getAssets() {
        updating = true;
        try {
            await fetch('/hg-admin/assets')
                .then(response => response.json())
                .then(json => assets = json);
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
        updating = false;
    }

    async function fileChange(){
        if (files.length !== 1){
            return;
        }
        file = files[0];
        if (file.size > 20000000) {
            console.log("File size is too large. The maximum file size for static resources is 20MB.")
            return;
        } else if (file.size > 5000000){
            console.log("It is strongly recommended to keep the file size for static resources below 5MB. Do you want to continue with the upload anyways?")
            return;
        }
        uploadAsset();
    }

    async function uploadAsset() {
        
        if (!assets.some(asset => asset.name === file.name)) {
            
            let base64 = await readFile(file);
            let content = base64.substring(base64.indexOf('base64,') + 7);
            
            const name = file.name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s.-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');

            updating = true;
            try {
                response = await fetch("/hg-admin/assets", {
                    method: "PUT",
                    body: JSON.stringify({
                        file: name,
                        content,
                    })
                });
            } catch (error) {
                console.error('Failed to fetch:', error);
            }

            if (response.status === 200) {
                setTimeout(() => {
                    getAssets();
                }, 1000);
            } else {
                updating = false;
            }
        } else {
            console.log("File already exists");
        }
    }
    async function deleteAsset() {
        if (!selected) {
            return;
        }
        updating = true;
        try {
            response = await fetch("/hg-admin/assets", {
                method: "DELETE",
                body: JSON.stringify({
                    file: selected
                })
            });
        } catch (error) {
            console.error('Failed to fetch:', error);
        }

        if (response.status === 200) {
            assets = assets.filter(asset => asset.name !== selected);
            selected = null;
        }
        updating = false;
    }

    function readFile(file){
        return new Promise((resolve, reject) => {
            var fr = new FileReader();  
            fr.onload = () => {
                resolve(fr.result )
            };
            fr.onerror = reject;
            fr.readAsDataURL(file);
        });
    }
</script>

<div class="asset-actions">
    <a class:disabled={!selected} class="btn primary" download href={selected}>
        Download
    </a>
    <label class="btn primary">
        <!-- If element not cloned, every time, change event is not triggered if same file gets selected -->
        {#if !updating}
            <input bind:files type="file" on:change={fileChange}/>
        {/if}
        Upload
    </label>
    <button class:disabled={!selected} class="btn primary" on:click={deleteAsset}>Delete selected</button>
</div>
<div class="asset-container">
    {#if !updating}
        {#if assets}
            {#each assets as asset}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="asset-card" on:click={() => {selected = (selected === asset.name) ? null : asset.name}} class:selected={selected === asset.name}>
                <div class="asset">
                    {#if (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(asset.name)}
                        <img src={asset.download_url} alt={asset.name}/>
                    {:else if (/\.(mp4|webm|ogg|mp3|wav|m4a|aac|oga)$/i).test(asset.name)}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#666" fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" />
                            <path fill="#666" d="M16 12L10 16.3301V7.66987L16 12Z" />
                        </svg>
                    {:else}
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#666" fill-rule="evenodd" clip-rule="evenodd" d="M22 6.00086C22 3.54932 19.8148 1.6746 17.3918 2.04737L10.3918 3.1243C8.44044 3.4245 7 5.1035 7 7.07778V15.8407C6.54537 15.6248 6.0368 15.5039 5.5 15.5039C3.567 15.5039 2 17.0709 2 19.0039C2 20.9369 3.567 22.5039 5.5 22.5039C7.43296 22.5039 8.99994 20.937 9 19.004V7.07778C9 6.09064 9.72022 5.25114 10.6959 5.10104L17.6959 4.02412C18.9074 3.83773 20 4.77509 20 6.00086V12.8407C19.5454 12.6248 19.0368 12.5039 18.5 12.5039C16.567 12.5039 15 14.0709 15 16.0039C15 17.9369 16.567 19.5039 18.5 19.5039C20.433 19.5039 21.9999 17.937 22 16.004V6.00086ZM20 16.0039C20 15.1755 19.3284 14.5039 18.5 14.5039C17.6716 14.5039 17 15.1755 17 16.0039C17 16.8323 17.6716 17.5039 18.5 17.5039C19.3284 17.5039 19.9999 16.8323 20 16.0039ZM7 19.0039C7 18.1755 6.32843 17.5039 5.5 17.5039C4.67157 17.5039 4 18.1755 4 19.0039C4 19.8323 4.67157 20.5039 5.5 20.5039C6.32839 20.5039 6.99994 19.8323 7 19.0039Z" />
                        </svg>
                    {/if}
                </div>
                <div class="asset-path">
                    {asset.name}
                </div>
            </div>
            {/each}
        {/if}
    {:else}
        <Spinner />
    {/if}
</div>

<style>
.asset-actions {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
}
.asset-actions .btn {
    cursor: pointer;
}
.btn input[type="file"] {
    display: none;
}
.asset-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.asset-card {
    border: 1px solid #999;
    cursor: pointer;
}
.selected {
    /* focus blue border */
    outline: 2px solid #2781ff;
}
.asset-path {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-base-0);
    height: 4rem;
}
.asset {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16rem;
    height: 9rem;
    background-color: rgb(242, 242, 242);
    background-size: 16px 16px;
    background-position: 0px 0px, 8px 8px;
    background-image: linear-gradient(45deg, rgb(230, 230, 230) 25%, transparent 25%, transparent 75%, rgb(230, 230, 230) 75%, rgb(230, 230, 230)), linear-gradient(45deg, rgb(230, 230, 230) 25%, transparent 25%, transparent 75%, rgb(230, 230, 230) 75%, rgb(230, 230, 230));
}
.asset img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
svg {
    width: 50%;
    height: 50%;
}
</style>