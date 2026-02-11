public class ConfirmTransactionDto
{
    public int TransactionId{ get; set; }
    public bool IsBuyer { get; set; }
    public int PostPrice { get; set; } 
    public bool UpdatePrice { get; set; }
}