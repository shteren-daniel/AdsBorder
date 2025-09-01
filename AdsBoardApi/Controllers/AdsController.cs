using Microsoft.AspNetCore.Mvc;
using AdsBoardApi.Models;
using AdsBoardApi.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AdsBoardApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdsController : ControllerBase
{
    private readonly AdsRepository _repo = new();

    [HttpGet]
    public IActionResult Get([FromQuery] string? q)
    {
        var result = _repo.GetAll();
        if (!result.Success)
            return StatusCode(500, ApiResponse<List<Ad>>.FromResult(result));

        var ads = result.Data!;
        if (!string.IsNullOrWhiteSpace(q))
        {
            ads = ads.Where(a =>
                (a.Title?.Contains(q, StringComparison.OrdinalIgnoreCase) ?? false) ||
                (a.Description?.Contains(q, StringComparison.OrdinalIgnoreCase) ?? false))
                .ToList();
        }

        return Ok(ApiResponse<List<Ad>>.Ok(ads));
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var result = _repo.GetAll();
        if (!result.Success)
            return StatusCode(500, ApiResponse<List<Ad>>.FromResult(result));

        var ad = result.Data!.FirstOrDefault(a => a.Id == id);
        return ad is null
            ? NotFound(ApiResponse<Ad>.Fail("מודעה לא נמצאה"))
            : Ok(ApiResponse<Ad>.Ok(ad));
    }

    [HttpPost]
    public IActionResult Create([FromBody] Ad ad)
    {
        var getResult = _repo.GetAll();
        if (!getResult.Success)
            return StatusCode(500, ApiResponse<List<Ad>>.FromResult(getResult));

        var ads = getResult.Data!;
        ad.Id = ads.Any() ? ads.Max(a => a.Id) + 1 : 1;
        ad.UserId = ad.UserId;
        ads.Add(ad);

        var saveResult = _repo.SaveAll(ads);
        if (!saveResult.Success)
            return StatusCode(500, ApiResponse<bool>.FromResult(saveResult));

        return Ok(ApiResponse<Ad>.Ok(ad));
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Ad updatedAd)
    {
        var getResult = _repo.GetAll();
        if (!getResult.Success)
            return StatusCode(500, ApiResponse<List<Ad>>.FromResult(getResult));

        var ads = getResult.Data!;
        var ad = ads.FirstOrDefault(a => a.Id == id);
        if (ad is null)
            return NotFound(ApiResponse<Ad>.Fail("מודעה לא נמצאה"));

        if (ad.UserId != updatedAd.UserId)
            return StatusCode(403, ApiResponse<Ad>.Fail("אין הרשאה לעדכן את המודעה "));

        ad.Title = updatedAd.Title;
        ad.Description = updatedAd.Description;
        ad.Price = updatedAd.Price;
        ad.Location = updatedAd.Location;
        ad.Image = updatedAd.Image;

        var saveResult = _repo.SaveAll(ads);
        if (!saveResult.Success)
            return StatusCode(500, ApiResponse<bool>.FromResult(saveResult));

        return Ok(ApiResponse<Ad>.Ok(ad));
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var getResult = _repo.GetAll();
        if (!getResult.Success)
            return StatusCode(500, ApiResponse<List<Ad>>.FromResult(getResult));

        var ads = getResult.Data!;
        var ad = ads.FirstOrDefault(a => a.Id == id);
        if (ad is null)
            return NotFound(ApiResponse<Ad>.Fail("מודעה לא נמצאה"));

        ads.Remove(ad);

        var saveResult = _repo.SaveAll(ads);
        if (!saveResult.Success)
            return StatusCode(500, ApiResponse<bool>.FromResult(saveResult));

        return Ok(ApiResponse<string>.Ok("המודעה נמחקה בהצלחה"));
    }
}
