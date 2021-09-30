using mediassistwebapi.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace mediassistwebapi.Entities
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions options)
        : base(options)
        {
        }
        // public DbSet<Medicine> Medicines { get; set; }
        // public DbSet<Symptom> Symptoms { get; set; }
        public DbSet<Dosage> Dosages { get; set; }
        public DbSet<Remedy> Remedies { get; set; }
        public DbSet<LoginModel> LoginModels { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // modelBuilder.ApplyGlobalFilters<BaseEntity>(e => !e.Deleted);
            modelBuilder.Entity<LoginModel>().HasData(new LoginModel
            {
                Id = 1,
                UserName = "johndoe",
                Password = "def@123"
            });

        }
    }
}
