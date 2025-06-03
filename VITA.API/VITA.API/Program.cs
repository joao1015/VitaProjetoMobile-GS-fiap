// Program.cs

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using VITA.API.Data;
using VITA.API.Models;

var builder = WebApplication.CreateBuilder(args);

/*--------------------------------------------------
| 1. CONFIGURAÇÃO DE BANCO (In-Memory) + IDENTITY  |
--------------------------------------------------*/
builder.Services.AddDbContext<VitaContext>(options =>
    options.UseInMemoryDatabase("vita"));

builder.Services.AddIdentityCore<ApplicationUser>()
                .AddEntityFrameworkStores<VitaContext>();

/*--------------------------------------------------
| 2. JWT                                           |
--------------------------------------------------*/
string jwtKey = builder.Configuration["JwtKey"] ?? "super-secret-key-123456";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

/*--------------------------------------------------
| 3. CORS (origens de desenvolvimento)             |
--------------------------------------------------*/
// Nesta configuração, aceitamos qualquer host:porta e ainda permitimos credenciais.
builder.Services.AddCors(options =>
{
    options.AddPolicy("dev", policy => policy
        .SetIsOriginAllowed(origin => true) // aceita qualquer origem (host + porta)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()                // permite enviar cookies/Auth headers
    );
});

/*--------------------------------------------------
| 4. MVC + Swagger                                 |
--------------------------------------------------*/
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

/*--------------------------------------------------
| 5. APP PIPELINE                                  |
--------------------------------------------------*/

// Swagger sempre disponível em desenvolvimento
app.UseSwagger();
app.UseSwaggerUI();

if (!app.Environment.IsDevelopment())
{
    // Em produção, forçar HTTPS
    app.UseHttpsRedirection();
}
else
{
    // Em desenvolvimento, habilitar CORS amplo
    app.UseCors("dev");
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
