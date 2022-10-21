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
    [Route("api/[controller]")]
    public class SymptomsController : ControllerBase
    {
        private IRepositoryWrapper _repositoryWrapper;
        private IMapper _mapper;
        public SymptomsController(IRepositoryWrapper repositoryWrapper, IMapper mapper)
        {
            _repositoryWrapper = repositoryWrapper;
            _mapper = mapper;
        }

        [HttpGet("GetAllSymptoms", Name = "GetAllSymptoms")]
        public ActionResult<List<SymptomDto>> GetAllSymptoms()
        {
            var Symptoms = _repositoryWrapper.Symptom.FindAll().OrderBy(on => on.SymptomName);
            return _mapper.Map<IEnumerable<SymptomDto>>(Symptoms).ToList();
        }


        [HttpGet("GetSymptomById/{SymptomId}", Name = "GetSymptomById")]
        public ActionResult<SymptomDto> GetSymptomById(int SymptomId)
        {
            var symptom = _repositoryWrapper.Symptom.FindByCondition(x => x.SymptomId == SymptomId);

            if (symptom == null)
            {
                return NotFound();
            }

            return _mapper.Map<SymptomDto>(symptom);
        }

        [HttpPost("AddSymptom", Name = "AddSymptom")]
        public ActionResult<SymptomDto> AddSymptom([FromQuery] string value)
        {
            Symptom symptom = new Symptom() { SymptomName = value };
            _repositoryWrapper.Symptom.Create(symptom);
            _repositoryWrapper.Save();
            // return CreatedAtRoute("GetSymptomById", new { SymptomId = symptom.SymptomId }, symptom);
            return _mapper.Map<SymptomDto>(symptom);
        }

        [HttpPut("UpdateSymptom", Name = "UpdateSymptom")]
        [ApiConventionMethod(typeof(DefaultApiConventions),
                    nameof(DefaultApiConventions.Update))]
        public IActionResult UpdateSymptom([FromBody] SymptomDto symptom)
        {
            if (_repositoryWrapper.Symptom.FindByCondition(x => x.SymptomId == symptom.SymptomId).Count() == 1)
            {
                _repositoryWrapper.Symptom.Update(_mapper.Map<Symptom>(symptom));
                _repositoryWrapper.Save();
                return NoContent();

            }
            else
            {
                return NotFound();
            }

        }

        [HttpDelete("DeleteSymptom/{SymptomId}", Name = "DeleteSymptom")]
        [ApiConventionMethod(typeof(DefaultApiConventions),
                     nameof(DefaultApiConventions.Delete))]
        public IActionResult DeleteSymptom(int SymptomId)
        {
            var symptom = _repositoryWrapper.Symptom.FindByCondition(x => x.SymptomId == SymptomId).FirstOrDefault();
            if (symptom == null)
            {
                return NotFound();
            }

            _repositoryWrapper.Symptom.Delete(symptom);
            _repositoryWrapper.Save();
            return NoContent();

        }
    }
}
