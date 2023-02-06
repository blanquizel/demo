import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { createHash } from 'node:crypto';

const app: Express = express();
app.use(cookieParser())

const PORT = 3003;

type User = {
    name: string;
    pw: string;
    session: string;
}

const EXPIRE: number = 1000 * 60 * 5;

const users: User[] = [{ name: 'aaa', pw: '123', session: 'user1aaa' }, { name: 'bbb', pw: '456', session: 'user2bbb' }];

const cookieMap = new Map();
const ticketMap = new Map();

const createTicket = (code: string): string => {
    const data: string = code + new Date().getTime();
    const hash = createHash('sha256');
    return hash.update(data).digest('base64url');
}

const createCode = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const validTicket = (code: string, ticket: string): boolean => {
    return false;
}

const validCookie = (cookies: any): boolean => {
    console.log('cookie:', cookies);
    console.log('cache:', cookieMap);
    // warning, [Object: null prototype]
    if (cookies && JSON.stringify(cookies) !== '{}' && cookies.hasOwnProperty('mySession')) {
        if (cookieMap.has(cookies['mySession'])) {
            const time = new Date().getTime();
            if (cookieMap.get(cookies['mySession'])! > time) {
                cookieMap.delete(cookies['mySession']);
                return false;
            }
            return true;
        }
    }
    return false;
}

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
})

app.get('/code', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
})

app.get('/ticket', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
})

app.get('/login', (req: Request, res: Response) => {
    const cookies = req.cookies;
    const params = req.query;
    if (validCookie(cookies)) {
        const returnUrl = params['return'];
        const code = createCode(4);
        return res.send('')
    } else {

    }

    res.send('Express + TypeScript Server');
})

app.get('/release', (req: Request, res: Response) => {
    cookieMap.clear();
    ticketMap.clear();
})
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})