import express, { Express, Request, Response } from 'express';
const cookieParser = require('cookie-parser');

const app: Express = express();
app.use(cookieParser())

const PORT = 3001;

type User = {
    name: string;
    pw: string;
    session: string;
}

const EXPIRE: number = 1000 * 60 * 5;

const users: User[] = [{ name: 'aaa', pw: '123', session: 'user1aaa' }, { name: 'bbb', pw: '456', session: 'user2bbb' }];

const cache = new Map();

const refreshCookie = (cache: Map<string, any>, sessionId: string) => {
    let timer = cache.get(sessionId)!;
    clearTimeout(timer);
    timer = setTimeout(() => {
        cache.delete(sessionId);
    }, EXPIRE);
    cache.set(sessionId, timer);
    console.log(`coookie ${sessionId} has delay ${EXPIRE}ms`)
}

const validCookie = (cookies: any): boolean => {
    console.log('cookie:', cookies);
    console.log('cache:', cache);
    // warning, [Object: null prototype]
    if (cookies && JSON.stringify(cookies) !== '{}' && cookies.hasOwnProperty('mySession')) {
        if (cache.has(cookies['mySession'])) {
            refreshCookie(cache, cookies['mySession']);
            return true;
        }
    }
    return false;
}

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.get('/login', (req: Request, res: Response) => {
    // check cookie
    const cookies = req.cookies;
    if (validCookie(cookies)) {
        return res.send('Has ready login');
    }

    // check user name and pw
    const params = req.query;
    const { name, pw } = params;
    if (!name || !pw) {
        return res.send('Missing Parameters');
    }

    // valid name and pw
    const item = users.find(item => item.name === name && item.pw === pw);
    if (!item) {
        return res.send('Not find User or PW not right');
    }

    // add session to cookie
    res.cookie('mySession', item.session, { expires: new Date(Date.now() + EXPIRE), httpOnly: true })

    // keep cookie in state and define a timer for clean
    const timer = setTimeout(() => {
        cache.delete(item.session);
    }, EXPIRE);
    cache.set(item.session, timer);

    return res.send('Login Success');
})

app.get('/state', (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (validCookie(cookies)) {
        return res.send('User has ready Login');
    }
    return res.send('Not Login');
});

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});