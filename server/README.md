## Server

Make sure you build the client project first. Follow instructions [here](../client/README.md#build) to build the client app.

```bash
cd server
npm i
npm run setup // to setup env and database
npm run start  // to run the server
npm run dev // to run the server in dev env
```

The server runs on port `5000`. Please look into `.env` file to change paramaters. 

## APIs

- `api/auth/register`: To register a user
- `api/auth/login`: Tp authenticate a user
- `api/auth/verify`: Verifies the authToken passed in header for client
- `api/auth/challenge`: To get a new challenge
- `api/blog/created`: Protected with JSON web token

