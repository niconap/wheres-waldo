# Where's Waldo?

This is the Where's Waldo project from The Odin Project's curriculum. The goal
is to recreate the Where's Waldo game using HTML, CSS, and JavaScript.

### Environment variables

Both the frontend and backend require environment variables in a `.env` file.
Replace the parts between the inequality signs `<` and `>` with the correct
values.

For the frontend, create the file `frontend/.env`, and add the following
variable (make sure the URL does **not** end with a `/`):

```
VITE_API_URL=<API URL>
```

For the backend, create the file `backend/.env`, and add the following
variables:

```
DB_CONTAINER_NAME=waldo-db-container
DB_USER=<username>
DB_PASSWORD=<db_password>
DB_NAME=waldo_db
DB_PORT=5432
DB_IMAGE=postgres:latest
SESSION_SECRET=<session secret>
DATABASE_URL="postgresql://<username>:<db_password>@localhost:5432/waldo_db"
```

### Running the backend

To run the backend, the database needs to be set up first. This requires Docker
to be installed on your machine. Once Docker is installed, run the following
command in the `backend` directory:

```bash
$ ./db.sh
```

This will set up a PostgreSQL database and seed it with dummy data. Once the
database is set up, you can run the backend by running `npm run start` in the
`backend` directory. Edit the contents of `backend/prisma/seed.js` to change the
dummy data.

### Running the frontend

The frontend uses React with TypeScript and Vite. To run the frontend,
first install the dependencies by running the following command in the `frontend`
directory:

```bash
$ npm install
```

Then, run the following command to start the development server:

```bash
$ npm run dev
```

This will start the development server and open the app in your default web
browser. The app will automatically reload if you make any changes to the code.
You can also build the app for production by running the following command:

```bash
$ npm run build
```

This will create a `dist` directory with the production build of the app.
