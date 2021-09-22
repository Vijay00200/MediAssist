using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace mediassistwebapi.Entities.Models
{
    public class Remedy : BaseEntity
    {
        public int RemedyId { get; set; }

        public int MedicineId { get; set; }
        public Medicine Medicine { get; set; }
        public int SymptomId { get; set; }
        public Symptom Symptom { get; set; }
        [MaxLength(1000, ErrorMessage = "length must be less than 1000 character")]
        public string Notes { get; set; }

        // public ICollection<Dosage> Dosage { get; set; }
        public Dosage Dosage { get; set; }
    }
}
