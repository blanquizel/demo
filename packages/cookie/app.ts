import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app: Express = express();
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const EXPIRE: number = 1000 * 60 * 5;

app.use(session({
    secret: 'secret key',
    name: 'COOKIE DEMO',
    cookie: { maxAge: EXPIRE },
    resave: false,
    saveUninitialized: false,
}));

const PORT = 3001;

type User = {
    name: string;
    pw: string;
    session: string;
}

const users: User[] = [{ name: 'aaa', pw: '123', session: 'user1aaa' }, { name: 'bbb', pw: '456', session: 'user2bbb' }];

app.get('/', (req: Request, res: Response) => {
    let session_DB: any = req.session;
    if (session_DB.username) {
        return res.send('Has ready login');
    }
    res.send('Not Login');
});

app.get('/login', (req: Request, res: Response) => {
    // check cookie
    let session_DB: any = req.session;
    if (session_DB.username) {
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

    session_DB = req.session;
    session_DB.username = name;

    return res.send('Login Success');
})

app.get('/logout', (req: Request, res: Response) => {
    req.session.destroy( () => {});
    res.redirect('/');
})

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});