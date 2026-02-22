public class ServiceTransactionDto
{
    public int OrderId { get; set; }
    public string? ServiceName { get; set; }
    public string? ServiceType { get; set; }
    public string? ServiceCode { get; set; }
    public decimal ServicePrice { get; set; }
    public string? Status { get; set; }
    public string? StatusDescription { get; set; }
    public int DurationDays { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? ExpiredAt { get; set; }
}