using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TruYum.Api.Data;

namespace TruYum.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _db;
        public CartController(AppDbContext db) { _db = db; }
        private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var cart = await _db.Carts.Include(c => c.Items).ThenInclude(i => i.MenuItem)
                .FirstOrDefaultAsync(c => c.UserId == UserId) ?? new Models.Cart { UserId = UserId };
            return Ok(cart);
        }

        [HttpPost("add/{menuItemId}")]
        public async Task<IActionResult> Add(int menuItemId)
        {
            var cart = await _db.Carts.Include(c => c.Items).FirstOrDefaultAsync(c => c.UserId == UserId);
            if (cart is null) { cart = new Models.Cart { UserId = UserId }; _db.Carts.Add(cart); }
            var existing = cart.Items.FirstOrDefault(i => i.MenuItemId == menuItemId);
            if (existing is null) cart.Items.Add(new Models.CartItem { MenuItemId = menuItemId, Quantity = 1 });
            else existing.Quantity += 1;
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("remove/{menuItemId}")]
        public async Task<IActionResult> Remove(int menuItemId)
        {
            var cart = await _db.Carts.Include(c => c.Items).FirstOrDefaultAsync(c => c.UserId == UserId);
            if (cart is null) return NotFound();
            var item = cart.Items.FirstOrDefault(i => i.MenuItemId == menuItemId);
            if (item is null) return NotFound();
            cart.Items.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}

