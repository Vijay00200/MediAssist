using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace mediassistwebapi.Entities.Models
{
    public class Medicine : BaseEntity
    {
        [Key]
        public int MedicineId { get; set; }
        [Required]
        [MaxLength(200, ErrorMessage = "length must be less than 200 characters")]
        public string MedicineName { get; set; }
        public ICollection<Remedy> Remedy { get; set; }

    }
}
