# Attendly Backend

A Geotemporal attendance system backend service.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file in the root directory with the following variables:
```env
PORT=9000
MONGO_DB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=604800
```

## Database Seeding

There are multiple ways to seed data into the database:

### 1. Run All Seeders
To run all seeders in sequence:
```bash
node src/seeders/index.js
```

### 2. Run Individual Seeders
To run a specific seeder:
```bash
node src/seeders/facultySeeder.js
```

### 3. Programmatic Seeding
You can also use the seeder utility directly in your code:

```javascript
const Seeder = require('./utils/seeder');
const Model = require('./models/YourModel');

const data = [
  // your data array
];

// Options are optional
const options = {
  clearBefore: true,     // Clear existing data before seeding
  skipDuplicates: true   // Skip duplicates based on unique fields
};

await Seeder.seed(Model, data, options);
```

## API Routes

### Authentication
- POST `/api/auth/register/student` - Register a new student
- POST `/api/auth/register/lecturer` - Register a new lecturer
- POST `/api/auth/login` - Login for both students and lecturers

## Development

Start the development server:
```bash
npm run dev
```

## Production

Start the production server:
```bash
npm start
``` 