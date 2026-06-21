# README.md

# MongoDB Integration Project

This project demonstrates the integration of MongoDB with a full-stack application, featuring both a backend and a frontend.

## Project Structure

```
mongodb-integration
├── src
│   ├── backend
│   │   ├── config
│   │   │   └── db.ts
│   │   ├── models
│   │   │   └── index.ts
│   │   ├── routes
│   │   │   └── api.ts
│   │   └── server.ts
│   ├── frontend
│   │   ├── components
│   │   │   └── index.ts
│   │   ├── services
│   │   │   └── api.ts
│   │   └── App.ts
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd mongodb-integration
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the database:**
   - Update the database connection settings in `src/backend/config/db.ts`.

4. **Run the backend server:**
   ```bash
   npm run start:backend
   ```

5. **Run the frontend application:**
   ```bash
   npm run start:frontend
   ```

## Usage Guidelines

- The backend API is accessible at `http://localhost:5000/api`.
- The frontend application can be accessed at `http://localhost:3000`.

## License

This project is licensed under the MIT License.