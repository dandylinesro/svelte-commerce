<script>
import { createEventDispatcher } from 'svelte'
import { fetchStates } from '$lib/services'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { saveAddress } from '$lib/services/AddressService'
import { toast } from '$lib/utils'
import Error from '$lib/components/Error.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import Textarea from '$lib/ui/Textarea.svelte'
import Textbox from '$lib/ui/Textbox.svelte'

const dispatch = createEventDispatcher()

let err = null
let formChanged = false
let loading = false

export let address = {}
export let countries = []
export let states = []

// console.log('address', address)
// console.log('countries', countries)
// console.log('states', states)

let loadingStates = false

async function onCountryChange(country) {
	try {
		err = null
		loadingStates = true
		address.state = null
		states = await fetchStates({
			countryCode: country,
			storeId: $page.data?.store?.id,
			origin: $page.data?.origin
		})

		// console.log('states', states)
	} catch (e) {
		err = e
	} finally {
		loadingStates = false
	}
}

async function SaveAddress(address) {
	try {
		loading = true
		err = null

		let id = address._id || address.id || 'new'
		const { city, country, email, firstName, lastName, locality, phone, state, zip } = address

		toast('Saving Address Info...', 'info')

		const newAddress = await saveAddress({
			id,
			address: address.address,
			city,
			country,
			email,
			firstName,
			lastName,
			locality,
			phone,
			state,
			zip,
			storeId: $page.data.store?.id,
			origin: $page.data.origin
		})

		toast('Address Info Saved.', 'success')
		dispatch('saved')

		if (id === 'new') goto(`/my/addresses/${newAddress._id}`)
	} catch (e) {
		err = e
		// toast(e, 'error')
	} finally {
		loading = false
		formChanged = false
	}
}
</script>

<div>
	<Error err="{err}" />

	<form on:submit|preventDefault="{() => SaveAddress(address)}">
		<div class="mb-5 flex flex-col gap-2 lg:mb-10">
			<!-- First Name -->

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 shrink-0 font-medium">
					First Name

					<span class="text-red-500">*</span>
				</h6>

				<div class="mb-2 w-full max-w-md">
					<Textbox
						type="text"
						placeholder="Enter First Name"
						bind:value="{address.firstName}"
						autoFocus
						required />
				</div>
			</div>

			<!-- Last Name -->

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 shrink-0 font-medium">
					Last Name
					<span class="text-red-500">*</span>
				</h6>

				<div class="mb-2 w-full max-w-md">
					<Textbox placeholder="Enter Last Name" bind:value="{address.lastName}" required />
				</div>
			</div>

			<!-- Email -->

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 shrink-0 font-medium">
					Email
					<span class="text-red-500">*</span>
				</h6>

				<div class="mb-2 w-full max-w-md">
					<Textbox type="email" placeholder="Enter Email" bind:value="{address.email}" required />
				</div>
			</div>

			<!-- Phone -->

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 shrink-0 font-medium">
					Phone
					<span class="text-red-500">*</span>
				</h6>

				<div class="mb-2 w-full max-w-md">
					<Textbox
						type="tel"
						placeholder="Enter Phone"
						maxlength="13"
						bind:value="{address.phone}"
						required />

					<p class="mt-1 text-xs text-gray-500">E.g.+nnxxxxxxxxxx</p>
				</div>
			</div>

			<!-- Address -->

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 shrink-0 font-medium">
					Address
					<span class="text-red-500">*</span>
				</h6>

				<div class="mb-2 w-full max-w-md">
					<Textarea placeholder="Enter Address" bind:value="{address.address}" required />
				</div>
			</div>

			<!-- Locality -->

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 shrink-0 font-medium">Locality</h6>

				<div class="mb-2 w-full max-w-md">
					<Textbox placeholder="Enter Locality" bind:value="{address.locality}" />
				</div>
			</div>

			<!-- City -->

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 shrink-0 font-medium">
					City
					<span class="text-red-500">*</span>
				</h6>

				<div class="mb-2 w-full max-w-md">
					<Textbox placeholder="Enter City" bind:value="{address.city}" required />
				</div>
			</div>

			<!-- Country -->

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 shrink-0 font-medium">
					Country
					<span class="text-red-500">*</span>
				</h6>

				<div class="mb-2 w-full max-w-md">
					<select
						class="w-full rounded-md border border-gray-300 bg-white p-2 text-sm placeholder-gray-400  transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-gray-50"
						bind:value="{address.country}"
						on:change="{() => onCountryChange(address.country)}"
						required>
						<option value="{null}" disabled selected>-- Select a Country --</option>
						{#if countries?.length}
							{#each countries as c}
								{#if c}
									<option value="{c.code}">
										{c.name}
									</option>
								{/if}
							{/each}
						{/if}
					</select>
				</div>
			</div>

			<!-- State -->

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 shrink-0 font-medium">
					State/Province
					<span class="text-red-500">*</span>
				</h6>

				<div class="mb-2 w-full max-w-md">
					<select
						class="w-full rounded-md border border-gray-300 bg-white p-2 text-sm placeholder-gray-400  transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-gray-50"
						bind:value="{address.state}"
						disabled="{!address.country || loadingStates}"
						required>
						<option value="{null}" disabled selected>-- Select a State --</option>
						{#each states as s}
							{#if s}
								<option value="{s.name}">
									{s.name}
								</option>
							{/if}
						{/each}
					</select>
				</div>
			</div>

			<!-- ZIP -->

			<div class="flex flex-wrap">
				<h6 class="mb-1 mr-5 w-52 shrink-0 font-medium">
					ZIP
					<span class="text-red-500">*</span>
				</h6>

				<div class="mb-2 w-full max-w-md">
					<Textbox
						type="tel"
						placeholder="Enter zip"
						maxlength="6"
						bind:value="{address.zip}"
						required />
				</div>
			</div>
		</div>

		<PrimaryButton type="submit" loading="{loading}" class="w-60">Save Address</PrimaryButton>
	</form>
</div>
