# Campaign Management System

A backend system for managing campaigns, sending personalized messages to customers, and tracking delivery statuses using a delivery receipt API.

---

## Features

- Secured and well documented REST apis.
- AI generated tags.
- Create and manage campaigns.
- Send personalized messages to customers.
- Simulate message delivery success/failure (~90% SENT, ~10% FAILED).
- Log communication details in a database.
- Secure APIs with JWT-based authentication.
- MongoDB integration for data storage.
- Swagger UI for API documentation.

---

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)

---

## [Installation]

1. Clone the repository:
    ```bash

    git clone https://github.com/yogesh2i/xeno_backend.git
    cd xeno_backend

    ```

2. Install dependencies:
   ```bash
    npm install
    ```
## [Environment Varaibles]

3. Setup Environment Variables
```bash
SERVER_URL = http://localhost:5000/api
JWT_SECRET = your_jwt_secret
PORT = 5000
DB_URI = your_db_uri
GEMINI_API_KEY = gemini_api_key
GAUTH_CLIENT_ID = google_auth_client_id
GAUTH_CLIENT_SECRET = google_auth_secret
GAUTH_CALLBACK_URL = google_auth_callback_url

```

4. Start server
    ```bash
    node index.js
    ```

## [API Endpoints]

* checkout api-docs here -
 https://xeno-backend-129m.onrender.com/api-docs/#/

## [Technologies Used]

* Node.js: Backend runtime environment.
* Express.js: Web framework for building APIs.
* MongoDB: NoSQL database for data storage.
* Mongoose: ODM for MongoDB.
* JWT: Authentication and authorization.
* Swagger UI: API documentation.
* swagger-autogen: Automatic Swagger documentation generation.
* Gemini: For generating auto ai-based tags

## [Project Structure]
```
├── models/               # Mongoose models
│   ├── Customer.js
│   ├── Order.js
│   ├── CommunicationLog.js
│   └── DeliveryReceipt.js
├── routes/               # API routes
│   ├── auth.js
│   ├── campaign.js
│   ├── customers.js
│   ├── delivery-receipt.js
│   └── orders.js
├── [swagger.js]            # Swagger autogen configuration
├── [swagger-output.json]   # Generated Swagger documentation
├── [index.js]             # Entry point of the application
├── .env                  # Environment variables
├── [package.json]         # Project metadata and dependencies
└── README.md             # Documentation
```

* Future enhancements:  For scaling and efficient purpose of application, tech like rabbitMQ, kafka can be implemented.
