using AutoMapper;
using GameAPI.DTOs;
using GameAPI.Models;

namespace GameAPI.Profiles
{
    public class TagProfile : Profile
    {
        public TagProfile()
        {
            CreateMap<Tag, TagReadDto>();

            CreateMap<TagCreateDto, Tag>();
        }
    }
}
