using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using mediassistwebapi.Contracts;
using mediassistwebapi.Entities;
using mediassistwebapi.Entities.Models;
using mediassistwebapi.Entities.Parameter;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace mediassistwebapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration configuration;
        readonly ApplicationContext userContext;
        readonly ITokenService tokenService;
        public AuthController(IConfiguration Configuration, ApplicationContext userContext, ITokenService tokenService)
        {
            configuration = Configuration;
            this.userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
            this.tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));

        }
        [HttpPost, Route("login")]
        public IActionResult Login([FromBody] LoginModel loginModel)
        {
            if (loginModel == null)
            {
                return BadRequest("Invalid client request");
            }
            var user = userContext.LoginModels
                                .FirstOrDefault(u => (u.UserName == loginModel.UserName) &&
                                                        (u.Password == loginModel.Password));

            if (user == null)
            {
                return Unauthorized();
            }
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, loginModel.UserName),
            // new Claim(ClaimTypes.Role, "Manager")
        };
            var accessToken = tokenService.GenerateAccessToken(claims);
            var refreshToken = tokenService.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(2);
            userContext.SaveChanges();

            return Ok(new TokenApiModel(){
                AccessToken=accessToken,
                RefreshToken=refreshToken
            });
        }

    }
}
