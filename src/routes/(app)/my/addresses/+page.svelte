<style>
.line-clamp-3 {
	overflow: hidden;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
}

.h-rem-empty {
	height: 70vh;
}
</style>

<script>
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { del } from '$lib/utils/api'
import { saveAddress } from '$lib/services/AddressService'
import noEmptyAddress from '$lib/assets/no/empty-address.svg'
import Pagination from '$lib/components/Pagination.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'

const seoProps = {
	title: 'Dashboard - Addresses ',
	description: 'My Addresses'
}

export let data

let typingTimer
let loadingOnDelete = []

function callSearch(search) {
	clearTimeout(typingTimer)
	typingTimer = setTimeout(() => {
		searchData(search)
	}, 300)
}

async function searchData(search) {
	let u = new URL($page.url)
	u.searchParams.set('search', search.toString())
	goto(u.toString())
}

async function sortNow(sort) {
	let u = new URL($page.url)
	u.searchParams.set('sort', sort.toString())
	goto(u.toString())
}

async function saveAddr(e) {
	const { _id: id, active } = e
	try {
		await saveAddress({ id, storeId: $page.data.store?.id, origin: $page.data.origin })
		await invalidateAll()
	} catch (e) {
		data.err = e
	} finally {
	}
}

async function remove(id, index) {
	try {
		loadingOnDelete[index] = true

		await del(`addresses/${id}`, $page.data.origin)

		await invalidateAll()
	} catch (e) {
		data.err = e
	} finally {
		loadingOnDelete[index] = false
	}
}
</script>

<SEO {...seoProps} />

<div>
	<header class="mb-5 flex flex-col items-start md:items-center justify-between md:flex-row gap-2">
		<h1 class="text-2xl font-semibold md:text-3xl lg:text-4xl">
			Addresses

			{#if data.addresses.count}
				({data.addresses.count})
			{/if}
		</h1>

		<a href="/my/addresses/new" aria-label="Click to route new address" data-sveltekit-preload-data>
			<PrimaryButton type="button" loadingringsize="sm" class="text-sm">
				<svg
					class="h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
				</svg>

				<span>Add New Address</span>
			</PrimaryButton>
		</a>
	</header>

	{#if data.addresses?.isFetching}
		Loading....
	{:else if data.addresses?.errors}
		{data.addresses?.errors}
	{:else if data.addresses.data.length > 0}
		<ul class="mb-5 flex w-full max-w-xl flex-col gap-4">
			{#each data.addresses.data as i, index}
				{#if i}
					<li
						class="overflow-hidden rounded-md border bg-white shadow-md transition duration-300 hover:shadow-md">
						<div class="flex items-start gap-3 p-4 sm:p-6">
							<div class="flex flex-1 flex-col gap-1 text-sm">
								<span class="text-base font-semibold">
									{i.firstName || '_'}
									{i.lastName || '_'}
								</span>

								<span>
									{i.address || '_'}, {i.locality || '_'}, {i.city || '_'}

									<br />

									{i.state || '_'}, {i.country || '_'}

									<br />

									{i.zip || '_'}
								</span>

								<span> {i.email || '_'} </span>

								<span> {i.phone || '_'} </span>
							</div>

							{#if i.isHome}
								<div
									class="shrink-0 rounded-full border-2 border-gray-300 bg-gray-100 py-0.5 px-4 text-xs font-bold uppercase tracking-wide">
									Home
								</div>
							{/if}
						</div>

						<div class="grid grid-cols-2 divide-x border-t">
							<a
								href="{`/my/addresses/${i._id}`}"
								aria-label="Click to route address details"
								class="bg-transparent p-2 text-center font-semibold uppercase text-primary-500 transition duration-300 focus:outline-none hover:bg-gray-100 hover:text-primary-700">
								Edit
							</a>

							<button
								type="button"
								class="bg-transparent p-2 text-center font-semibold uppercase text-primary-500 transition duration-300 focus:outline-none hover:bg-gray-100 hover:text-primary-700"
								on:click="{() => remove(i._id, index)}">
								{#if loadingOnDelete[index]}
									Removing...
								{:else}
									Remove
								{/if}
							</button>
						</div>
					</li>
				{/if}
			{/each}
		</ul>

		<Pagination count="{Math.ceil(data.count / 40)}" current="{data.currentPage}" />
	{:else}
		<div class="flex h-[70vh] flex-col items-center justify-center text-center">
			<img src="{noEmptyAddress}" alt="empty wishlist" class="mb-5 h-60 object-contain" />

			<p class="mb-2 text-xl font-medium md:text-3xl">Empty Address!!</p>

			<p class="mb-5 text-sm">
				There's no address found, start adding address by clicking the add new address button above.
			</p>

			<a href="/" aria-label="Click to route home" data-sveltekit-preload-data>
				<PrimaryButton class="w-40 py-2 text-sm">Shop Now</PrimaryButton>
			</a>
		</div>
	{/if}
</div>
