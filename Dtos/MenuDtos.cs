namespace TruYum.Api.Dtos
{
    public record MenuItemCreateDto(string Name, string Description, decimal Price, bool Active, DateTime LaunchDate, string Category);
    public record MenuItemUpdateDto(string Name, string Description, decimal Price, bool Active, DateTime LaunchDate, string Category);
}