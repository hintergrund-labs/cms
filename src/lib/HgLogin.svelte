<svelte:options
  customElement={{
    tag: 'hintergrund-login',
  }}
/>
<script>
	let password = '';
	let error = '';

	function loginUser() {
		fetch('/hg-admin/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				password
			})
		})
        .then(res => res.json())
		.then(data => {
			console.log(data)
			if (data.success) {
				window.location.href = '/hg-admin';
			} else {
				error = data.message ?? 'An error occurred. Please try again.';
			}
		});
	}
</script>

<main>
	<form autocomplete="off" on:submit|preventDefault={loginUser}>
		<h2>Log in</h2>
		<input type="password" name="password" placeholder="Password" required bind:value={password}>
		<input type="submit" value="Log in">
		{#if error}
			<p class="error">{error}</p>
		{/if}
	</form>
</main>

<style>
:global(
    *,
    *::before,
    *::after
) {
    box-sizing: border-box;
}
:global(:root) {
    font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif;
}
main {
	text-align: center;
	background-color: #fff;
	color: #333;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
	height: 100vh;
	margin: 0;
	width: 100%;
}
main * {
	box-sizing: border-box;
}
h2 {
	margin: 2rem;
	font-weight: 200;
}
form {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 2rem;
	color: #333;
	background-color: #fff;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	width: 30%;
}
input {
	width: 100%;
	padding: 0.5rem;
	margin: 0.5rem 0;
	border: 1px solid #ccc;
	border-radius: 5px;
	outline: none;
}
input:focus {
	border-color: #333;
}
input[type="submit"] {
	background-color: #333;
	color: #fff;
	cursor: pointer;
	width: 100%;
}
.error {
	color: red;
}
</style>