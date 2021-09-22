using mediassistwebapi.Contracts;
using mediassistwebapi.Entities;
using mediassistwebapi.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mediassistwebapi.Repository
{
    
    public class MedicineRepository:RepositoryBase<Medicine>,IMedicineRepository
    {
        public MedicineRepository(ApplicationContext applicationContext):base(applicationContext)
        {

        }
    }
}
