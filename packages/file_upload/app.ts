import express, { Express, Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import swig from 'swig';

const UPLOAD_FILE = path.join(__dirname, 'uploads');

const app: Express = express();
const PORT = 3001;

app.set('views', path.join(__dirname, '../'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

if (!fs.existsSync(UPLOAD_FILE)) {
    fs.mkdirSync(UPLOAD_FILE);
}

app.post('/upload', (req: Request, res: Response) => {
    const { headers } = req;
    console.log(headers);
    const fileSize = parseInt(headers['content-length'] as string);
    const fileName = path.basename(headers['x-file-name'] as string);
    const fileUrl = path.join(UPLOAD_FILE, fileName);
    const range = headers.range || 'bytes=0-';

    const [start, end] = range.replace(/bytes=/, '').split('-').map(v => parseInt(v));
    const chunkSize = (end - start) + 1;

})

app.get('/', (req: Request, res: Response) => {
    res.render('index');
})

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});