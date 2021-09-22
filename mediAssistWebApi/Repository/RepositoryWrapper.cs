using mediassistwebapi.Contracts;
using mediassistwebapi.Entities;

namespace mediassistwebapi.Repository
{
    public class RepositoryWrapper : IRepositoryWrapper
    {
        private ApplicationContext _applicationContext;
        private IDosageRepository _dosageRepository;
        private IMedicineRepository _medicineRepository;
        private IRemedyRepository _remedyRepository;
        private ISymptomRepository _symptomRepository;

        public IDosageRepository Dosage
        {
            get
            {
                return _dosageRepository ?? new DosageRepository(_applicationContext);
            }
        }

        public IMedicineRepository Medicine
        {
            get
            {
                return _medicineRepository ?? new MedicineRepository(_applicationContext);
            }
        }

        public IRemedyRepository Remedy
        {
            get
            {
                return _remedyRepository ?? new RemedyRepository(_applicationContext);
            }
        }

        public ISymptomRepository Symptom
        {
            get
            {
                return _symptomRepository ?? new SymptomRepository(_applicationContext);
            }
        }

        public void Save()
        {
            _applicationContext.SaveChanges();
        }

        public RepositoryWrapper(ApplicationContext applicationContext)
        {
            _applicationContext = applicationContext;
        }
    }
}
