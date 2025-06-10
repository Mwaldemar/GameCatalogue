using GameAPI.Models;

namespace GameAPI.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}