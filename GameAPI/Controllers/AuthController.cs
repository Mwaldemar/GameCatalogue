using Microsoft.AspNetCore.Mvc;
using GameAPI.DTOs;
using GameAPI.Services;

namespace GameAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDto request)
        {
            var user = await _authService.RegisterAsync(request);

            if (user == null)
            {
                return BadRequest("Username already exists");
            }

            return Ok("User created");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            var response = await _authService.LoginAsync(request);

            if (response == null)
            {
                return BadRequest("Invalid credentials");
            }

            return Ok(response);
        }
    }

}