public class ServiceTransactionDto
{
    public string? ServiceName { get; set; }
    public string? ServiceType { get; set; }
    public string? ServiceCode { get; set; }
    public decimal ServicePrice { get; set; }
    // public int StatusId{ get; set; }
    public int DurationDays { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime ExpiredAt { get; set; }
}