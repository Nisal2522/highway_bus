# PowerShell script to set up booking database
# Make sure MySQL is running and you have the correct credentials

Write-Host "Setting up booking database..." -ForegroundColor Green

# Database connection parameters
$DB_HOST = "localhost"
$DB_PORT = "3306"
$DB_NAME = "highway_express"
$DB_USER = "root"
$DB_PASSWORD = ""

# Check if MySQL is available
try {
    mysql --version
    Write-Host "MySQL is available" -ForegroundColor Green
} catch {
    Write-Host "MySQL is not available. Please install MySQL and add it to PATH." -ForegroundColor Red
    exit 1
}

# Run the SQL script
Write-Host "Executing booking database setup script..." -ForegroundColor Yellow

# First, let's check if the database exists, if not create it
Write-Host "Checking if database exists..." -ForegroundColor Yellow
if ($DB_PASSWORD -eq "") {
    mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
} else {
    mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
}

# Now run the booking setup script
Write-Host "Setting up booking tables..." -ForegroundColor Yellow
if ($DB_PASSWORD -eq "") {
    mysql -h $DB_HOST -P $DB_PORT -u $DB_USER $DB_NAME < booking_database_setup.sql
} else {
    mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME < booking_database_setup.sql
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Booking database setup completed successfully!" -ForegroundColor Green
    Write-Host "You can now use the booking functionality." -ForegroundColor Green
} else {
    Write-Host "Failed to set up booking database. Please check your database connection and credentials." -ForegroundColor Red
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
