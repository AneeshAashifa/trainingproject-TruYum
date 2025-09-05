using Microsoft.AspNetCore.Mvc;
using TruYum.Api.Data;
using System.Linq;

namespace TruYum.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MenuController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetMenu()
        {
            var items = _context.MenuItems.ToList();
            return Ok(items);
        }
    }
}
