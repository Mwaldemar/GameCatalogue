using AutoMapper;
using GameAPI.Data;
using GameAPI.DTOs;
using Microsoft.EntityFrameworkCore;

namespace GameAPI.Services
{
    public class UserService : IUserService
    {
        private readonly GameDbContext _context;
        private readonly IMapper _mapper;

        public UserService(GameDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserReadDto>> GetAllUsersAsync()
        {
            var users = await _context.Users.AsNoTracking().ToListAsync();
            return _mapper.Map<IEnumerable<UserReadDto>>(users);
        }

        public async Task<UserReadDto?> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);

            return user == null ? null : _mapper.Map<UserReadDto>(user);
        }
    }
}