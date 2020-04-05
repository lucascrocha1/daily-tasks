namespace DailyTasks.Server.Infrastructure
{
    using DailyTasks.Server.Models;
    using Microsoft.EntityFrameworkCore;

    public class DailyTaskContext : DbContext
    {
        public DailyTaskContext(DbContextOptions<DailyTaskContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>(opts =>
            {
                opts.HasMany(e => e.DailyTasks)
                    .WithOne(e => e.Category)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<DailyTask>(opts =>
            {
                opts.HasMany(e => e.Comments)
                    .WithOne(e => e.DailyTask)
                    .OnDelete(DeleteBehavior.Cascade);

                opts.HasMany(e => e.Checklists)
                    .WithOne(e => e.DailyTask)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<DailyTaskComment>();

            modelBuilder.Entity<DailyTaskAttachment>();

            modelBuilder.Entity<DailyTaskCommentAttachment>();

            modelBuilder.Entity<DailyTaskChecklist>();

            base.OnModelCreating(modelBuilder);
        }
    }
}