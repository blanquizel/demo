### DESCRIPTION
This demo is about the following points:

+ How to set up a server written in TypeScript with Node.js and Express.
+ How to create a login system by cookie.

And you must know about follwing points:

+ In this demo, I use `Get` method for all request
+ I use `code` and `return` keyword for ticket and rewrite
+ It's just a demo. At your production env, you'd better consider more grace name

### ROADMAP
- [x] Use monorepo to manage packages
- [ ] Server1 on port 3001
- [ ] Server2 on port 3002
- [ ] Authorziation Server on port 3003
- [ ] Cookie check
- [ ] Ticket generation and check
- [ ] All sso system test 

### How to use

+ `pnpm install` install dependencies
+ `pnpm run dev` run server
+ visit `http://127.0.0.1:3001/` to test server1 is running
+ visit `http://127.0.0.1:3002/` to test server2 is running
+ visit `http://127.0.0.1:3003/` to test authorziation server is running


### REFERNCES