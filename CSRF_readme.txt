vulnerable example:

Writing draft to user owned this cookie.
Success example, before next-csrf implementation:
```
curl -X $'POST' \
    -H $'Host: localhost:3000' -H $'Content-Length: 51' -H $'Content-Type: application/json' \
    -b $'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InIiLCJ1c2VySWQiOjQsImVtYWlsIjoickByLnIiLCJleHBlcmF0aW9uVGltZSI6MTY5MzIyODk5NDE0OCwiaWF0IjoxNjkwNjM2OTk0fQ.gjYPoUf-FMkbWXOnL-N1uwY300cSkQKn-3TLuMmzkCo' \
    --data-binary $'{\"title\":\"hello\",\"content\":\"hello\",\"email\":\"r@r.r\"}' \
    $'http://localhost:3000/api/post'
```

- Make sure there is a user with e-mail address r@r.r (per email in example)
- Make sure jwt cookie is valid (can be copied from cookies)

Server response to the above:
```
{"id":5,"title":"hello","content":"hello","published":false,"authorId":4}
```

Result: draft created with title: hello and content: hello for userid 4 (email = r@r.r)
