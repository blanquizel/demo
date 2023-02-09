import express, { Express, Request, Response } from 'express';
import path from 'node:path';
import { createHash, createHmac } from 'node:crypto';
import swig from 'swig';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app: Express = express();

// app.use(bodyParser);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, '../'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

const PORT = 3003;
const SECRET_KEY = 'secret_key';

type User = {
    name: string;
    pw: string;
    session: string;
}

const EXPIRE: number = 1000 * 60 * 5;

const users: User[] = [{ name: 'test', pw: '123', session: 'user1aaa' }];

app.use(session({
    secret: 'secret key',
    name: 'SSO DEMO',
    cookie: { maxAge: EXPIRE },
    resave: false,
    saveUninitialized: false
}));

const ticketMap = new Map();

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

const createTicket = (code: string, from: string): string => {
    const time = new Date().getTime();

    const header = Buffer.from(JSON.stringify({
        "alg": "HS256",
        "typ": "JWT"
    })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
        "sub": "jwt-test",
        "code": code,
        "iat": time,
        "exp": time + EXPIRE,
    })).toString('base64url');
    const signature = createHmac('sha256', SECRET_KEY).update(header + '.' + payload)
        .digest('base64url');

    return `${header}.${payload}.${signature}`;
}

const validTicket = (ticket: string): boolean => {
    const [headerStr, payloadStr, signature] = ticket.split('.');
    const _signature = createHmac('sha256', SECRET_KEY).update(headerStr + '.' + payloadStr)
        .digest('base64url');
    if (signature !== _signature) {
        return false;
    };
    const { exp } = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    if (exp < new Date().getTime()) {
        return false;
    }

    return true;
}

app.get('/', (req: Request, res: Response) => {
    res.render('index');
})

app.get('/ticket', (req: Request, res: Response) => {
    const { code, from } = req.params;
    const ticket = createTicket(code, from);
    return res.json({
        code: 0,
        msg: '',
        data: {
            ticket
        }
    })
})

app.get('/login', (req: Request, res: Response) => {
    res.render('index');
})

app.post('/login', (req: Request, res: Response) => {
    let session_DB: any = req.session;
    const code = createCode(4);
    if (session_DB.username) {
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
            code: 0,
            status: 2,
            msg: 'lost required params'
        });
    }

    session_DB = req.session;
    session_DB.username = name;

    return res.json({
        code: 0,
        status: 0,
        data: code,
        msg: 'login success'
    });
})

app.get('/release', (req: Request, res: Response) => {
    ticketMap.clear();
    res.json({
        code: 0,
        status: 0
    })
})

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})