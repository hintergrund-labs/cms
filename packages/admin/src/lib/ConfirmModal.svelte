<script>
	import { createEventDispatcher } from 'svelte';
    export let trueText = '';
    export let falseText = '';
	const dispatch = createEventDispatcher();

    /**
     * Dispatches boolean of the select event
     * @param {boolean} selection
     */
    function select(selection) {
		dispatch('select', {
			selection
        });
	}
</script>

<div class="modal">
    <div class="inner">
        <div class="modal-content">
            <slot></slot>
            <div class="buttons">
                {#if falseText}
                    <button class="btn secondary" on:click={() => select(false)}>{falseText}</button>
                {/if}
                {#if trueText}
                    <button class="btn primary" on:click={() => select(true)}>{trueText}</button>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
.modal {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    z-index: 10;
}
.inner {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5rem 2rem;
    position: relative;
    z-index: 1;
    min-height: 100%;
    width: 100%;
}
.modal::before, .inner::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    content: " ";
}
.modal::before {
    background-color: var(--color-base-0);
    opacity: 0.8;
}
.modal::after {
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
}
.modal-content {
    z-index: 1;
    max-width: 500px;
    width: 100%;
}
.buttons {
    display: flex;
    justify-content: flex-end;
}
button {
    margin-left: 3rem;
}
</style>