import express, { Express, Request, Response } from 'express';
import axios from 'axios';
import path from 'node:path';
import swig from 'swig';
import cookieParser from 'cookie-parser';

const app: Express = express();
app.use(cookieParser());

app.set('views', path.join(__dirname, '../'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

const PORT = 3002;

const EXPIRE: number = 1000 * 60 * 5;
const TICKET_KEY = 'ticket';

const cache = new Map();

const validTicket = (cookies: any) => {
    if (cookies && JSON.stringify(cookies) !== '{}' && cookies.hasOwnProperty(TICKET_KEY)) {
        const ticket = cookies[TICKET_KEY];
        if (cache.has(ticket)) {
            return true;
        }
    }
    return false;
}

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
})

app.get('/login', (req: Request, res: Response) => {
    const cookies = req.cookies;
    if(validTicket(cookies)){
        return res.send('User has ready Login');
    }

})


app.get('/state', (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (validTicket(cookies)) {
        return res.send('User has ready Login');
    }
    return res.send('Not Login');
});


app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})