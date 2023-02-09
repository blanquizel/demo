import express, { Express, Request, Response } from 'express';
import { createHmac } from 'node:crypto';
import jwt from 'jsonwebtoken';

const app: Express = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SECRET_KEY = 'secret_key';
const EXPIRE: number = 1000 * 60 * 5;

type User = {
    name: string;
    pw: string;
}

enum TokenVerifyEnum {
    OK,
    INVALID,
    EXP
}

const users: User[] = [{ name: 'aaa', pw: '123' }, { name: 'bbb', pw: '456' }];

const genHeader = (): string => {
    return Buffer.from(JSON.stringify({
        "alg": "HS256",
        "typ": "JWT"
    })).toString('base64url');
}
const genPayload = (user: string): string => {
    const time = new Date().getTime();
    return Buffer.from(JSON.stringify({
        "sub": "jwt-test",
        "name": user,
        "iat": time,
        "exp": time + EXPIRE,
    })).toString('base64url');
};

const genSignature = (header: string, payload: string, secret: string): string => {
    return createHmac('sha256', secret).update(header + '.' + payload)
        .digest('base64url');
}

const genToken = (user: User) => { 
    const header = genHeader();
    const payload = genPayload(user.name);
    const signature = genSignature(header, payload, SECRET_KEY);

    return `${header}.${payload}.${signature}`;
}


const validToken = (token: string): TokenVerifyEnum => {
    const [headerStr, payloadStr, signature] = token.split('.');
    const _signature = genSignature(headerStr, payloadStr, SECRET_KEY);
    if (signature !== _signature) {
        return TokenVerifyEnum.INVALID;
    }
    return TokenVerifyEnum.OK;
}

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
})

app.post('/login', (req: Request, res: Response) => {
    const { name, pw } = req.body;
    // console.log(req.body);
    if (!name || !pw) {
        return res.json({
            code: 1,
            msg: '缺少参数'
        });
    }
    const item = users.find(item => item.name === name && item.pw === pw);
    if (!item) {
        return res.json({
            code: 1,
            msg: '未找到指定用户'
        })
    }

    jwt.sign({ name: item.name }, SECRET_KEY, { expiresIn: '30s' }, (err, token) => {
        return res.json({
            code: 0,
            token,
        })
    })

    // const token = genToken(item);
    // return res.json({
    //     code: 0,
    //     data: {
    //         token
    //     }
    // })
})

app.get('/verify', (req: Request, res: Response) => {
    const header = req.headers;
    // console.log(header);
    const token = header['authorization']?.split(' ')[1];
    if (!token) {
        return res.json({
            code: 1,
            msg: 'Not find token'
        });
    }

    return jwt.verify(token, SECRET_KEY ,(err, payload) => {
        if(err) res.sendStatus(403);
        return res.json({
            code: 0,
            msg: 'You\'re ready Login',
            data: payload
        })
    })

    // console.log(token);
    // const result: TokenVerifyEnum = validToken(token as string);
    // console.log(result);
    // if (result === TokenVerifyEnum.INVALID) {
    //     return res.json({
    //         code: 1,
    //         msg: 'Token is not pass verify'
    //     });
    // }
    // if (result === TokenVerifyEnum.EXP) {
    //     return res.json({
    //         code: 1,
    //         msg: 'Token is expired'
    //     });
    // }
    // return res.json({
    //     code: 0,
    //     msg: ' You\'re ready Login',
    //     data: JSON.parse(token.split('.')[1])
    // })
})

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})