### DESCRIPTION
This demo is about the following points:

+ How to set up a server written in TypeScript with Node.js and Express.
+ How to create a login system by sso.
+ How to login from diffent system but use save cookie verify.

### ROADMAP
- [x] Use monorepo to manage packages
- [x] Server1 on port 3001
- [x] Server2 on port 3002
- [x] Authorziation Server on port 3003
- [x] Cookie verify
- [x] Ticket generation and verify
- [ ] All sso system test 

### How to use

+ `pnpm install` install dependencies.
+ By `pnpm run dev` script, startup all server.
+ visit `http://127.0.0.1:3001/` to login for serv1.
+ visit `http://127.0.0.1:3002/` to login for serv2. It should be noted that, if you had loged in serv1, there will not need to click login button in Authorziation Center.


### REFERNCES