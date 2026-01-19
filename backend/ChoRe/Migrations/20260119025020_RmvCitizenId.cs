using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChoRe.Migrations
{
    /// <inheritdoc />
    public partial class RmvCitizenId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CitizenIdBackImage",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CitizenIdFrontImage",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CitizenIdNumber",
                table: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CitizenIdBackImage",
                table: "Users",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CitizenIdFrontImage",
                table: "Users",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CitizenIdNumber",
                table: "Users",
                type: "nvarchar(12)",
                maxLength: 12,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                columns: new[] { "CitizenIdBackImage", "CitizenIdFrontImage", "CitizenIdNumber" },
                values: new object[] { "cccd-back.jpg", "cccd-front.jpg", "123123123123" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                columns: new[] { "CitizenIdBackImage", "CitizenIdFrontImage", "CitizenIdNumber" },
                values: new object[] { "cccd-back.jpg", "cccd-front.jpg", "123123123123" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 3,
                columns: new[] { "CitizenIdBackImage", "CitizenIdFrontImage", "CitizenIdNumber" },
                values: new object[] { "cccd-back.jpg", "cccd-front.jpg", "123123123123" });
        }
    }
}
