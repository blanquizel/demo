import express, { Express, Request, Response } from 'express';

const app: Express = express();
const PORT = 3001;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});


const template = `
<!DOCTYPE html><html><body>
<h1>SSE Express</h1>
<script type="text/javascript">
const source = new EventSource("/events/");
source.onmessage = e => {
  console.log(JSON.parse(e.data))
  const data = JSON.parse(e.data).data;
  if(data === '[DONE]'){
    source.close();
    console.log('close by client');
  }else{
    document.body.innerHTML += JSON.parse(e.data).data + "<br>"
  }
};
</script></body></html>`


app.get('/sse', (req: Request, res: Response) => {
    // test page, after load, request /events/ api 
    res.send(template);
});

let clientId = 0,
    clients: Record<number, Response> = {};

const sendEvent = (res: Response, data: string) => {
    res.write(`data: ${JSON.stringify({ data })}\n\n`)
}

app.get('/events/', (req: Request, res: Response) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    });

    setTimeout(() => {
        sendEvent(res, 'This is a sse api');
    }, 0);
    setTimeout(() => {
        sendEvent(res, 'It\'s a message from server');
    }, 1500);
    setTimeout(() => {
        sendEvent(res, 'Now let\'s close server');
    }, 2500);
    setTimeout(() => {
        sendEvent(res, '[DONE]');
    }, 5000);

    (clientId => {
        clients[clientId] = res;
        req.on('close', function () {
            console.log('Clients: ' + clientId + ' disconnected');
            delete clients[clientId];
        })
    })(++clientId);
});

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})