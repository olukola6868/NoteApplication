using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Notes.Data;
using Notes.Models.Entities;

namespace Notes.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController :Controller
    {
        private readonly NotesDbContext notesDbContext;
        public NotesController(NotesDbContext notesDbContext)
        {
            this.notesDbContext = notesDbContext;
        }
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllNotes()
        {
            var note = await notesDbContext.Notes.ToListAsync();
            return Ok(note);
        }


        [HttpGet]
        [Route("Get/{id}")]
        public async Task<IActionResult> GetNoteById([FromRoute]Guid id)
        {
            // await notesDbContext.Notes.FirstOrDefaultAsync(x =>x.Id == id);
            var note = await notesDbContext.Notes.FindAsync(id);
            if(note == null)
            {
                return NotFound();
            }
            return Ok(note);
        }

        [HttpPost("CreateNote")]
        public async Task<IActionResult> AddNote(Note note)
        {
            note.Id = Guid.NewGuid();
            await notesDbContext.AddAsync(note);
            await notesDbContext.SaveChangesAsync();

            return Ok(note);
        }

        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> UpdateNote([FromRoute] Guid id , [FromBody] Note updateNote)
        {
            var existingNote = await notesDbContext.Notes.FindAsync(id);
            if(existingNote == null)
            {
                return NotFound();
            }
            existingNote.Title = updateNote.Title;
            existingNote.Description = updateNote.Description;
            existingNote.isVisible = updateNote.isVisible;

            await notesDbContext.SaveChangesAsync();

            return Ok(existingNote);
        }

        [HttpDelete]
        [Route("Delete/{id:Guid}")]
        public async Task<IActionResult> DeleteNote([FromRoute] Guid id)
        {
            var existingNote = await notesDbContext.Notes.FindAsync(id);
            if(existingNote == null)
            {
                return NotFound();
            }
            notesDbContext.Notes.Remove(existingNote);
            await notesDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}