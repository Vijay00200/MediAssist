
using mediassistwebapi.Contracts;
using mediassistwebapi.Entities;
using mediassistwebapi.Entities.Helpers;
using mediassistwebapi.Entities.Parameter;
using mediassistwebapi.Entities.Models;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace mediassistwebapi.Repository
{
    public class RemedyRepository : RepositoryBase<Remedy>, IRemedyRepository
    {
        protected new ApplicationContext RepositoryContext { get; set; }
        public RemedyRepository(ApplicationContext applicationContext) : base(applicationContext)
        {
            this.RepositoryContext = applicationContext;
        }

        public PagedList<Remedy> GetAllRemedies(SearchRemedyParams searchRemedyParams)
        {

            return PagedList<Remedy>.ToPagedList(this.RepositoryContext.Remedies
                                                        .Where(x => x.MedicineId == searchRemedyParams.MedicineId ||
                                                             x.SymptomId == searchRemedyParams.SymptomId)
                                                             .Include(x=>x.Dosage)
                                                             .OrderBy(on => on.RemedyId)
                                                             .AsNoTracking(),
                                                             searchRemedyParams.PageNumber,
                                                             searchRemedyParams.PageSize);
        }

        public Remedy GetRemedyById(int remedyId)
        {

            return this.RepositoryContext.Remedies.Where(x => x.RemedyId == remedyId)
                                                 .Include(x => x.Medicine)
                                                 .Include(x => x.Symptom)
                                                 .Include(x=>x.Dosage)
                                                 .FirstOrDefault();

        }

    }
}
