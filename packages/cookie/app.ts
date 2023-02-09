import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app: Express = express();
const PORT = 3001;

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


type User = {
    name: string;
    pw: string;
    session: string;
}

const users: User[] = [{ name: 'aaa', pw: '123', session: 'user1aaa' }, { name: 'bbb', pw: '456', session: 'user2bbb' }];


app.get('/', (req: Request, res: Response) => {
    return res.render('index');
});

app.get('/verify', (req: Request, res: Response) => {
    let session_DB: any = req.session;
    if (session_DB.username) {
        return res.send('You\'re ready login');
    }
    res.send('Not Login');
});

app.post('/login', (req: Request, res: Response) => {
    // check cookie
    let session_DB: any = req.session;
    if (session_DB.username) {
        return res.json({
            code: 0,
            msg: 'Has ready login'
        });
    }

    // check user name and pw
    const params = req.body;
    const { name, pw } = params;
    if (!name || !pw) {
        return res.json({
            code: 0,
            msg: 'Missing Parameters'
        });
    }

    // valid name and pw
    const item = users.find(item => item.name === name && item.pw === pw);
    if (!item) {
        return res.json({
            code: 0,
            msg: 'Not find User or PW not right'
        });
    }

    session_DB = req.session;
    session_DB.username = name;

    return res.send({
        code: 0,
        msg: 'Login Success',
        session: session_DB
    });
})

app.get('/logout', (req: Request, res: Response) => {
    req.session.destroy( () => {});
    res.redirect('/');
})

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});