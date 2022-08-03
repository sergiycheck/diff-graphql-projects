import jwt from 'jsonwebtoken';
import fs from 'node:fs';
import path from 'node:path';
import { User, Post, Token } from './types';
import { users } from './db-data';

async function getUserFromToken(token: string): Promise<User> {
  const keyName = process.env.PUBLIC_RSA_KEY_NAME;
  if (!keyName) throw new Error('provide PUBLIC_RSA_KEY_NAME env');

  const jwtAlgorithm = process.env.JWT_ALGORITHM as jwt.Algorithm;
  if (!jwtAlgorithm) throw new Error('provide JWT_ALGORITHM env');

  const publicKey = await getAndReadPrivateKey(keyName);

  const result = (await getVerifiedResult(token, publicKey, jwtAlgorithm)) as {
    email: string;
  };

  return users.find((u) => u.email === result.email);

  function getVerifiedResult(
    token: string,
    publicKey: string,
    jwtAlgorithm: jwt.Algorithm
  ): Promise<string | jwt.JwtPayload> {
    return new Promise((resolve) => {
      jwt.verify(
        token,
        publicKey,
        { algorithms: [jwtAlgorithm] },
        function (err, decoded) {
          if (err) {
            throw err;
          }

          resolve(decoded);
        }
      );
    });
  }
}

async function genTokenForUser(data: { email: User['email'] }): Promise<Token> {
  const keyName = process.env.PRIVATE_RSA_KEY_NAME;
  if (!keyName) throw new Error('provide PRIVATE_RSA_KEY_NAME env');

  const jwtExpires = process.env.JWT_EXPIRATION;
  if (!keyName) throw new Error('provide JWT_EXPIRATION env');

  const jwtAlgorithm = process.env.JWT_ALGORITHM as jwt.Algorithm;
  if (!jwtAlgorithm) throw new Error('provide JWT_ALGORITHM env');

  const privateKey = await getAndReadPrivateKey(keyName);

  // TODO: encountered an error
  // https://github.com/nodejs/node/discussions/43184
  // providers = provider_sect // in /etc/ssl/openssl.cnf ?
  // when provided RS256 algorithm

  const token = jwt.sign({ email: data.email }, privateKey, {
    expiresIn: jwtExpires,
    algorithm: jwtAlgorithm,
  });

  return { token };
}

async function getAndReadPrivateKey(privateKeyName: string): Promise<string> {
  return new Promise((resolve) => {
    const data: string[] = [];
    const readStream = fs.createReadStream(path.resolve(process.cwd(), privateKeyName));
    readStream.on('data', (chunk) => {
      data.push(chunk.toString());
    });
    readStream.on('end', () => {
      const privateKey = data.join('');

      resolve(privateKey);
    });
  });
}

export default {
  getUserFromToken,
  genTokenForUser,
};
