Few subjects;

1. The tests (using jest) are all server side tests, even though most running tests for user's input, we should always make client and server side tests for user input. There are 12 tests, 1 of them needs the server to be running in order to pass.
2. There is a logic issue with the program, unauthenticated users and also authenticated users, can view drafts of other users, I've not implemented any changes, assuming it's by design.
3. I've made some changes in the middleware which are not 100% described in the requierments, I've  restericted few other pages which are user-only, not just API routes related to the user, but some pages as well (such as /profile, even though there is client side validation for authentication anyway).


To run;

```
npm install
npx prisma migrate dev --name init
npm run dev
```

To test;
```
npm test
```

