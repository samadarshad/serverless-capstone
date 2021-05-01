import { decode, verify } from 'jsonwebtoken';
import { Jwt } from './Jwt';
import { JwtPayload } from './JwtPayload';
const jwksClient = require('jwks-rsa');

const jwksUrl = process.env.JWKS_URL

const keyClient = jwksClient({
  jwksUri: jwksUrl
})

export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  const key = await keyClient.getSigningKey(jwt.header.kid)
  const certificate = key.getPublicKey()

  return verify(token, certificate) as JwtPayload
}