using System;

namespace mediassistwebapi.Entities.Parameter
{
    public class AddRemedyParams
    {
        public int medicineId { get; set; }
        public int symptomId { get; set; }
        public Dosage dosage { get; set; }
        public string notes { get; set; }
    }

    public class Dosage
    {
        public string power { get; set; }
        public int days { get; set; }
        public int times { get; set; }
    }

}
