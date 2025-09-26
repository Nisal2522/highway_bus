# Simple database setup script
Write-Host "Setting up Highway Express database..." -ForegroundColor Green

# Database connection parameters
$DB_HOST = "localhost"
$DB_PORT = "3307"
$DB_NAME = "highway_express_db"
$DB_USER = "root"
$DB_PASSWORD = "Nisal@2522"

# Check if MySQL is available
try {
    mysql --version
    Write-Host "MySQL is available" -ForegroundColor Green
} catch {
    Write-Host "MySQL is not available. Please install MySQL and add it to PATH." -ForegroundColor Red
    exit 1
}

# Run the SQL script
Write-Host "Executing database setup script..." -ForegroundColor Yellow

try {
    mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD < setup_database_simple.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database setup completed successfully!" -ForegroundColor Green
        Write-Host "You can now use the application." -ForegroundColor Green
    } else {
        Write-Host "Failed to set up database. Please check your database connection and credentials." -ForegroundColor Red
    }
} catch {
    Write-Host "Error running database setup: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
