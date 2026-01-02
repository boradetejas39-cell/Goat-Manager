# MVC Structure Documentation

## Project Structure

```
Goat/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection
│   └── multer.js        # File upload configuration
│
├── controllers/         # Business logic
│   ├── goatController.js
│   ├── logController.js
│   └── reportController.js
│
├── models/              # Database models (Mongoose schemas)
│   ├── Goat.js
│   ├── DailyLog.js
│   └── Preference.js
│
├── routes/              # API route definitions
│   ├── goatRoutes.js
│   ├── logRoutes.js
│   └── reportRoutes.js
│
├── views/               # HTML templates
│   ├── goat.html
│   └── data-viewer.html
│
├── public/              # Static assets
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── img/
│       └── 123.jpeg
│
├── uploads/             # User uploaded files
│
├── docs/                 # Documentation
│   ├── MONGODB_MIGRATION.md
│   └── MVC_STRUCTURE.md
│
├── middleware/           # Custom middleware (empty for now)
│
├── server.js             # Main application entry point
├── package.json
├── .env                  # Environment variables
└── README.md
```

## MVC Components

### Models (`models/`)
- **Goat.js**: Goat schema and model
- **DailyLog.js**: Daily log schema and model
- **Preference.js**: User preferences schema and model

### Views (`views/`)
- **goat.html**: Main application interface
- **data-viewer.html**: Data viewing interface

### Controllers (`controllers/`)
- **goatController.js**: Handles all goat-related operations
  - `getAllGoats()` - Get all goats
  - `getGoatById()` - Get single goat
  - `createGoat()` - Create new goat
  - `updateGoat()` - Update goat
  - `deleteGoat()` - Delete goat

- **logController.js**: Handles daily log operations
  - `getAllLogs()` - Get all logs
  - `getLogsByGoatId()` - Get logs for specific goat
  - `createLog()` - Create new log
  - `updateLog()` - Update log
  - `deleteLog()` - Delete log

- **reportController.js**: Handles financial reports
  - `getSummary()` - Get financial summary
  - `getDetailed()` - Get detailed per-goat report

### Routes (`routes/`)
- **goatRoutes.js**: `/api/goats` endpoints
- **logRoutes.js**: `/api/logs` endpoints
- **reportRoutes.js**: `/api/reports` endpoints

### Config (`config/`)
- **database.js**: MongoDB connection and initialization
- **multer.js**: File upload configuration

## API Endpoints

### Goats
- `GET /api/goats` - Get all goats
- `GET /api/goats/:id` - Get single goat
- `POST /api/goats` - Create goat (with photo upload)
- `PUT /api/goats/:id` - Update goat
- `DELETE /api/goats/:id` - Delete goat

### Logs
- `GET /api/logs` - Get all logs
- `GET /api/logs/goat/:goatId` - Get logs for specific goat
- `POST /api/logs` - Create log
- `PUT /api/logs/:id` - Update log
- `DELETE /api/logs/:id` - Delete log

### Reports
- `GET /api/reports/summary` - Financial summary
- `GET /api/reports/detailed` - Detailed per-goat report

### Health Check
- `GET /api/health` - Server status

## Static Files

All static files are served from the `public/` directory:
- CSS: `/css/style.css`
- JavaScript: `/js/script.js`
- Images: `/img/*`

## Running the Application

```bash
npm start
```

The server will:
1. Connect to MongoDB
2. Initialize default preferences
3. Start listening on port 8080 (or PORT from .env)

## Benefits of MVC Structure

1. **Separation of Concerns**: Each component has a single responsibility
2. **Maintainability**: Easy to find and update code
3. **Scalability**: Easy to add new features
4. **Testability**: Controllers and models can be tested independently
5. **Code Reusability**: Models and controllers can be reused

## File Paths

- Views are served from `views/` directory
- Static assets are served from `public/` directory
- Uploads are stored in `uploads/` directory
- All paths in HTML files use absolute paths starting with `/`

