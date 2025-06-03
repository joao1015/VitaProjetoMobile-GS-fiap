namespace VITA.API.Models
{
    public class Report
    {
        public int Id { get; set; }
        public string Type { get; set; } = default!;
        public string Description { get; set; } = default!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // ↓ permitir nulo / vazio
        public string? Address { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string? UserId { get; set; }
    }



}
