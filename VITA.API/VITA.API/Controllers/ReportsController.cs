using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using VITA.API.Data;
using VITA.API.Models;
using VITA.API.Utils;

namespace VITA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly VitaContext _ctx;
    public ReportsController(VitaContext ctx) => _ctx = ctx;

    [HttpGet]
    public async Task<IEnumerable<Report>> GetAll() => await _ctx.Reports.ToListAsync();

    [HttpGet("me")]
    public async Task<IEnumerable<Report>> GetMine()
    {
        var uid = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return await _ctx.Reports.Where(r => r.UserId == uid).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Report>> Create(Report r)
    {
        r.UserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (string.IsNullOrWhiteSpace(r.Address))
            r.Address = await GeoHelper.ReverseAsync(r.Latitude, r.Longitude);

        _ctx.Reports.Add(r);
        await _ctx.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = r.Id }, r);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Report upd)
    {
        var uid = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var r = await _ctx.Reports.FirstOrDefaultAsync(x => x.Id == id && x.UserId == uid);
        if (r == null) return NotFound();

        r.Type = upd.Type; r.Description = upd.Description;
        r.Latitude = upd.Latitude; r.Longitude = upd.Longitude; r.Date = upd.Date;

        if (string.IsNullOrWhiteSpace(upd.Address) ||
            r.Latitude != upd.Latitude || r.Longitude != upd.Longitude)
            r.Address = await GeoHelper.ReverseAsync(upd.Latitude, upd.Longitude);
        else
            r.Address = upd.Address;

        await _ctx.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var uid = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var r = await _ctx.Reports.FirstOrDefaultAsync(x => x.Id == id && x.UserId == uid);
        if (r == null) return NotFound();

        _ctx.Reports.Remove(r);
        await _ctx.SaveChangesAsync();
        return NoContent();
    }
}
