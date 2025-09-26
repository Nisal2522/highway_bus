// Test the seat parsing logic
public class TestSeatParsing {
    public static void main(String[] args) {
        // Test with the actual data format from database
        String[] testSeats = {
            "[10,14]",
            "[1,2]", 
            "[26,30]",
            "[15,16]",
            "[34]",
            "[33]",
            "[32]",
            "[29]"
        };
        
        for (String seatsJson : testSeats) {
            System.out.println("Original: " + seatsJson);
            
            // Apply the same parsing logic as backend
            String cleaned = seatsJson.replaceAll("[\\[\\]\"]", "");
            System.out.println("Cleaned: " + cleaned);
            
            String[] seats = cleaned.split(",");
            System.out.print("Parsed seats: ");
            for (String seat : seats) {
                if (!seat.trim().isEmpty()) {
                    System.out.print(seat.trim() + " ");
                }
            }
            System.out.println("\n---");
        }
    }
}
