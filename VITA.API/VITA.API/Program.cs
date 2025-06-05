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
builder.Services.AddCors(options =>
{
    options.AddPolicy("dev", policy => policy
        .SetIsOriginAllowed(origin => true)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
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

app.UseSwagger();
app.UseSwaggerUI();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
else
{
    app.UseCors("dev");
}

// Adiciona URLs públicas (para acesso externo/local)
app.Urls.Add("http://0.0.0.0:5055");
app.Urls.Add("https://0.0.0.0:7290");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
