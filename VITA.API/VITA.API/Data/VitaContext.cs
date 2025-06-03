using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VITA.API.Models;

namespace VITA.API.Data;

public class VitaContext : IdentityDbContext<ApplicationUser>
{
    public VitaContext(DbContextOptions<VitaContext> o) : base(o) { }
    public DbSet<Report> Reports => Set<Report>();
}
