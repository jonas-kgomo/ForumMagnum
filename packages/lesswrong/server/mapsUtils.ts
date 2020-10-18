import { Client } from '@googlemaps/google-maps-services-js'
import { DatabaseServerSetting } from './databaseSettings';

const googleMapsApiKeySetting = new DatabaseServerSetting<string | null>('googleMaps.serverApiKey', null)
const googleMapsApiKey = googleMapsApiKeySetting.get()
let googleMapsClient: any = null
if (googleMapsApiKey) {
  googleMapsClient = new Client({})
} else {
  // eslint-disable-next-line no-console
  console.log("No Server-side Google maps API key provided, please provide one for proper event timezone handling")
}

export async function getLocalTime(time, googleLocation) {
  if (!googleMapsClient) {
    // eslint-disable-next-line no-console
    console.log("No Server-side Google Maps API key provided, can't resolve local time")
    return null
  }
  try {
    const { geometry: { location } } = googleLocation
    const apiResponse = await googleMapsClient.timezone({params: {location, timestamp: new Date(time), key: googleMapsApiKey}})
    const { data: { dstOffset, rawOffset } } = apiResponse //dstOffset and rawOffset are in the unit of seconds
    const localTimestamp = new Date(time).getTime() + ((dstOffset + rawOffset)*1000) // Translate seconds to milliseconds
    return new Date(localTimestamp)
  } catch(err) {
    // eslint-disable-next-line no-console
    console.error("Error in getting local time:", err)
    throw err
  }
}
