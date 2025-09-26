# Test Booking System - How Seats Get Occupied

## Step 1: Setup Database
Run this in MySQL Workbench or command line:
```sql
-- Copy and paste the entire content of complete_database_setup.sql
-- This will create all tables and sample data
```

## Step 2: Check Current Seat Availability
```sql
USE highway_express_db;

-- Check seat availability for Route 1, Bus 1
SELECT 
    r.from_location,
    r.to_location,
    bus.bus_name,
    bus.seating_capacity,
    COALESCE(SUM(b.number_of_seats), 0) as booked_seats,
    (bus.seating_capacity - COALESCE(SUM(b.number_of_seats), 0)) as available_seats
FROM routes r
CROSS JOIN buses bus
LEFT JOIN bookings b ON b.route_id = r.id AND b.bus_id = bus.id AND b.booking_status = 'CONFIRMED'
WHERE r.id = 1 AND bus.id = 1
GROUP BY r.id, r.from_location, r.to_location, bus.id, bus.bus_name, bus.seating_capacity;
```

## Step 3: Create a New Booking (This will occupy seats)
```sql
-- Insert a new booking
INSERT INTO bookings (
    user_id, route_id, bus_id, passenger_name, passenger_email, 
    passenger_phone, passenger_nic, number_of_seats, selected_seats, 
    total_price, booking_status, booking_date, travel_date
) VALUES 
(1, 1, 1, 'New Passenger', 'new.passenger@email.com', '+94771234570', '111222333V', 3, '["C1", "C2", "C3"]', 5400.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));
```

## Step 4: Check Updated Seat Availability
```sql
-- Run the same query as Step 2 to see the updated availability
-- You should see that available_seats has decreased by 3
```

## Step 5: Test via API
You can also test this via the REST API:

### Create a booking via API:
```bash
curl -X POST http://localhost:8081/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "routeId": 1,
    "busId": 1,
    "passengerName": "API Test User",
    "passengerEmail": "api.test@email.com",
    "passengerPhone": "+94771234571",
    "passengerNic": "444555666V",
    "numberOfSeats": 2,
    "selectedSeats": "[\"D1\", \"D2\"]",
    "totalPrice": 3600.00
  }'
```

### Check available seats via API:
```bash
curl -X GET "http://localhost:8081/api/bookings/available-seats?busId=1&routeId=1"
```

## How It Works:

1. **Initial State**: Bus has 45 seats, 0 booked
2. **After Sample Data**: Bus has 45 seats, 3 booked (2+1 from sample data)
3. **After New Booking**: Bus has 45 seats, 6 booked (3+3 from new booking)
4. **Available Seats**: 45 - 6 = 39 seats available

## Key Points:

- ✅ Each booking reduces available seats
- ✅ Only CONFIRMED bookings count as occupied
- ✅ CANCELLED bookings don't occupy seats
- ✅ The system prevents overbooking
- ✅ Real-time seat availability checking

## Frontend Integration:
When you click the "Book Package" button in the frontend:
1. It calls the booking API
2. The API checks seat availability
3. If seats are available, it creates the booking
4. The seats become occupied immediately
5. Other users see updated availability
