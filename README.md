# Pet Stay Application

## Overview
This repository contains the source code for a web application called "Pet Stay." Pet Stay is a platform that connects pet owners with pet sitters and provides information about dog breeds. It uses React for the front-end, Prisma for the database, and Express for the server.

## Features
- **Authentication**: Users can sign in and register using Auth0 authentication.
- **User Profile**: Users can update their profile information, including name, contact details, and address.
- **Supplier Registration**: Suppliers can register by providing their information, such as email, name, phone number, rate, address, and experience.
- **Finding a Pet Sitter**: Users can search for pet sitters and view their details.
- **Dog Breed Information**: Users can access information about various dog breeds.
- **Order Management**: Users can place orders with pet sitters and view their order history.
- **Authentication Debugging**: There is a built-in authentication debugger for debugging purposes.

## Prerequisites
- Node.js and npm installed.
- Auth0 account for authentication.
- MySQL database for storing data (configured in Prisma).

## Installation
1. Clone the repository to your local machine.
2. Navigate to the project directory.

### Frontend Setup
3. Install dependencies:
   ```shell
   npm install

4. Create a `.env.local` file in the root directory and set the following environment variables:
    REACT_APP_AUTH0_DOMAIN=your-auth0-domain
    REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
    REACT_APP_AUTH0_AUDIENCE=your-auth0-audience
    Replace `your-auth0-domain`, `your-auth0-client-id`, and `your-auth0-audience` with your actual Auth0 configuration values.

5. Start the React development server:

    ```shell
    npm start

### Backend Setup
1. Navigate to the server directory: 
    ```shell
    cd server

2. Install server dependencies:
    ```shell
    npm install

3. Create a .env file in the server directory and set the following environment variables:
    DATABASE_URL=your-mysql-database-url
    AUTH0_AUDIENCE=your-auth0-audience
    AUTH0_ISSUER=your-auth0-issuer

    Replace your-mysql-database-url, your-auth0-audience, and your-auth0-issuer with your actual database and Auth0 configuration values.

4. Start the Express server:
    ```shell
    npm start

## Usage
- Visit the application in your web browser at http://localhost:3000.
- Sign up or log in to access the features.
- Explore and interact with the various functionalities.

## Author
Xin Sun

Feel free to contribute, report issues, or provide feedback!
