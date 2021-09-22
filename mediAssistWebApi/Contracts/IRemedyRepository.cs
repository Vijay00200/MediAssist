using mediassistwebapi.Entities.Helpers;
using mediassistwebapi.Entities.Models;
using mediassistwebapi.Entities.Parameter;

namespace mediassistwebapi.Contracts
{
    public interface IRemedyRepository : IRepositoryBase<Remedy>
    {
        PagedList<Remedy> GetAllRemedies(SearchRemedyParams searchRemedyParams);

        Remedy GetRemedyById(int remedyId);
    }
}
