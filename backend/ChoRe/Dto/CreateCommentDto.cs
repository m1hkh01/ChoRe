using System.ComponentModel.DataAnnotations;

namespace ChoRe.Dto
{
    public class CreateCommentDto
    {
        [Required]
        public int PostId { get; set; }

        [Required]
        [StringLength(1000)]
        public string Content { get; set; }
    }
}
