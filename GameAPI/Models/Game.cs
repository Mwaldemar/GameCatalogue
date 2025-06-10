namespace GameAPI.Models
{
    public class Game
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int ReleaseYear { get; set; }
        public string Type { get; set; } = string.Empty;
        public string? Studio { get; set; } = string.Empty;
        public decimal PriceOnLaunch { get; set; }

        public ICollection<GameTag> GameTags { get; set; } = new List<GameTag>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}