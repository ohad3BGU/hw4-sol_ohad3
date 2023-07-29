Hello!

CSRF protection implemented based on next-csrf guide and the published blog-post.
There is a branch which is vulnerable, but you can also use the first commit or hw3 final submission if you want to test it, example given on CSRF_readme.txt

Cypress tests were added (10 in total, cause they are pretty small ones)


To run;
```
npm install
npx prisma migrate dev --name init
npm run dev
```

To test;
```
npm run cypress
```

p.s, CSRF secret is just a dummy one, in real-life we should use other ways to hide it but as this is lab env', that will do the job.
