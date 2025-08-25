import { Polar } from '@polar-sh/sdk'

export const polar = new Polar({
  accessToken: process.env.POLAR_SANDBOX_ACCESS_TOKEN,
  server: 'sandbox'
})
