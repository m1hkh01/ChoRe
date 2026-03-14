namespace ChoRe.DTOs
{
    public class BrandDto
    {
        public int BrandId { get; set; }
        public string BrandName { get; set; }
        public string BrandLogo { get; set; }        // filename, served via /uploads/{BrandLogo}
        public int? ParentBrandId { get; set; }
        public List<BrandDto> SubBrands { get; set; } = new();
    }

    public class CategoryHierarchyDto
    {
        public int CateId { get; set; }
        public string CateName { get; set; }
        public string Description { get; set; }
        public int? ParentCateId { get; set; }
        public List<CategoryHierarchyDto> SubCategories { get; set; } = new();
        public List<BrandDto> Brands { get; set; } = new();   // brands linked via BrandCate
    }
}