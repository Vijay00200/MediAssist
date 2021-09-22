using System;
using mediassistwebapi.Entities.Models;
using mediassistwebapi.Extensions;
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyGlobalFilters<BaseEntity>(e => !e.Deleted);

        }
    }
}
