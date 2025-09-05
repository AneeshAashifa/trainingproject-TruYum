using TruYum.Api.Models;

namespace TruYum.Api.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // ✅ Ensure database exists
            await context.Database.EnsureCreatedAsync();

            // ✅ Seed default users if none exist
            if (!context.Users.Any())
            {
                context.Users.AddRange(
                    new User
                    {
                        Username = "admin",
                        Password = "admin123",
                        Role = "Admin"
                    },
                    new User
                    {
                        Username = "user",
                        Password = "user123",
                        Role = "User"
                    }
                );
                await context.SaveChangesAsync();
            }

            // ✅ Seed menu items if none exist
            if (!context.MenuItems.Any())
            {
                context.MenuItems.AddRange(
                    new MenuItem
                    {
                        Name = "Margherita Pizza",
                        Description = "Classic cheese pizza",
                        Price = 299,
                        Active = true,
                        LaunchDate = DateTime.Now.AddDays(-10),
                        Category = "Pizza"
                    },
                    new MenuItem
                    {
                        Name = "Paneer Burger",
                        Description = "Crispy paneer burger with sauce",
                        Price = 199,
                        Active = true,
                        LaunchDate = DateTime.Now.AddDays(-5),
                        Category = "Burger"
                    },
                    new MenuItem
                    {
                        Name = "Cold Coffee",
                        Description = "Refreshing iced coffee",
                        Price = 149,
                        Active = true,
                        LaunchDate = DateTime.Now,
                        Category = "Drink"
                    }
                );
                await context.SaveChangesAsync();
            }
        }
    }
}
