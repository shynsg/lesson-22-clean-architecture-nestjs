# Clean Architecture NestJS Practice

Project này dùng NestJS để học Clean Architecture bằng các real cases:

- `posts`: create post với `Idempotency-Key`
- `orders`: domain rules + outbox event
- `outbox`: background worker publish event giả lập

## Run

```bash
npm install
npm run start:dev
```

Server:

```txt
http://localhost:3000
```

## Layer Map

```txt
interfaces/http   -> Controller, DTO, Presenter
application       -> Use case, repository ports
domain            -> Entity, business rule, domain error
infrastructure    -> In-memory adapters, fake publisher
```

## Test Requests

Create post with idempotency:

```js
const key = crypto.randomUUID();

await fetch("http://localhost:3000/posts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Idempotency-Key": key
  },
  body: JSON.stringify({
    title: "Clean Architecture",
    description: "Controller -> UseCase -> Domain -> Repository"
  })
}).then((res) => res.json());
```

Call same request again with same key. It returns the same post and does not create a duplicate.

Create order:

```js
await fetch("http://localhost:3000/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    customerId: "cus_1",
    items: [
      { productId: "p1", quantity: 2, price: 120000 },
      { productId: "p2", quantity: 1, price: 50000 }
    ]
  })
}).then((res) => res.json());
```

Check outbox:

```js
await fetch("http://localhost:3000/outbox/events").then((res) => res.json());
```
