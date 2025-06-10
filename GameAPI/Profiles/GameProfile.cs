using AutoMapper;
using GameAPI.DTOs;
using GameAPI.Models;

public class GameProfile : Profile
{
    public GameProfile()
    {
        CreateMap<Game, GameReadDto>()
            .ForMember(dest => dest.Tags,
                       opt => opt.MapFrom(src => src.GameTags.Select(gt => gt.Tag)));

        CreateMap<GameCreateDto, Game>()
            .ForMember(dest => dest.GameTags, opt => opt.Ignore());

        CreateMap<GameReadDto, Game>()
            .ForMember(dest => dest.GameTags, opt => opt.Ignore());
    }
}
