# aadil-rasheed-server

Express + MongoDB API for the Aadil Rasheed poet website (blog posts, gallery, contact). The frontend lives in [aadil-rasheed-client](https://github.com/adilhusain01/aadil-rasheed-client).

## Getting started

**Prerequisites:** Node.js 18+, npm, a MongoDB connection string, and (for uploads/email/reCAPTCHA) Cloudinary, SMTP and Google reCAPTCHA credentials.

```bash
git clone git@github.com:adilhusain01/aadil-rasheed-server.git
cd aadil-rasheed-server
npm install
cp .env.example .env   # fill in the values below
npm run dev            # nodemon, http://localhost:5000
```

| Script | What it does |
|---|---|
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start` | Start with plain node |
| `npm run seed` | Seed MongoDB with sample blog posts and gallery items |
| `npm run seed:destroy` | Remove the seeded data |

### Environment variables (`.env`)

`NODE_ENV`, `PORT` (default 5000), `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `CLIENT_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `EMAIL_SERVICE`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`, `EMAIL_FROM`, `RECAPTCHA_SECRET_KEY`, `RECAPTCHA_SITE_KEY`.

Allowed CORS origins are listed in `index.js`. Logs are written to `logs/` (created automatically, git-ignored).
