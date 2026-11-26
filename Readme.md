# Todo REST API

This is a RESTful API built with Node.js and Express for managing a Todo list. It was created as part of the API Programming course assignment.

## How to run
1. Clone the repository.
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Use the `api-tests.rest` file in VS Code REST Client to test the endpoints.

## Report and Reflection
During this assignment, I learned how to build a RESTful API using Express. I implemented full CRUD operations and simulated a database using an array. I also learned how to use the `uuid` library to generate unique IDs and how to validate inputs to return proper HTTP status codes (400 Bad Request and 404 Not Found). 

Testing the API using the VS Code REST Client was very helpful. It allowed me to quickly verify that all endpoints worked correctly and that the error handling functioned as expected. In the future, I would like to connect this API to a real database (like MongoDB) and build a front-end interface for it.


## How to run the tests (Assignment 5)

1. Make sure the server is running in the background (`npm start`).
2. Open a **new terminal** and run the test suite:
   `npm test`
   
*Note: The tests are written using Jest (for unit tests) and Supertest (for integration tests).*


**Assignment 6**
# Todo REST API

This is a RESTful API built with Node.js and Express for managing a Todo list. It was created as part of the API Programming course assignments.

## Features
*   **Full CRUD Operations** for Todo items.
*   **Refactored Structure:** Separation of routes (`routes/`) and data logic (`todos.js`) for better maintainability.
*   **OpenAPI (Swagger) Documentation** available for testing endpoints directly in the browser.
*   **CSV Output Support:** The `GET /todos` endpoint can return data in `text/csv` format if requested via the `Accept` header.

## How to run
1. Clone the repository.
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. The server runs on **port 8080** (e.g., `http://localhost:8080`).

## API Documentation
Once the server is running, you can access the interactive Swagger UI at:
👉 **`http://localhost:8080/doc`**

## How to run the tests (Assignment 5)
The project includes both unit and integration tests written with Jest and Supertest.

1. Make sure the server is running in the background (`npm start`).
2. Open a **new terminal** and run the test suite:
   `npm test`
   
*Note: Tests are executed sequentially (`--runInBand`) to prevent data interference in the in-memory database.*

## Report and Reflection
During these assignments, I learned how to build a RESTful API using Express, simulate a database using an array, and use the `uuid` library for unique IDs. I implemented input validation to return proper HTTP status codes (400 Bad Request and 404 Not Found).

I also learned how to write automated tests using **Jest** and **Supertest** and how to document APIs using **Swagger (OpenAPI)**. Adding CSV support using the `Accept` header was a great exercise in handling different client preferences.
