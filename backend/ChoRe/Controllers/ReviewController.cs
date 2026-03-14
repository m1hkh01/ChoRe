using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/review")]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;
    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateReview([FromForm] CreateReviewRequest request)
    {
        try
        {
            var review = await _reviewService.CreateReviewAsync(request);
            return Ok(new { message = "Đánh giá thành công" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPost("{id:int}")]
    public async Task<IActionResult> UpdateReview(int id, [FromForm] UpdateReviewRequest request)
    {
        try
        {
            var review = await _reviewService.UpdateReviewAsync(id, request);
            return Ok(new { message = "Cập nhật đánh giá thành công" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}