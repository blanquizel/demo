import express, { Express, Request, Response } from 'express';
import axios from 'axios';
import path from 'node:path';
import swig from 'swig';
import cookieParser from 'cookie-parser';
import { send } from 'node:process';

const app: Express = express();
app.use(cookieParser());

app.set('views', path.join(__dirname, '../'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

const PORT = 3001;
const TICKET_KEY = 'ticket';
const CODE_KEYY = 'code';


const validTicket = (cookies: any) => {
    if (cookies && JSON.stringify(cookies) !== '{}' && cookies.hasOwnProperty(TICKET_KEY)) {
        const ticket = cookies[TICKET_KEY];
    }
    return false;
}

const getTicket = async (code: string) => {
    axios.get(`http://127.0.0.1:3003?from=A&code=${code}`).then(

    )
}

app.get('/', (req: Request, res: Response) => {
    // res.send('Express + TypeScript Server');
    const params = req.query;
    const cookies = req.cookies;
    if (validTicket(cookies)) {
        return res.send('User has ready Login');
    }
    if (params[CODE_KEYY]) {
        const ticket = getTicket(params[CODE_KEYY] as string);
        return res.send('check code');
    }

    const returnUrl = encodeURIComponent('http://127.0.0.1:3001/');
    return res.redirect(`http://127.0.0.1:3003/login?return=${returnUrl}`);
})

app.get('/login', (req: Request, res: Response) => {
    const params = req.query;
    const cookies = req.cookies;

    // valid ticket
    if (validTicket(cookies)) {
        return res.send({
            code: 0,
            staute: 0
        })
    }

    // 
    if (params['code']) {
        // return res.redirect()

        return res.send('Login Success');
    }
    // if (params['name'] && params['pw']) {
    //     const returnUrl = req.host + req.originalUrl;
    //     return res.send({
    //         code: 0,
    //         status: 1,
    //         url: `http://127.0.0.1:3003/login?name=${params['name']}&pw=${params['pw']}&return=${returnUrl}`
    //     });
    // }

    return res.send({
        code: -1,
    })
})

app.get('/ticket', (req: Request, res: Response) => {
    const params = req.query;

})

app.get('/state', (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (validTicket(cookies)) {
        return res.send('User has ready Login');
    }
    return res.send('Not Login');
});

app.get('/logout', (req: Request, res: Response) => {
    const cookies = req.cookies;
    res.redirect('/state');
})

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})