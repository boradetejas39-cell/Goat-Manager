# 🐐 Goat Management System

A comprehensive web-based application for managing goat farm operations, including tracking goat information, daily logs, expenses, milk production, and financial reports.

## Features

### 1. **Goat Information Management**
- Register up to 5 goats with detailed information
- Track goat ID/name, age, weight
- Record purchase date and price
- Upload and store goat photos
- View all registered goats in card format

### 2. **Daily Log Entry**
- Record daily activities for each goat
- Track daily feed costs
- Log milk production (in liters)
- Document medical treatments and health notes
- View recent log entries

### 3. **Financial Reports**
- **Total Expenses**: Purchase cost + all feed costs
- **Total Milk Revenue**: Based on milk produced and configured price per liter
- **Net Profit/Loss**: Revenue minus all expenses
- **Average Cost per Goat**: Total expenses divided by number of goats
- **Detailed Breakdown**: Individual profit/loss for each goat

### 4. **Data Persistence**
- Uses MySQL database for persistent storage
- LocalStorage for offline functionality
- Automatic data synchronization

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Additional**: Multer (file uploads), CORS

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Step 1: Install Dependencies

```bash
cd c:\Users\borad\OneDrive\Desktop\html\Goat
npm install
```

### Step 2: Setup Database

1. Open MySQL command line or MySQL Workbench
2. Execute the SQL file to create database and tables:

```bash
mysql -u root -p < database.sql
```

Or copy and paste the contents of `database.sql` into your MySQL client.

### Step 3: Configure Environment Variables

Edit the `.env` file in the Goat directory:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=goat_management
PORT=3000
NODE_ENV=development
MILK_PRICE_PER_LITER=50
MAX_GOATS_ALLOWED=5
CURRENCY_SYMBOL=₹
```

### Step 4: Start the Server

```bash
npm start
```

The server will start at `http://localhost:3000`

### Step 5: Access the Application

Open your web browser and navigate to:
```
http://localhost:3000/goat.html
```

## Database Schema

### Tables

1. **goats**
   - Stores goat information
   - Fields: id, goatId, name, age, weight, purchaseDate, purchasePrice, photo

2. **daily_logs**
   - Records daily activities
   - Fields: id, goat_id, log_date, feed_cost, milk_produced, medical_treatment

3. **medical_treatments**
   - Tracks permanent/regular medical treatments
   - Fields: id, goat_id, treatment_name, treatment_date, cost, frequency

4. **expenses**
   - Additional expense tracking
   - Fields: id, goat_id, expense_type, amount, expense_date, description

5. **milk_production**
   - Detailed milk production tracking
   - Fields: id, goat_id, production_date, quantity, quality, sold, sale_price

### Views

- **financial_summary**: Quick overview of all financial metrics
- **goat_summary**: Detailed summary for each goat

## API Endpoints

### Goats
- `GET /api/goats` - Get all goats
- `GET /api/goats/:id` - Get specific goat
- `POST /api/goats` - Create new goat
- `PUT /api/goats/:id` - Update goat
- `DELETE /api/goats/:id` - Delete goat

### Daily Logs
- `GET /api/logs` - Get all logs
- `GET /api/logs/goat/:goatId` - Get logs for specific goat
- `POST /api/logs` - Create new log
- `PUT /api/logs/:id` - Update log
- `DELETE /api/logs/:id` - Delete log

### Reports
- `GET /api/reports/summary` - Financial summary
- `GET /api/reports/detailed` - Detailed breakdown by goat

## How to Use

### Adding a Goat

1. Navigate to the **"Goat Details"** section
2. Fill in the goat information:
   - Goat ID/Number (unique identifier)
   - Name
   - Age (in years)
   - Weight (in kg)
   - Purchase date
   - Purchase price
   - Optional photo upload
3. Click **"Save Goat Details"**
4. The goat will appear in the "Registered Goats" section below

### Recording Daily Logs

1. Go to the **"Daily Log Entry"** section
2. Select the goat from the dropdown
3. Select the date
4. Enter:
   - Daily feed cost
   - Milk produced (if applicable)
   - Medical treatment/health notes (optional)
5. Click **"Save Daily Log"**
6. Recent logs will display below

### Viewing Reports

1. Navigate to the **"Financial Report"** section
2. Click **"Generate Report"**
3. View the summary cards showing:
   - Total expenses
   - Total milk revenue
   - Net profit/loss
   - Total milk produced
   - Average cost per goat
4. Scroll down to see the detailed breakdown table

## File Structure

```
Goat/
├── goat.html          # Main application HTML
├── style.css          # Styling
├── script.js          # Frontend JavaScript
├── server.js          # Express server
├── database.sql       # Database schema
├── package.json       # Node dependencies
├── .env              # Environment configuration
└── README.md         # This file
```

## Milk Price Configuration

Default milk price is set to ₹50 per liter. To change this:

1. Update the `.env` file:
   ```
   MILK_PRICE_PER_LITER=60
   ```
2. Restart the server

Or update in the database:
```sql
UPDATE preferences SET setting_value = '60' WHERE setting_name = 'milk_price_per_liter';
```

## Offline Mode

The application supports offline mode using browser LocalStorage:
- All data is automatically saved to localStorage
- Works without internet connection
- Data syncs to database when connection is restored

## Troubleshooting

### "Only 5 goats are allowed"
- The system is designed to track up to 5 goats maximum
- Delete an existing goat before adding a new one

### Database connection error
- Ensure MySQL is running
- Check `.env` file for correct credentials
- Verify database name is `goat_management`

### Port already in use
- Change PORT in `.env` file
- Or kill the process using port 3000

### Photo upload not working
- Ensure the `uploads/` directory exists
- Check file size (max 50MB)
- Verify file is an image format

## Security Notes

- Change the default database password in `.env`
- Use environment variables for sensitive data
- Implement user authentication for production
- Validate all inputs on both frontend and backend

## Future Enhancements

- User authentication & authorization
- Export reports to PDF/Excel
- Mobile app version
- Multi-farm support
- Advanced analytics
- Vaccination schedule reminders
- Feed inventory management
- vet appointment tracking

## Support

For issues or questions, please refer to the README or contact the developer.

## License

MIT License - Feel free to use this for personal or commercial projects.

---

**Version**: 1.0.0  
**Last Updated**: December 2025
