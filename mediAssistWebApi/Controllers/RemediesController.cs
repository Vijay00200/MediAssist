using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using mediassistwebapi.Contracts;
using mediassistwebapi.Entities.DataTransferObjects;
using mediassistwebapi.Entities.Models;
using mediassistwebapi.Entities.Parameter;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace mediassistwebapi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class RemediesController : ControllerBase
    {
        private IRepositoryWrapper _repositoryWrapper;
        private IMapper _mapper;
        public RemediesController(IRepositoryWrapper repositoryWrapper, IMapper mapper)
        {
            _repositoryWrapper = repositoryWrapper;
            _mapper = mapper;
        }

        [HttpGet("GetRemedyById/{RemedyId}", Name = "GetRemedyById")]
        public ActionResult<RemedyDto> GetRemedyById(int RemedyId)
        {
            var remedy = _repositoryWrapper.Remedy.GetRemedyById(RemedyId);

            if (remedy == null)
            {
                return NotFound();
            }

            return _mapper.Map<RemedyDto>(remedy);
        }

        [HttpGet("SearchRemedies", Name = "SearchRemedies")]
        public ActionResult<List<RemedyDto>> SearchRemedies([FromQuery] SearchRemedyParams remedyParameters)
        {
            var remedies = _repositoryWrapper.Remedy.GetAllRemedies(remedyParameters);

            var metadata = new
            {
                remedies.TotalCount,
                remedies.PageSize,
                remedies.CurrentPage,
                remedies.TotalPages,
                remedies.HasNext,
                remedies.HasPrevious
            };
            Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));
            return _mapper.Map<IEnumerable<RemedyDto>>(remedies).ToList();
        }

        [HttpPost("AddRemedy", Name = "AddRemedy")]
        public ActionResult<RemedyDto> AddRemedy([FromBody] RemedyDto remedy)
        {
            var _remedy = _mapper.Map<Remedy>(remedy);

            _repositoryWrapper.Remedy.Create(_remedy);
            _repositoryWrapper.Save();
            return _mapper.Map<RemedyDto>(_remedy);
        }

        [HttpPatch("UpdateRemedy", Name = "UpdateRemedy")]
        public ActionResult<RemedyDto> UpdateRemedy([FromBody] RemedyDto remedy)
        {
            var _remedy = _mapper.Map<Remedy>(remedy);
            _repositoryWrapper.Remedy.Update(_remedy);
            _repositoryWrapper.Save();
            return _mapper.Map<RemedyDto>(_remedy);
        }


        [HttpDelete("DeleteRemedy/{RemedyId}", Name = "DeleteRemedy")]
        [ApiConventionMethod(typeof(DefaultApiConventions),
                     nameof(DefaultApiConventions.Delete))]
        public IActionResult DeleteRemedy(int RemedyId)
        {
            var remedy = _repositoryWrapper.Remedy.FindByCondition(x => x.RemedyId == RemedyId).FirstOrDefault();
            if (remedy == null)
            {
                return NotFound();
            }

            _repositoryWrapper.Remedy.Delete(remedy);
            _repositoryWrapper.Save();
            return NoContent();
        }

    }
}
