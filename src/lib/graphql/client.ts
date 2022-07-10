/* file: src/graphql/client.ts */

import type { RequestHandlerArgs } from '$houdini'
import { HoudiniClient } from '$houdini'
const DOMAIN = import.meta.env.VITE_WWW_URL || 'http://localhost:3000'

async function fetchQuery({
	fetch,
	text = '',
	variables = {},
	session,
	metadata
}: RequestHandlerArgs) {
	const result = await fetch(`${DOMAIN}/graphql`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: text,
			variables
		})
	})

	return await result.json()
}

export const houdiniClient = new HoudiniClient(fetchQuery)
