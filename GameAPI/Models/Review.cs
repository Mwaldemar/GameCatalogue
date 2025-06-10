using System.ComponentModel.DataAnnotations;

namespace GameAPI.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;

        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int GameId { get; set; }
        public Game? Game { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }
    }
}