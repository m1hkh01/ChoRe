namespace ChoRe.Dto
{
    public class CategoryTreeDto
    {
        public int CateId { get; set; }
        public string CateName { get; set; }
        public int? ParentCateId { get; set; }
        public List<CategoryTreeDto> Children { get; set; } = new();
    }
}
