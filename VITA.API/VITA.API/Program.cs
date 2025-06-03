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
builder.Services.AddDbContext<VitaContext>(o => o.UseInMemoryDatabase("vita"));
builder.Services.AddIdentityCore<ApplicationUser>()
                .AddEntityFrameworkStores<VitaContext>();

/*--------------------------------------------------
| 2. JWT                                           |
--------------------------------------------------*/
string jwtKey = builder.Configuration["JwtKey"] ?? "super-secret-key-123456";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
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
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("dev", p => p
        .WithOrigins(
            "http://localhost:8081",   // Expo Web / Metro
            "http://10.0.2.2:5055",   // Emulador Android → API sem HTTPS
            "http://localhost:5055")  // Navegador desktop
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

/*--------------------------------------------------
| 4. MVC + Swagger                                 |
--------------------------------------------------*/
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

/*--------------------------------------------------
| 5. APP PIPELINE                                  |
--------------------------------------------------*/
var app = builder.Build();

// Swagger sempre disponível em dev; em prod opcional
app.UseSwagger();
app.UseSwaggerUI();

if (!app.Environment.IsDevelopment())
{
    // Em produção mantenha HTTPS
    app.UseHttpsRedirection();
}
else
{
    // Em dev aceita HTTP e habilita CORS amplo
    app.UseCors("dev");
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
