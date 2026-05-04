using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChoRe.Migrations
{
    /// <inheritdoc />
    public partial class AddShippingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "EndDate",
                table: "UserSubscriptions",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<DateTime>(
                name: "AutoCompleteAt",
                table: "EscrowTransations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EstimatedDeliveryAt",
                table: "EscrowTransations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EstimatedDeliveryDays",
                table: "EscrowTransations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ShippedAt",
                table: "EscrowTransations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "EscrowTransations",
                keyColumn: "EscrowTransId",
                keyValue: 1,
                columns: new[] { "AutoCompleteAt", "EstimatedDeliveryAt", "EstimatedDeliveryDays", "ShippedAt" },
                values: new object[] { null, null, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AutoCompleteAt",
                table: "EscrowTransations");

            migrationBuilder.DropColumn(
                name: "EstimatedDeliveryAt",
                table: "EscrowTransations");

            migrationBuilder.DropColumn(
                name: "EstimatedDeliveryDays",
                table: "EscrowTransations");

            migrationBuilder.DropColumn(
                name: "ShippedAt",
                table: "EscrowTransations");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EndDate",
                table: "UserSubscriptions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }
    }
}
