using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChoRe.Migrations
{
    /// <inheritdoc />
    public partial class AddShippedStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "EscrowTransStatuses",
                columns: new[] { "EscTransStatusId", "Description", "StatusName" },
                values: new object[] { 11, "Đã gửi hàng", "Shipped" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "EscrowTransStatuses",
                keyColumn: "EscTransStatusId",
                keyValue: 11);
        }
    }
}
