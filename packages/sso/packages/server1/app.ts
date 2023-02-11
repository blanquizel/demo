import express, { Express, Request, Response } from 'express';
import axios from 'axios';
import path from 'node:path';
import swig from 'swig';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app: Express = express();
const PORT = 3001;

const SOURCE = 'A';

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, '../'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

type ResResult = {
    code: number,
    msg?: string
    status?: number,
    data?: any,
    ticket?: string,
}

const getTicket = async (req: Request, code: string): Promise<ResResult> => {
    return new Promise((reslove, reject) => {
        axios.post('http://127.0.0.1:3003/ticket', {
            code,
            source: SOURCE
        }, {
            headers: {
                Authorization: req.headers.authorization,
                cookie: req.headers.cookie
            }
        }).then(response => response.data)
            .then(res => {
                console.log('ticket response: ', JSON.stringify(res));
                reslove(res);
            })
    });
}

const verifyTicket = async (req: Request, source = 'A'): Promise<ResResult> => {
    return new Promise((reslove, reject) => {
        axios.get(`http://127.0.0.1:3003/verifyTicket?source=${source}`, {
            headers: {
                Authorization: req.headers.authorization,
                cookie: req.headers.cookie
            },
        }).then(response => response.data).then(res => {
            console.log('verify ticket: ', JSON.stringify(res));
            reslove(res);
        })
    })
}

app.get('/', async (req: Request, res: Response) => {
    return res.render('index', {});
})

app.get('/login', async (req: Request, res: Response) => {
    const result: ResResult = await verifyTicket(req);

    if (result.code !== 0) {
        console.log('ticket verify failed');
        const returnUrl = encodeURIComponent('http://127.0.0.1:3001/');
        const { code } = req.query;
        if (code) {
            // has code, server visit authorization center api for ticket
            const ticketRes = await getTicket(req, code as string);
            if (ticketRes.code === 0) {
                // return ticket to broswer
                return res.json({
                    ...ticketRes
                });
            }
            console.log('code is invalid, redirect to authorization center for login or new code');
            return res.redirect(301, `http://127.0.0.1:3003/login?return=${returnUrl}`);
        }
        console.log('no code, redirect to authorization center for login');
        return res.redirect(301, `http://127.0.0.1:3003/login?return=${returnUrl}`);
    }
    console.log('ticket verify success');
    return res.json({
        code: 0,
        status: 0,
    })
});

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})