<script>
  import {
    Button,
    Form,
    FormGroup,
    TextInput,
    NumberInput,
    FileUploaderDropContainer,
    TextArea,
    FileUploaderItem,
  } from 'carbon-components-svelte';
  import { w } from '$lib/client';
  import { NFTStorage } from 'nft.storage';
  import { onMount } from 'svelte';

  let name,
    description,
    url,
    royality = 0,
    amount = 0.05,
    file = [];
  // $: recepient = $w?.address;

  const isUrl = (s) => {
    try {
      return Boolean(new URL(s));
    } catch (_) {
      return false;
    }
  };

  // $: recepientEnabled = $w?.isTonWallet;
  $: fileAdded = file.length > 0;
  $: urlValid = url ? isUrl(url) : true;
  $: amountWarn = amount != 0.05;

  // Floating error fix
  $: amount = amount ? Number(amount.toPrecision(6)) : 0;

  const handleSubmit = () => {
    const meta = {};
    // NFTStorage.encodeDirectory();
    // fetch('/deploy', { body: "{'hh'}", method: 'POST' });
  };
</script>

<Form
  on:submit="{handleSubmit}"
  class="flex justify-center items-center h-[90vh]">
  <div>
    <div class="flex flex-col">
      <FormGroup legendText="Collection Details">
        <TextInput
          bind:value="{name}"
          labelText="Name"
          placeholder="Enter collection name..." />
        <TextArea
          bind:value="{description}"
          labelText="Description"
          placeholder="Enter a description..." />
        <NumberInput
          bind:value="{royality}"
          label="Royality Percent"
          max="{100}"
          min="{0}"
          step="{0.5}"
          invalidText="Must be between 0% and 100%" />
        <TextInput
          bind:value="{url}"
          labelText="Homepage (Optional)"
          invalid="{!urlValid}"
          placeholder="Enter the URL..." />
      </FormGroup>
      <FormGroup legendText="Collection Image">
        <FileUploaderDropContainer
          bind:files="{file}"
          labelText="Drop image here or click to upload."
          accept="{['image/*']}"
          disabled="{fileAdded}" />
        {#if fileAdded}
          <FileUploaderItem
            name="{file[0].name}"
            status="edit"
            on:delete="{() => {
              file = [];
            }}" />
        {/if}
      </FormGroup>
      <FormGroup legendText="Advanced">
        <NumberInput
          bind:value="{amount}"
          label="TON Amount"
          step="{0.01}"
          min="{0}"
          warn="{amountWarn}"
          warnText="Recommended to use 0.05" />
        <!-- <TextInput
          bind:value="{recepient}"
          disabled="{!recepientEnabled}"
          labelText="Royality Recipient" /> -->
      </FormGroup>
    </div>
    <Button size="field" type="submit">Submit</Button>
  </div>
</Form>
