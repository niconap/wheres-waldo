# Where's Waldo?

This is the Where's Waldo project from The Odin Project's curriculum. The goal is to recreate the Where's Waldo game using HTML, CSS, and JavaScript.

### Running the project

To run the project, the database needs to be set up first. This requires Docker to be installed on your machine. Once Docker is installed, run the following command in the project's root directory:

```bash
$ ./db.sh
```

This will set up a PostgreSQL database and seed it with dummy data. Once the database is set up, you can run the project by opening the `index.html` file in your browser. Edit the contents of `/prisma/seed.js` to change the dummy
data.

To run the Node.js API server, run the following command:

```bash
$ cd src
$ node server.js
```
