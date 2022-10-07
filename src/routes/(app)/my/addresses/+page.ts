
const addressadd: Action = async ({ state, effects }) => {
    const data = await effects.request.formData()
    const storeid = data.get('storeid')
    const address = data.get('address')
    const city = data.get('city')
    const statte = data.get('state')
    const country = data.get('country')
    const pincode = data.get('pincode')
    const phone = data.get('phone')
    const name = data.get('name')
    const email = data.get('email')
    const isDefault = data.get('isDefault')
    
    const response = await effects.api.post('addresses', {
        storeid,
        address,
        city,
        statte,
        country,
        pincode,
        phone,
        name,
        email,
        isDefault
    })
    if (response.ok) {
        state.addresses = await response.json()
    }
}


export const actions = { addressadd }
