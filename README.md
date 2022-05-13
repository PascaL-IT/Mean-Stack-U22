# MEAN Stack Course

Guide to build a real "Posts blog" like application with **Angular** for the frontend (UI, text, image), 
                                               with **Node.js, Express.js, Mongoose** for the backend,
                                               with **MongoDB Atlas** for the database in the cloud.

![image](https://user-images.githubusercontent.com/36189996/159879105-51ce091f-6a14-4e95-8384-d08ed930ec21.png)


- Create a modern and reactive Web app with **Angular** that offers speed, ease of development, asynchronous operations and scalability
- Learn how to connect the SPA (Single Page Application) frontend to a **NodeJS with Express, RxJS and MongoDB** in the backend 
- Hands-on approach, structured around a real application, the main concepts are explained and covered :
  - Set up a NodeJS + Express + MongoDB + Angular application with the help of [Angular CLI](https://github.com/angular/angular-cli)
  - Build reusable Components, Modules in Angular and create a better User Experience (UX) with [Angular Material](https://material.angular.io/)
  - Connect Angular app through HttpClient service to a secure REST API in NodeJS server (endpoints)
  - Add advanced features like pagination, filters (text search, user's posts) and file upload (image)
  - Make the pplication secure by implementing user signup, login, authentication and authorization with JWT
  - Incorporate many different Routes, Observables, Events, Auth Guard, ... Errors Handling.


<br>

![image](https://user-images.githubusercontent.com/36189996/162067122-130f4f29-7dd6-4c3a-8fcb-72c03a52b8d6.png)


<br>

![image](https://user-images.githubusercontent.com/36189996/162067187-554b9918-a77d-4e89-a72a-c51464d104a8.png)

<br>

## Post Blog application deployed on AWS S3, Heroku and MongoDB Atlas 
- Frontent (Angular UI) deployed in a bucket on [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls)
- Backend (NodeJs) deployed on [Heroku PaaS](https://www.heroku.com/platform) (alternative to AWS Elastic Beanstalk)
- Database (MongoDB) deployed on [MongoDB Atlas]'https://www.mongodb.com/atlas/database)

![image](https://user-images.githubusercontent.com/36189996/162066956-1fd34251-c13b-4e1b-82bd-8f950583e619.png)

![image](https://user-images.githubusercontent.com/36189996/162067036-0e67d0f9-cedc-42cd-9410-c3095a965928.png)

<br>

Link to ![image](https://user-images.githubusercontent.com/36189996/162063732-a2ae2a2c-f249-4ce7-91ba-3d68f30d8588.png)
 : http://posts-blog-ui-pl1.s3-website.eu-central-1.amazonaws.com/

![image](https://user-images.githubusercontent.com/36189996/162066381-ea446c89-63c9-4056-b9fe-d08812bf33a9.png)

<br>

## Angular and NodeJs packages
This project is generated with Angular CLI version 13+ , express 4+ , mongoose 6+ , mongoose-unique-validator 3+ , multer 1.4+ 
and other dependencies like rxjs 6+ , typescript 4.5+bcrypt 5+ , body-parser 1.19+ ,  jsonwebtoken 8+ , nodemon 2+ , ...

Environment variables:
- "MONGO_ATLAS_DB_NAME" : "..." ,
- "MONGO_ATLAS_CLUSTER_URI" : "..." ,
- "MONGO_ATLAS_CREDENTIALS" : "..." ,
- "ACA_ORIGIN" : "*" ,
- "ACA_HEADERS" : "Origin, X-Requested-With, Content-Type, Accept, Authorization" ,
- "ACA_METHODS" : "GET, PUT, POST, DELETE" ,
- "JWT_HS256_KEY" : "..." ,
- "JWT_ALGO" : "HS256" ,
- "JWT_EXP_DURATION_SEC" : 3600 ,
- "PORT" : 3000
<br>

## Certificate
![image](https://user-images.githubusercontent.com/36189996/162062727-f52426df-efc0-488b-82f5-0a2e97cedb93.png)
![image](https://user-images.githubusercontent.com/36189996/162067318-4210afbc-157d-4669-9aef-50201bddced6.png)

Ref. https://www.udemy.com/course/angular-2-and-nodejs-the-practical-guide/ 



