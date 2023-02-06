import express, { Express, Request, Response } from 'express';
import axios from 'axios';
import cookieParser from 'cookie-parser';

const app: Express = express();
app.use(cookieParser());

const PORT = 3001;

const EXPIRE: number = 1000 * 60 * 5;
const TICKET_KEY = 'ticket';

const cache = new Map();

const validTicket = (cookies: any) => {
    if (cookies && JSON.stringify(cookies) !== '{}' && cookies.hasOwnProperty(TICKET_KEY)) {
        const ticket = cookies[TICKET_KEY];
        if (cache.has(ticket)) {
            const time = new Date().getTime();
            if (cache.get(cookies[TICKET_KEY])! > time) {
                cache.delete(cookies[TICKET_KEY]);
                return false;
            }
            return true;
        }
    }
    return false;
}

const getTicket = async (code: string) => {
    axios.get(`http://127.0.0.1:3003?from=A&code=${code}`).then(

    )
}

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
})

app.get('/login', (req: Request, res: Response) => {
    const params = req.query;
    const cookies = req.cookies;

    // valid ticket
    if (validTicket(cookies)) {
        return res.send('User has ready Login');
    }
    if (params['code']) {
        // return res.redirect()
    }

    return res.send('Login failure');
})

app.get('/state', (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (validTicket(cookies)) {
        return res.send('User has ready Login');
    }
    const cur = req.originalUrl;
    return res.send('Not Login');
});

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})