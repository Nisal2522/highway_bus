#!/bin/bash

echo "Starting Highway Express Backend..."
echo ""
echo "Make sure you have:"
echo "1. Java 11+ installed"
echo "2. MySQL running with highway_express_db database"
echo ""

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "Error: Java is not installed or not in PATH"
    exit 1
fi

echo "Starting the application..."
./mvnw spring-boot:run
