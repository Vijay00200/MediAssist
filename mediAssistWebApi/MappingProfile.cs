using AutoMapper;
using mediassistwebapi.Entities.DataTransferObjects;
using mediassistwebapi.Entities.Models;

namespace mediassistwebapi
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Dosage, DosageDto>().ReverseMap();
            CreateMap<Medicine, MedicineDto>().ReverseMap();
            CreateMap<Remedy, RemedyDto>().ReverseMap();
            CreateMap<Symptom, SymptomDto>().ReverseMap();
        }
    }
}
