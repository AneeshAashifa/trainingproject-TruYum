namespace TruYum.Api.Models
{
    public class MenuItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool Active { get; set; }
        public DateTime LaunchDate { get; set; }
        public string Category { get; set; } = string.Empty;
    }
}
