using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ChoRe.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 1,
                column: "PostImage1",
                value: "iphone_13_pdp_position-1b_color_midnight__vn.webp");

            migrationBuilder.UpdateData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 2,
                column: "PostImage1",
                value: "iphone_13_pdp_position-2_size_comparison__vn.webp");

            migrationBuilder.UpdateData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 3,
                column: "PostImage1",
                value: "iphone_13_pdp_position-3_camera__vn.webp");

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: 1,
                columns: new[] { "Price", "Title" },
                values: new object[] { 2000000m, "Bán lại IPhone 13 cũ" });

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "PostId", "Address", "ApprovedAt", "ApprovedBy", "BrandId", "CategoryCateId", "CreatedAt", "Description", "PostStatusId", "Price", "RejectReason", "RejectedAt", "RejectedBy", "SavedCount", "Status", "Title", "UserId", "ViewCount" },
                values: new object[,]
                {
                    { 2, "Hà Nội", new DateTime(2025, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 1, null, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "16GB/512GB PCIE/VGA 4GB RTX3050", 2, 17990000m, "", null, null, 5, "Đã Active", "Bán lại Laptop ASUS TUF Gaming A15 FA506NCG-HN184W", 3, 20 },
                    { 3, "Hà Nội", new DateTime(2025, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 1, null, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chính hãng Apple Việt Nam", 2, 17690000m, "", null, null, 5, "Đã Active", "Bán lại Apple MacBook Air M2 2024", 3, 20 },
                    { 4, "Hà Nội", new DateTime(2025, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 1, null, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "12GB 256GB", 2, 21990000m, "", null, null, 5, "Đã Active", "Bán lại Samsung Galaxy Z Flip7", 3, 20 },
                    { 5, "Hà Nội", new DateTime(2025, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 1, null, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chính hãng Apple Việt Nam", 2, 21990000m, "", null, null, 5, "Đã Active", "Bán lại tai nghe Bluetooth Apple AirPods Pro 2 2023", 3, 20 }
                });

            migrationBuilder.InsertData(
                table: "PostImages",
                columns: new[] { "PostImgId", "PostId", "PostImage1" },
                values: new object[,]
                {
                    { 4, 2, "LapTop_Asus1.webp" },
                    { 5, 2, "LapTop_Asus2.webp" },
                    { 6, 2, "LapTop_Asus3.webp" },
                    { 7, 3, "MacBook1.webp" },
                    { 8, 3, "MacBook2.webp" },
                    { 9, 3, "MacBook3.webp" },
                    { 10, 4, "samsung-galaxy1.webp" },
                    { 11, 4, "samsung-galaxy2.webp" },
                    { 12, 4, "samsung-galaxy3.webp" },
                    { 13, 5, "airpods_pro1.webp" },
                    { 14, 5, "airpods_pro2.webp" },
                    { 15, 5, "airpods_pro3.webp" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: 5);

            migrationBuilder.UpdateData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 1,
                column: "PostImage1",
                value: "iphone13(1).jpg");

            migrationBuilder.UpdateData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 2,
                column: "PostImage1",
                value: "iphone13(2).jpg");

            migrationBuilder.UpdateData(
                table: "PostImages",
                keyColumn: "PostImgId",
                keyValue: 3,
                column: "PostImage1",
                value: "iphone13(3).jpg");

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: 1,
                columns: new[] { "Price", "Title" },
                values: new object[] { 10000000m, "IPhone 13 cũ" });
        }
    }
}
