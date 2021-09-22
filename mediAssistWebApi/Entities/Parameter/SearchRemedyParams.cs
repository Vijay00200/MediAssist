namespace mediassistwebapi.Entities.Parameter
{
    public class SearchRemedyParams : QueryStringParameters
    {
        public int? MedicineId { get; set; }
        public int? SymptomId { get; set; }
    }
}
