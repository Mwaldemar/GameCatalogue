using AutoMapper;
using GameAPI.DTOs;
using GameAPI.Models;

namespace GameAPI.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserReadDto>();
        }
    }
}
