using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChoRe.Migrations
{
    /// <inheritdoc />
    public partial class UpdSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "BrandCates",
                columns: new[] { "BrandId", "CateId" },
                values: new object[] { 1, 3 });

            migrationBuilder.UpdateData(
                table: "PostStatuses",
                keyColumn: "PostStatusId",
                keyValue: 1,
                column: "Description",
                value: "Tin đăng đang chờ phê duyệt!");

            migrationBuilder.UpdateData(
                table: "PostStatuses",
                keyColumn: "PostStatusId",
                keyValue: 2,
                column: "Description",
                value: "Tin đăng đã được phê duyệt!");

            migrationBuilder.InsertData(
                table: "PostStatuses",
                columns: new[] { "PostStatusId", "Description", "PostStatusName" },
                values: new object[] { 3, "Tin đăng đã bị từ chối!", "Reject" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "BrandCates",
                keyColumns: new[] { "BrandId", "CateId" },
                keyValues: new object[] { 1, 3 });

            migrationBuilder.DeleteData(
                table: "PostStatuses",
                keyColumn: "PostStatusId",
                keyValue: 3);

            migrationBuilder.UpdateData(
                table: "PostStatuses",
                keyColumn: "PostStatusId",
                keyValue: 1,
                column: "Description",
                value: "");

            migrationBuilder.UpdateData(
                table: "PostStatuses",
                keyColumn: "PostStatusId",
                keyValue: 2,
                column: "Description",
                value: "");
        }
    }
}
