using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Notes.Models.Entities;

namespace Notes.Data
{
    public class NotesDbContext : DbContext
    {
        public NotesDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Note> Notes { get; set; }
    }
}