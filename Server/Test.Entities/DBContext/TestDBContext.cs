using Microsoft.EntityFrameworkCore;
using Test.Entities.Models;

namespace Test.Entities.DBContext
{
    public class TestDBContext: DbContext
  {
    public TestDBContext(DbContextOptions<TestDBContext> options) : base(options)
    {

    }

    public DbSet<Trade> Trades { get; set; }
  }
}