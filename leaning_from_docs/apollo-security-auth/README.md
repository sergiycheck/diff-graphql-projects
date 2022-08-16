## Prerequisites

Run **gen.sh** file to generate public and private rsa keys. <br/>
Replace theirs content with the keys with the appropriate format from the website <br/>
[rsa generator](http://travistidwell.com/jsencrypt/demo/) with start and end marks <br/>

```
./gen.sh
```

## generate private key and certificate with any tool you know and place them

### into development and production folders

```bash
mkdir .ssl && cd .ssl && mkdir development && mkdir production
```

Generate key and certificate

```bash
mkcert localhost
```

### Helpful resources

[JSON Web Token (JWT) — The right way of implementing, with Node.js](https://siddharthac6.medium.com/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e)

[rsa generator](http://travistidwell.com/jsencrypt/demo/)

[tutorial with python about rsa encryption](https://blog.miguelgrinberg.com/post/json-web-tokens-with-public-key-signatures)
