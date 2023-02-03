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


app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
})

app.get('/valid', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
})

app.get('/ticket', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
})

app.get('/login', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
})

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})