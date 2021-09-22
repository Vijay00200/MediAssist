using System;
using System.Collections.Generic;

namespace mediassistwebapi.Entities.DataTransferObjects
{
    public class RemedyDto
    {
        public int RemedyId { get; set; }
        public int MedicineId { get; set; }
        // public MedicineDto Medicine { get; set; }
        public int SymptomId { get; set; }
        // public SymptomDto Symptom { get; set; }
        public string Notes { get; set; }
        // public ICollection<DosageDto> Dosage { get; set; }
        public DosageDto Dosage { get; set; }
    }
}
