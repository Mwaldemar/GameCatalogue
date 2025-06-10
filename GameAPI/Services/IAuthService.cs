using GameAPI.DTOs;
using GameAPI.Models;

namespace GameAPI.Services
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(UserDto request);
        Task<AuthResponseDto?> LoginAsync(LoginDto request);
    }
}