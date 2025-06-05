using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VITA.API.Models;

namespace VITA.API.Controllers;

[ApiController, Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _um;
    private readonly string _key;
    public AuthController(UserManager<ApplicationUser> um, IConfiguration cfg)
    { _um = um; _key = cfg["JwtKey"]!; }

    public record Cred(string Email, string Password);


    [HttpPost("register")]
    public async Task<IActionResult> Register(Cred c)
    {
        var u = new ApplicationUser { UserName = c.Email, Email = c.Email };
        var r = await _um.CreateAsync(u, c.Password);
        if (!r.Succeeded)
            return BadRequest(r.Errors);

        // Recarrega o usuário do banco para garantir que o ID está populado
        u = await _um.FindByEmailAsync(c.Email);

        // Gera token
        var token = new JwtSecurityTokenHandler().WriteToken(
            new JwtSecurityToken(
                claims: new[] {
                new Claim(JwtRegisteredClaimNames.Sub, u.Id),
                new Claim(JwtRegisteredClaimNames.Email, u.Email!)
                },
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key)),
                    SecurityAlgorithms.HmacSha256)));

        return Ok(new { token });
    }



    [HttpPost("login")]
    public async Task<IActionResult> Login(Cred c)
    {
        var u = await _um.FindByEmailAsync(c.Email);
        if (u == null || !await _um.CheckPasswordAsync(u, c.Password))
            return Unauthorized();

        var token = new JwtSecurityTokenHandler().WriteToken(
            new JwtSecurityToken(
                claims: new[] {
                    new Claim(JwtRegisteredClaimNames.Sub, u.Id),
                    new Claim(JwtRegisteredClaimNames.Email, u.Email!)
                },
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key)),
                    SecurityAlgorithms.HmacSha256)));
        return Ok(new { token });
    }
}
