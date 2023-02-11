import express, { Express, Request, Response } from 'express';
import path from 'node:path';
import { createHash, createHmac } from 'node:crypto';
import swig from 'swig';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app: Express = express();
const PORT = 3003;

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, '../'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

const SECRET_KEY = 'secret_key';

type User = {
    name: string;
    pw: string;
    session: string;
}

const EXPIRE_COOKIE: number = 1000 * 60 * 5; // ms
const EXPIRE_TICKET: number = 60 * 5; // s

const users: User[] = [{ name: 'test', pw: '123', session: 'user1aaa' }];

const codeRecord: Set<string> = new Set();
const codeGarbage: Set<string> = new Set();

app.use(session({
    secret: 'secret key',
    name: 'SSO DEMO',
    cookie: { maxAge: EXPIRE_COOKIE },
    resave: false,
    saveUninitialized: false
}));

const _createCode = (length: number) => {
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

const createCode = ( length: number) => {
    let code = _createCode(length);
    while(codeRecord.has(code) || codeGarbage.has(code)){
        code = _createCode(length);
    }
    return code;
}

app.get('/', (req: Request, res: Response) => {
    res.render('index');
})

app.get('/login', (req: Request, res: Response) => {
    res.render('index');
})

app.post('/login', (req: Request, res: Response) => {
    let session_DB: any = req.session;
    const code = createCode(4);
    if (session_DB.username) {
        codeRecord.add(code);
        return res.json({
            code: 0,
            status: 1,
            data: code,
        });
    }
    // console.log(req.session);
    console.log(req.body, req.params);
    const { name, pw } = req.body;
    const item = users.find(item => item.name === name && item.pw === pw);
    if (!item) {
        return res.json({
            code: 1,
            status: 2,
            msg: 'lost required params'
        });
    }

    session_DB = req.session;
    session_DB.username = name;

    codeRecord.add(code);
    return res.json({
        code: 0,
        status: 0,
        data: code,
        msg: 'login success'
    });
})

app.get('/verify', (req: Request, res: Response) => {
    let session_DB: any = req.session;
    if (session_DB.username) {
        return res.json({
            code: 0,
            msg: 'You\'re ready login'
        });
    }
    return res.send({
        code: 1,
        msg: 'Not Login'
    });
});

app.post('/ticket', (req: Request, res: Response) => {
    const { code, source } = req.body;

    if(!codeRecord.has(code)){
        return res.json({
            code: 1,
            msg: 'code invalied'
        })
    }
    if(codeGarbage.has(code)){
        return res.json({
            code: 1,
            msg: 'code had used'
        })
    }

    return jwt.sign({ code, source }, SECRET_KEY, { expiresIn: `${EXPIRE_TICKET}s` }, (err, ticket) => {
        console.log('code: ', code);
        console.log('ticket: ', ticket);
        codeRecord.delete(code);
        codeGarbage.add(code);
        return res.json({
            code: 0,
            ticket
        })
    });
})

app.get('/verifyTicket', (req: Request, res: Response) => {
    const header = req.headers;
    const ticket = header['authorization']?.split(' ')[1];
    if (!ticket) {
        return res.json({
            code: 1,
            msg: 'Not find ticket'
        });
    }

    const { source } = req.query;
    // console.log(req.query);

    return jwt.verify(ticket, SECRET_KEY, (err, payload: any) => {
        if (err) {
            // return res.sendStatus(403);
            return res.json({
                code: 1,
                msg: 'ticket verify falied'
            })
        }
        // console.log(payload);
        if (payload.source !== source) {
            return res.json({
                code: 1,
                msg: 'err source'
            })
        }
        return res.json({
            code: 0,
            data: payload
        })
    })
})

app.get('/checkCode', (req: Request, res: Response) => {
    return res.json({
        record: Array.from(codeRecord),
        garbage: Array.from(codeGarbage),
    });
})

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})