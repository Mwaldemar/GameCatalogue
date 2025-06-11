namespace GameAPI.DTOs
{
    public class GameUpdateDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? ReleaseYear { get; set; }
        public string? Type { get; set; }
        public string? Studio { get; set; }
        public decimal? PriceOnLaunch { get; set; }
        public string? ImageUrl { get; set; }
        public List<int>? TagIds { get; set; }
    }

}