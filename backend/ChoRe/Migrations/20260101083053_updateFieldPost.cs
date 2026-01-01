using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChoRe.Migrations
{
    /// <inheritdoc />
    public partial class updateFieldPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "RejectedAt",
                table: "Posts",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RejectedBy",
                table: "Posts",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: 1,
                columns: new[] { "RejectedAt", "RejectedBy" },
                values: new object[] { null, null });

            migrationBuilder.CreateIndex(
                name: "IX_Posts_RejectedBy",
                table: "Posts",
                column: "RejectedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Users_RejectedBy",
                table: "Posts",
                column: "RejectedBy",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Users_RejectedBy",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_RejectedBy",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "RejectedAt",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "RejectedBy",
                table: "Posts");
        }
    }
}
