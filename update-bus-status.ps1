# PowerShell script to update bus status to PENDING
Write-Host "Updating bus status to PENDING for testing..." -ForegroundColor Green

# Update bus 1 to PENDING
try {
    $response1 = Invoke-WebRequest -Uri "http://localhost:8081/api/buses/1/status?status=PENDING" -Method PUT
    Write-Host "Bus 1 updated successfully: $($response1.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Error updating bus 1: $($_.Exception.Message)" -ForegroundColor Red
}

# Update bus 4 to PENDING
try {
    $response4 = Invoke-WebRequest -Uri "http://localhost:8081/api/buses/4/status?status=PENDING" -Method PUT
    Write-Host "Bus 4 updated successfully: $($response4.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Error updating bus 4: $($_.Exception.Message)" -ForegroundColor Red
}

# Check pending buses
try {
    $pendingResponse = Invoke-WebRequest -Uri "http://localhost:8081/api/buses/pending" -Method GET
    Write-Host "Pending buses response: $($pendingResponse.Content)" -ForegroundColor Yellow
} catch {
    Write-Host "Error checking pending buses: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Script completed!" -ForegroundColor Green
