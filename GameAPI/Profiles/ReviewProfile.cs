using AutoMapper;
using GameAPI.DTOs;
using GameAPI.Models;

namespace GameAPI.Profiles
{
    public class ReviewProfile : Profile
    {
        public ReviewProfile()
        {
            CreateMap<Review, ReviewReadDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom((src, dest) =>
                    src.User != null ? src.User.Username : "Unknown"));

            CreateMap<ReviewUpdateDto, Review>();

            CreateMap<ReviewCreateDto, Review>();
        }
    }
}
