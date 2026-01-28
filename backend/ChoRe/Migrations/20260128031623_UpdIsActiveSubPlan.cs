using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChoRe.Migrations
{
    /// <inheritdoc />
    public partial class UpdIsActiveSubPlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "SubscriptionPlans",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "SubPlanId",
                keyValue: 1,
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "SubPlanId",
                keyValue: 2,
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "SubPlanId",
                keyValue: 3,
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "SubPlanId",
                keyValue: 4,
                column: "IsActive",
                value: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "SubscriptionPlans");
        }
    }
}
