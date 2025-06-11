namespace GameAPI.DTOs
{
    public class GameReadDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int ReleaseYear { get; set; }
        public string Type { get; set; } = string.Empty;
        public string? Studio { get; set; }
        public decimal PriceOnLaunch { get; set; }
        public string? ImageUrl { get; set; }
        public List<TagReadDto> Tags { get; set; } = new List<TagReadDto>();
    }
}
