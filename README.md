# rest-api-social-app

A CRUD API built with Node Express MongoDB. Swagger used for api documentation. Docker used for containerization.

Key Features :
- Get community
- Add/Delete/Edit posts.
- Add/Delete/Edit comments.

# Run with docker

First you need Docker and docker-compose installed and external or local MongoDB installed.

After you have installed both:

1.  git clone https://github.com/afifpatel/rest-api-social-app.git
2.  cd `rest-api-social-app`
3.  Run `docker-compose up`
4.  You should see at `localhost:3000/api-docs` swagger docs now.
5.  You should see at `localhost:3000` app started.

# Run without docker

Firstable you need Nodejs and MongoDB installed.

After that you should follow next steps:

1.  git clone https://github.com/afifpatel/rest-api-social-app.git
2.  cd `rest-api-social-app`
3.  npm install
4.  Run `node index.js`
5.  You should see at `localhost:3000/api-docs` our swagger docs now.

# Author

Afif Patel
