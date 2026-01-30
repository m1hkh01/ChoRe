// Tạo custom exception
public class EmailAlreadyExistsException : Exception
{
    public EmailAlreadyExistsException(string email)
        : base($"Email '{email}' đã tồn tại trong hệ thống.")
    {
    }
}