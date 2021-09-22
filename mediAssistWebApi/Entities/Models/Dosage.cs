using System.ComponentModel.DataAnnotations;

namespace mediassistwebapi.Entities.Models
{
    public class Dosage : BaseEntity
    {
        [Key]
        public int DosageId { get; set; }
        public int DosageDays { get; set; }
        public int DosageTimes { get; set; }
        public string DosagePower { get; set; }
        public int RemedyId { get; set; }
        public Remedy Remedy { get; set; }

    }
}
