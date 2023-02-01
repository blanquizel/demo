import express, { Express, Request, Response } from 'express';

import { createHmac } from 'node:crypto';

const app: Express = express();
const PORT = 3001;

const SECRET_KEY = 'secret_key';

type User = {
    name: string;
    pw: string;
}
const users: User[] = [{ name: 'aaa', pw: '123' }, { name: 'bbb', pw: '456' }];

const genHeader = (): string => {
    return Buffer.from(JSON.stringify({
        "alg": "HS256",
        "typ": "JWT"
    })).toString('base64url');
}
const genPayload = (user: string): string => {
    return Buffer.from(JSON.stringify({
        "sub": "jwt-test",
        "name": user,
        "iat": new Date().getTime(),
    })).toString('base64url');
};

const genSignature = (header: string, payload: string, secret: string): string => {
    return createHmac('sha256', secret).update(header + '.' + payload)
        .digest('base64url');
}

const genToken = (user: User) => {
    const header = genHeader();
    const payload = genPayload(user.name);
    const signature = genSignature(header, payload, SECRET_KEY);

    return `${header}.${payload}.${signature}`;
}


const validToken = (token: string) => {

}

// console.log(genToken(users[0]));

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
})

app.get('/login', (req: Request, res: Response) => {
    const params = req.query;
    const { name, pw } = params;
    if (!name || !pw) {
        return res.send('Missing Parameters');
    }
    const item = users.find(item => item.name === name && item.pw === pw);
    if (!item) {
        return res.send('Not find User or PW not right');
    }

    const token = genToken(item);

    return res.send(`Your token is: ${token}`);
})

app.get('/state', (req: Request, res: Response) => {

})

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})