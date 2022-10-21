using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using mediassistwebapi.Contracts;
using mediassistwebapi.Entities.DataTransferObjects;
using mediassistwebapi.Entities.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mediassistwebapi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class MedicinesController : ControllerBase
    {
        private IRepositoryWrapper _repositoryWrapper;
        private IMapper _mapper;
        public MedicinesController(IRepositoryWrapper repositoryWrapper, IMapper mapper)
        {
            _repositoryWrapper = repositoryWrapper;
            _mapper = mapper;
        }

        [HttpGet("GetAllMedicines", Name = "GetAllMedicines")]
        public ActionResult<List<MedicineDto>> GetAllMedicines()
        {
            var medicines = _repositoryWrapper.Medicine.FindAll().OrderBy(on => on.MedicineName);

            if (medicines == null)
            {
                return NotFound();
            }

            return _mapper.Map<IEnumerable<MedicineDto>>(medicines).ToList();
        }

        [HttpGet("GetMedicineById/{MedicineId}", Name = "GetMedicineById")]
        public ActionResult<MedicineDto> GetMedicineById(int MedicineId)
        {
            var medicine = _repositoryWrapper.Medicine.FindByCondition(x => x.MedicineId == MedicineId);

            if (medicine == null)
            {
                return NotFound();
            }

            return _mapper.Map<MedicineDto>(medicine);
        }

        [HttpPost("AddMedicine", Name = "AddMedicine")]
        public ActionResult<MedicineDto> AddMedicine([FromQuery] string MedicineName)
        {
            Medicine medicine = new Medicine() { MedicineName = MedicineName };
            _repositoryWrapper.Medicine.Create(medicine);
            _repositoryWrapper.Save();
            return _mapper.Map<MedicineDto>(medicine);
        }

        [HttpPut("UpdateMedicine", Name = "UpdateMedicine")]
        [ApiConventionMethod(typeof(DefaultApiConventions),
                     nameof(DefaultApiConventions.Update))]
        public IActionResult UpdateMedicine([FromBody] MedicineDto medicine)
        {
            if (_repositoryWrapper.Medicine.FindByCondition(x => x.MedicineId == medicine.MedicineId).Count() == 1)
            {
                _repositoryWrapper.Medicine.Update(_mapper.Map<Medicine>(medicine));
                _repositoryWrapper.Save();
                return NoContent();

            }
            else
            {
                return NotFound();
            }

        }

        [HttpDelete("DeleteMedicine/{MedicineId}", Name = "DeleteMedicine")]
        [ApiConventionMethod(typeof(DefaultApiConventions),
                     nameof(DefaultApiConventions.Delete))]
        public IActionResult DeleteMedicine(int MedicineId)
        {
            var medicine = _repositoryWrapper.Medicine.FindByCondition(x => x.MedicineId == MedicineId).FirstOrDefault();

            if (medicine == null)
            {
                return NotFound();
            }

            _repositoryWrapper.Medicine.Delete(medicine);
            _repositoryWrapper.Save();
            return NoContent();

        }

    }
}
