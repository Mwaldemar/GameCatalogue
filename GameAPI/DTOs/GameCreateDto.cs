namespace GameAPI.DTOs
{
    public class GameCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public int ReleaseYear { get; set; }
        public string Type { get; set; } = string.Empty;
        public string? Studio { get; set; }
        public decimal PriceOnLaunch { get; set; }
        public string? ImageUrl { get; set; }

        public List<int> TagIds { get; set; } = new List<int>();
    }

}