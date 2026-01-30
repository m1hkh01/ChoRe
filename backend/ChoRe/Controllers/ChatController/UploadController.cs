using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/upload")]
public class UploadController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Upload(List<IFormFile> files)
    {
        // Kiểm tra nếu không có file nào được gửi lên
        if (files == null || files.Count == 0)
            return BadRequest("File không hợp lệ");

        var urls = new List<string>();
        // Kiểm tra kích thước file
        if (files.Any(file => file.Length > 5 * 1024 * 1024))
        {
            return BadRequest("File không được vượt quá 5MB");
        }
        // Kiểm tra định dạng file
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        foreach (var file in files)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest("Định dạng file không hợp lệ");
            }
        }

        // Tạo thư mục nếu chưa có
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "chat-Image");
        Directory.CreateDirectory(uploadsFolder);

        foreach (var file in files)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            urls.Add(fileName);
        }

        return Ok(new { imageUrls = urls });
    }
}
