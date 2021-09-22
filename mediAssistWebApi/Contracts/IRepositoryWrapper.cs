using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using mediassistwebapi.Entities.Models;

namespace mediassistwebapi.Contracts
{
      public interface IRepositoryWrapper
    {
        IDosageRepository Dosage { get; }
        IMedicineRepository Medicine { get; }
        IRemedyRepository Remedy { get; }
        ISymptomRepository Symptom { get; }
        void Save();
    }
}
