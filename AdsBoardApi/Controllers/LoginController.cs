using AdsBoardApi.Models;
using AdsBoardApi.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace AdsBoardApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly TokenService _tokenService;
        private readonly LoginRepository _repo = new();

        public LoginController(TokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpPost]
        public IActionResult Login([FromBody] Login login)
        {
            var getResult = _repo.GetAll();
            if (!getResult.Success)
                return StatusCode(500, ApiResponse<List<Login>>.FromResult(getResult));

            var users = getResult.Data!;
            if (!users.Any())
                return NotFound(ApiResponse<Login>.Fail("לא נמצאו נתונים", forUser: false));
            login.Token = _tokenService.CreateToken(login.UserId);

            var index = users.FindIndex(u => u.UserId == login.UserId && u.Email == login.Email);
            if (index >= 0)
            {
                users[index] = login;
            }
            else
            {
                users.Add(login);
            }

            var saveResult = _repo.Save(users, login);

            if (!saveResult.Success)
                return StatusCode(500, ApiResponse<Login>.FromResult(saveResult));

            return Ok(ApiResponse<Login>.Ok(saveResult.Data!, forUser: false));

        }
    }
}
