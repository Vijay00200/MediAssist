
using mediassistwebapi.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace mediassistwebapi.Contracts
{
     public interface ISymptomRepository : IRepositoryBase<Symptom>
    {
        IEnumerable<Symptom> SearchSymptoms(string symptomName);
    }
}
