using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace mediassistwebapi.Entities.Models
{
    public class Symptom : BaseEntity
    {
        [Key]
        public int SymptomId { get; set; }

        [Required]
        [MaxLength(500, ErrorMessage = "length must be less than 500 characters")]
        public string SymptomName { get; set; }

        public ICollection<Remedy> Remedy { get; set; }

    }
}
