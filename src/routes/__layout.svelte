<script module>
  import '../app.css';
  import { onMount } from 'svelte';
  import symbol from '$lib/assets/symbol.svg';
  import { InlineLoading, Button } from 'carbon-components-svelte';
  import { w } from '$lib/client';

  let wallet;
  onMount(() => {
    // @ts-ignore
    wallet = window?.ton;
  });

  let connect;
  const handleClick = () => {
    if (connect) {
      $w = null;
      connect = null;
    } else {
      connect = async () => {
        if (wallet?.isTonWallet) {
          wallet.address = (await wallet.send('ton_requestAccounts'))[0];
          $w = wallet;
        } else {
          throw new Error('No wallet found');
        }
      };
    }
  };

  const tinyAddress = () =>
    wallet.address.slice(0, 5) + '...' + wallet.address.slice(-6);
</script>

<header class="sticky w-full top-0 backdrop-blur-md">
  <div class="flex items-end justify-between h-20 max-w-screen-lg px-6 mx-auto">
    <div class="font-[Raleway] tracking-wide font-black text-3xl">tsarina</div>
    <nav
      class="items-center justify-center space-x-8 text-lg font-medium flex flex-1 w-0">
      <a class="text-gray-900" href="/explore">Explore</a>
      <a class="text-gray-900" href="/deploy">Deploy</a>
    </nav>

    <button
      on:click="{handleClick}"
      class="px-5 py-1 text-base font-medium text-white h-10 w-52 bg-blue-600 flex justify-between items-center hover:bg-blue-700 focus:ring focus:ring-blue-400 focus:ring-offset-1">
      {#if connect}
        {#await connect()}
          Connect Wallet
          <div class="pm-1">
            <InlineLoading />
          </div>
        {:then _}
          {tinyAddress()}
          <img src="{symbol}" alt="Ton" class="w-7 h-7" />
        {:catch error}
          {error.message}
          <div class="pl-2">
            <InlineLoading status="error" />
          </div>
        {/await}
      {:else}
        Connect Wallet
        <img src="{symbol}" alt="Ton" class="w-7 h-7" />
      {/if}
    </button>
  </div>
</header>

<slot />

<style>
</style>
