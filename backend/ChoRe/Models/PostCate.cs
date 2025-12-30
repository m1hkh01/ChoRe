using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class PostCate
    {
        [Key, Column(Order = 0)]
        [ForeignKey("Post")]
        public int PostId { get; set; }

        [Key, Column(Order = 1)]
        [ForeignKey("Category")]
        public int CateId { get; set; }

        // Navigation properties
        public virtual Post Post { get; set; }
        public virtual Category Category { get; set; }
    }
}
