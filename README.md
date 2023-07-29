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