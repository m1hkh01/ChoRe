using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChoRe.Migrations
{
    /// <inheritdoc />
    public partial class ThemNganHang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BankName",
                table: "EscrowTransations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BankNumber",
                table: "EscrowTransations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "EscrowTransations",
                keyColumn: "EscrowTransId",
                keyValue: 1,
                columns: new[] { "BankName", "BankNumber" },
                values: new object[] { null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BankName",
                table: "EscrowTransations");

            migrationBuilder.DropColumn(
                name: "BankNumber",
                table: "EscrowTransations");
        }
    }
}
