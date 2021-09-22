using mediassistwebapi.Contracts;
using mediassistwebapi.Entities;
using mediassistwebapi.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mediassistwebapi.Repository
{
     public class SymptomRepository : RepositoryBase<Symptom>, ISymptomRepository
    {
        public SymptomRepository(ApplicationContext applicationContext) : base(applicationContext)
        {

        }

        public IEnumerable<Symptom> SearchSymptoms(string symptomName)
        {
            return FindByCondition(x => x.SymptomName.ToLower().Contains(symptomName.Trim().ToLower()))
                        .Take(20)
                        .ToList<Symptom>();
        }
    }
}
