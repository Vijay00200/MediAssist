using System;

namespace mediassistwebapi.Entities
{
    public class BaseEntity
    {
        public bool Deleted { get; set; } = false;
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public DateTime UpdatedOn { get; set; } = DateTime.Now;
    }
}
