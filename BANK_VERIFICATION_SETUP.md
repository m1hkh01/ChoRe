# Bank Account Verification Setup Guide

## Overview
Hệ thống này hỗ trợ xác minh thông tin ngân hàng của người bán sau khi thanh toán thành công.

## Components Added

### Frontend
1. **BankDetailsModal.jsx** - Modal cho người bán nhập thông tin ngân hàng
   - Lấy danh sách ngân hàng từ VietQR API
   - Gọi backend để xác minh tài khoản
   - Hiển thị các ngân hàng trong dropdown

2. **TransactionActions.jsx** - Updated
   - Thêm nút "Nhập thông tin ngân hàng" cho người bán khi status = "Paid"

3. **EscrowTransactionCard.jsx** - Updated
   - Thêm state cho BankDetailsModal
   - Xử lý việc lưu thông tin ngân hàng

4. **ReasonRefundModal.jsx** - Updated
   - Hiển thị thông tin ngân hàng khi người mua yêu cầu hoàn tiền

5. **bankService.js** - Helper service
   - Cung cấp hàm để lấy danh sách ngân hàng từ VietQR

### Backend
1. **VerifyBankRequestDto.cs** - New DTO
   ```csharp
   public string BankCode { get; set; }
   public string BankName { get; set; }
   public string AccountNumber { get; set; }
   ```

2. **VerifyBankResponseDto.cs** - New DTO
   ```csharp
   public bool Success { get; set; }
   public string Message { get; set; }
   public string BankName { get; set; }
   public string AccountHolder { get; set; }
   ```

3. **TransactionController.cs** - Updated
   - Thêm endpoint POST: `/api/transaction/verify-bank/{id}`

4. **IEscrowTransactionService.cs** - Updated
   - Thêm method: `VerifyAndSaveBankDetails(int transactionId, VerifyBankRequestDto req)`

5. **RefundRequestDto.cs** - Updated
   - Thêm fields: `BankName`, `BankNumber`

6. **EscrowTransation.cs** Model
   - Đã có fields: `BankNumber`, `BankName`

## Configuration Required

### Backend appsettings.json
Cần thêm cấu hình cho bank lookup API:

```json
{
  "BankLookup": {
    "ApiUrl": "https://api.banklookup.net",
    "ApiKey": "YOUR_API_KEY",
    "ApiSecret": "YOUR_API_SECRET"
  }
}
```

### Update Backend Code
File `IEscrowTransactionService.cs`, method `VerifyAndSaveBankDetails`:
- Thay thế `"YOUR_API_KEY"` với giá trị thực từ configuration
- Thay thế `"YOUR_API_SECRET"` với giá trị thực từ configuration

Ví dụ:
```csharp
var apiKey = _configuration["BankLookup:ApiKey"];
var apiSecret = _configuration["BankLookup:ApiSecret"];
var apiUrl = _configuration["BankLookup:ApiUrl"];
```

## API Flows

### 1. Get Bank List (Frontend)
```
GET https://api.vietqr.io/v2/banks
```
Response:
```json
{
  "code": "00",
  "data": [
    {
      "id": 1,
      "code": "BIDV",
      "name": "Ngân hàng Đầu tư và Phát triển Việt Nam",
      "logo": "..."
    }
  ]
}
```

### 2. Verify Bank Account (Frontend → Backend → BankLookup API)
```
POST /api/transaction/verify-bank/{transactionId}
Content-Type: application/json

{
  "bankCode": "BIDV",
  "bankName": "Ngân hàng Đầu tư và Phát triển Việt Nam",
  "accountNumber": "1234567890"
}
```

Backend sẽ gọi:
```
POST https://api.banklookup.net
Headers:
  - x-api-key: {apiKey}
  - x-api-secret: {apiSecret}
  - Content-Type: application/json

Body:
{
  "bank": "BIDV",
  "account": "1234567890"
}
```

Response:
```json
{
  "success": true,
  "message": "Xác minh tài khoản thành công",
  "bankName": "Ngân hàng Đầu tư và Phát triển Việt Nam",
  "accountHolder": "NGUYEN VAN A"
}
```

## Database Changes
- Không cần migration mới - fields `BankName` và `BankNumber` đã tồn tại trong model `EscrowTransation`

## Testing Steps

1. **Test Bank List**
   - Mở modal nhập ngân hàng
   - Verify dropdown hiển thị danh sách ngân hàng từ VietQR

2. **Test Account Verification**
   - Chọn ngân hàng và nhập tài khoản
   - Click "Lưu thông tin"
   - Backend gọi bank lookup API
   - Verify message trả về

3. **Test Refund Flow**
   - Người mua yêu cầu hoàn tiền
   - Verify thông tin ngân hàng hiển thị trong ReasonRefundModal

## Notes
- VietQR API không cần authentication (public API)
- BankLookup API cần API key và secret (required to be configured)
- Bank account verification response được lưu vào database
- Thông tin ngân hàng sẽ hiển thị khi người mua yêu cầu hoàn tiền
