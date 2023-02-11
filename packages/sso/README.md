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

+ `pnpm install` install dependencies
+ `pnpm run dev` run server
+ visit `http://127.0.0.1:3001/` to test server1 is running
+ visit `http://127.0.0.1:3002/` to test server2 is running
+ visit `http://127.0.0.1:3003/` to test authorziation server is running


### REFERNCES