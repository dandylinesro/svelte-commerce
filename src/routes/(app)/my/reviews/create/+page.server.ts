

import { gett} from '$lib/utils'
import { post } from '$lib/util/api'

import { error, invalid, redirect } from '@sveltejs/kit'


import type { Action, Actions, PageServerLoad } from './$types'
export const prerender = false

export async function load({ url, params, fetch, context }) {
	const ref = url.searchParams.get('ref')
	const productId = url.searchParams.get('product')
	let product

	try {
		product = await gett(`products/${productId}`)
	} catch (e) {
	} finally {
	}

	return {
		ref,
		product
	}
}

const add: Action = async ({ request, cookies }) => {
	const data = await request.formData()
	const id = 'new'
	const pid = data.get('pid')
	const rating = data.get('rating')
	const message = data.get('message')
	
	try {
		const addreview = await post(
			'reviews',
			{
				id,
				pid,
				rating,
				message
			}
		)
		
		return addreview
	
	} catch (e) {
		 
		return {}
	}

}

export const actions: Actions = { add }