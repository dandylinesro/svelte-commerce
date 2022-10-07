
import { gett } from '$lib/utils'
import { put } from '$lib/util/api'
import { error, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'
import dayjs from 'dayjs'


export async function load({ request, locals }) {
	const { me, store } = locals
	let profile = {}
	try {
		const data = await gett(`users/me`, request.headers.get('cookie'))
		data.dob = data.dob ? dayjs(data.dob).format('YYYY-MM-DD') : null
		profile = data || {
			email: me.email,
			firstName: me.firstName || '',
			lastName: me.lastName || ''
		}
	} catch (e) {
		throw error(e.status, e.message)
	} finally {
	}
	if (profile) {
		return { profile, store: store }
	}
	throw redirect(307, 'Please login again')
}

const save: Action = async ({ request, cookies }) => {
	const data = await request.formData()
	const storeid = data.get('storeid')
	const firstName = data.get('firstName')
	const lastName = data.get('lastName')
	const dob = data.get('dob')		

	const userdata = cookies.get('me')
	const profile = JSON.parse(userdata)
	try {
		let e = { ...profile, firstName, lastName, dob }
		e.company = 1
		e.store = storeid

		console.log("Saving Profile");

		if(e.dob) e.dob = dayjs(e.dob).format('YYYY-MM-DDTHH:mm')
		else e.dob = null
		delete e.phone

		profile = await put('users/update-profile',e)

		if(profile) {
			profile.dob = profile.dob ? dayjs(profile.dob).format('YYYY-MM-DD') : null
			console.log("Profile Saved");
		}

		await cookies.set('me', profile, {path:'/'})

	} catch (e) {
		console.log(e)
		throw error(e.status, e.message)
	} finally {
	}
	

}

export const actions = { save }
