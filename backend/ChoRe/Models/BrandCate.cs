using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class BrandCate
    {
        [Key, Column(Order = 0)]
        [ForeignKey("Brand")]
        public int BrandId { get; set; }

        [Key, Column(Order = 1)]
        [ForeignKey("Category")]
        public int CateId { get; set; }

        // Navigation properties
        public virtual Brand Brand { get; set; }
        public virtual Category Category { get; set; }
    }
}
