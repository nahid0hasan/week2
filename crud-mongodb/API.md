# TaskFlow API contract

The frontend expects these endpoints. Default base URL: `http://localhost:5000`
(change it with `NEXT_PUBLIC_API_URL` in `frontend/.env.local`, see `frontend/.env.example`).

## Task shape (MongoDB document)

```json
{
  "_id": "665f1c2e9b1e8a3d4c2a1b0f",
  "title": "Learn Mongoose schemas",
  "description": "Optional text",
  "status": "todo",
  "priority": "medium",
  "dueDate": "2026-12-01T00:00:00.000Z",
  "createdAt": "2026-11-26T10:00:00.000Z",
  "updatedAt": "2026-11-26T10:00:00.000Z"
}
```

| field       | type   | rules                                            |
| ----------- | ------ | ------------------------------------------------ |
| title       | String | **required**, trimmed                            |
| description | String | optional, default `""`                           |
| status      | String | one of `todo`, `in-progress`, `done`; default `todo` |
| priority    | String | one of `low`, `medium`, `high`; default `medium` |
| dueDate     | Date   | optional, can be `null`                          |
| createdAt / updatedAt | Date | automatic (`{ timestamps: true }`)     |

## Response format

Success: `{ "success": true, "data": ... }`
Error: `{ "success": false, "error": "message" }`

The frontend shows the `error` text in a red toast.

## Endpoints

| Method | Path             | Body                 | Success | Errors                  |
| ------ | ---------------- | -------------------- | ------- | ----------------------- |
| GET    | `/api/tasks`     | none                 | 200, array | 500                  |
| GET    | `/api/tasks/:id` | none                 | 200, task  | 400 bad id, 404      |
| POST   | `/api/tasks`     | task fields          | 201, created task | 400 validation |
| PATCH  | `/api/tasks/:id` | any subset of fields | 200, updated task | 400, 404      |
| DELETE | `/api/tasks/:id` | none                 | 200 (or 204) | 400, 404           |

### Query params for `GET /api/tasks` (level 2, do these after basic CRUD works)

| param      | example          | meaning                                         |
| ---------- | ---------------- | ----------------------------------------------- |
| `status`   | `?status=done`   | only that status                                |
| `priority` | `?priority=high` | only that priority                              |
| `search`   | `?search=mongo`  | title contains text, case-insensitive (`$regex`) |
| `sort`     | `?sort=dueDate`  | `dueDate` ascending, `priority` high to low; default newest first |

## Things to test from the UI

- The frontend validates the title too, so test your backend's **400** with Postman / Thunder Client: `POST /api/tasks` with `{}`.
- Edit a task. The frontend calls `GET /api/tasks/:id` first, then `PATCH`.
- Tick the checkbox. It sends `PATCH { "status": "done" }`.
- Stop the server. The dot at the top turns red.
- The **Request log** panel shows every request, its status code, and its body.

## CORS

The frontend runs on a different port from the API, so the backend needs `cors`:

```js
const cors = require("cors");
app.use(cors());
```
