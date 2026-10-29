# EventBoard

EventBoard is a full-stack web application for creating, managing, and browsing events.  
It features **React + TypeScript + Vite** on the frontend and an **Express + MongoDB + JWT authentication** backend.

EventBoard Deployment URL: https://eventboard-six.vercel.app/

---

## ✨ Features

- 🔑 User authentication (sign up, login, logout)  
- 🔒 Protected routes with JWT access & refresh tokens  
- 👤 Profile management  
- 📅 Event browsing and creation (login required)  
- 🎨 Responsive UI with CSS Modules  

---

## 🛠 Tech Stack

**Frontend**  
- [Vercel](https://vercel.com/) for deployment
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)  
- [Vite](https://vitejs.dev/) for fast dev build & HMR  
- [React Router](https://reactrouter.com/) for routing  
- CSS Modules for component-scoped styling  

**Backend**  
- [Render](https://render.com/) for server deployment
- [Express](https://expressjs.com/) REST API  
- [MongoDB](https://www.mongodb.com/) with Mongoose  
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for authentication  
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) for password hashing  

---

## 🚀 Getting Started

### Requirements

Install Node.js 22+ and have a MongoDB database available. The auth and resource
servers use the same database and access-token secret.

### Configure the services

Copy each `.env.example` to `.env`. Set the MongoDB connection string and
distinct, randomly generated `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`
values in `auth-server/.env`; set the same MongoDB URI and access-token secret
in `resource-server/.env`. Set each `CLIENT_URL` to the frontend origin. The
frontend `.env` contains the two API base URLs.

```bash
cp auth-server/.env.example auth-server/.env
cp resource-server/.env.example resource-server/.env
cp eventboard-fe/.env.example eventboard-fe/.env
```

Use distinct random secrets in production and never commit `.env` files.

### Run locally

In separate terminals:

```bash
cd auth-server && npm ci && npm run dev
cd resource-server && npm ci && npm run dev
cd eventboard-fe && npm ci && npm run dev
```

The frontend runs on `http://localhost:5173`, auth on port `4000`, and the
resource API on port `3000`. For the resource-server Docker setup, put the
resource server settings in `resource-server/.env` and run `docker compose up
--build` from that directory. Compose publishes the resource API on
`http://localhost:4000`.

Refresh tokens are held in an HTTP-only cookie, are rotated on refresh, and
expire after seven days. Production cross-origin cookie use requires HTTPS and
may require first-party/custom API domains in browsers that block third-party
cookies.

The contact form opens the user's configured email application; this site does
not send or store contact messages.
