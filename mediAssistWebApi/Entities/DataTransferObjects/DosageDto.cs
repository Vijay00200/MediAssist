using System;

namespace mediassistwebapi.Entities.DataTransferObjects
{
    public class DosageDto
    {
        public int? DosageId { get; set; }
        public int DosageDays { get; set; }
        public int DosageTimes { get; set; }
        public string DosagePower { get; set; }
        // public int RemedyId { get; set; }
        // public RemedyDto Remedy { get; set; }
    }
}
