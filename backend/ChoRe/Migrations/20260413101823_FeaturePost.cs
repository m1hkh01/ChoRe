using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChoRe.Migrations
{
    /// <inheritdoc />
    public partial class FeaturePost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FeaturedDurationDays",
                table: "UserSubUsages",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FeaturedPriority",
                table: "UserSubUsages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RemainingFeaturedPosts",
                table: "UserSubUsages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FeaturedDurationDays",
                table: "SubscriptionPlans",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FeaturedPriority",
                table: "SubscriptionPlans",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaxFeaturedPosts",
                table: "SubscriptionPlans",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FeaturedPriority",
                table: "Posts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "FeaturedUntil",
                table: "Posts",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "Posts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: 1,
                columns: new[] { "FeaturedPriority", "FeaturedUntil", "IsFeatured" },
                values: new object[] { 0, null, false });

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: 2,
                columns: new[] { "FeaturedPriority", "FeaturedUntil", "IsFeatured" },
                values: new object[] { 0, null, false });

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: 3,
                columns: new[] { "FeaturedPriority", "FeaturedUntil", "IsFeatured" },
                values: new object[] { 0, null, false });

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: 4,
                columns: new[] { "FeaturedPriority", "FeaturedUntil", "IsFeatured" },
                values: new object[] { 0, null, false });

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: 5,
                columns: new[] { "FeaturedPriority", "FeaturedUntil", "IsFeatured" },
                values: new object[] { 0, null, false });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "SubPlanId",
                keyValue: 1,
                columns: new[] { "FeaturedDurationDays", "FeaturedPriority", "MaxFeaturedPosts" },
                values: new object[] { 0, 0, 0 });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "SubPlanId",
                keyValue: 2,
                columns: new[] { "FeaturedDurationDays", "FeaturedPriority", "MaxFeaturedPosts" },
                values: new object[] { 0, 0, 0 });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "SubPlanId",
                keyValue: 3,
                columns: new[] { "FeaturedDurationDays", "FeaturedPriority", "MaxFeaturedPosts" },
                values: new object[] { 0, 0, 0 });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "SubPlanId",
                keyValue: 4,
                columns: new[] { "FeaturedDurationDays", "FeaturedPriority", "MaxFeaturedPosts" },
                values: new object[] { 0, 0, 0 });

            migrationBuilder.UpdateData(
                table: "UserSubUsages",
                keyColumn: "UsuId",
                keyValue: 1,
                columns: new[] { "FeaturedDurationDays", "FeaturedPriority", "RemainingFeaturedPosts" },
                values: new object[] { null, 0, 0 });

            migrationBuilder.UpdateData(
                table: "UserSubUsages",
                keyColumn: "UsuId",
                keyValue: 2,
                columns: new[] { "FeaturedDurationDays", "FeaturedPriority", "RemainingFeaturedPosts" },
                values: new object[] { null, 0, 0 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FeaturedDurationDays",
                table: "UserSubUsages");

            migrationBuilder.DropColumn(
                name: "FeaturedPriority",
                table: "UserSubUsages");

            migrationBuilder.DropColumn(
                name: "RemainingFeaturedPosts",
                table: "UserSubUsages");

            migrationBuilder.DropColumn(
                name: "FeaturedDurationDays",
                table: "SubscriptionPlans");

            migrationBuilder.DropColumn(
                name: "FeaturedPriority",
                table: "SubscriptionPlans");

            migrationBuilder.DropColumn(
                name: "MaxFeaturedPosts",
                table: "SubscriptionPlans");

            migrationBuilder.DropColumn(
                name: "FeaturedPriority",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "FeaturedUntil",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "Posts");
        }
    }
}
