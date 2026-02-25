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
            migrationBuilder.CreateTable(
                name: "Brands",
                columns: table => new
                {
                    BrandId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrandName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    BrandLogo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ParentBrandId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brands", x => x.BrandId);
                    table.ForeignKey(
                        name: "FK_Brands_Brands_ParentBrandId",
                        column: x => x.ParentBrandId,
                        principalTable: "Brands",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CateId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CateName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ParentCateId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CateId);
                    table.ForeignKey(
                        name: "FK_Categories_Categories_ParentCateId",
                        column: x => x.ParentCateId,
                        principalTable: "Categories",
                        principalColumn: "CateId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DisputeStatuses",
                columns: table => new
                {
                    DisStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DisStatusName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DisputeStatuses", x => x.DisStatusId);
                });

            migrationBuilder.CreateTable(
                name: "EmailOtps",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OtpCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpiredAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailOtps", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EscrowTransStatuses",
                columns: table => new
                {
                    EscTransStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EscrowTransStatuses", x => x.EscTransStatusId);
                });

            migrationBuilder.CreateTable(
                name: "PostRepStatuses",
                columns: table => new
                {
                    PostRepStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PostRepStatusName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostRepStatuses", x => x.PostRepStatusId);
                });

            migrationBuilder.CreateTable(
                name: "PostStatuses",
                columns: table => new
                {
                    PostStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PostStatusName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostStatuses", x => x.PostStatusId);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionPlans",
                columns: table => new
                {
                    SubPlanId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    SubPlanName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SubPlanTitle = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SubPlanPromo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    SubPlanPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    DurationDays = table.Column<int>(type: "int", nullable: false),
                    MaxPostPerSub = table.Column<int>(type: "int", nullable: false),
                    MaxFreePlatformFeePerSub = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxFreePost = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscriptionPlans", x => x.SubPlanId);
                });

            migrationBuilder.CreateTable(
                name: "BrandCates",
                columns: table => new
                {
                    BrandId = table.Column<int>(type: "int", nullable: false),
                    CateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BrandCates", x => new { x.BrandId, x.CateId });
                    table.ForeignKey(
                        name: "FK_BrandCates_Brands_BrandId",
                        column: x => x.BrandId,
                        principalTable: "Brands",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BrandCates_Categories_CateId",
                        column: x => x.CateId,
                        principalTable: "Categories",
                        principalColumn: "CateId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Specifications",
                columns: table => new
                {
                    SpecId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specifications", x => x.SpecId);
                    table.ForeignKey(
                        name: "FK_Specifications_Categories_CateId",
                        column: x => x.CateId,
                        principalTable: "Categories",
                        principalColumn: "CateId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Avatar = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    IsLocked = table.Column<bool>(type: "bit", nullable: false),
                    LockReason = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "RoleId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false),
                    RelatedId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    PostId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", maxLength: 5000, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PriceType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    MinPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    MaxPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    PostStatusId = table.Column<int>(type: "int", nullable: false),
                    ApprovedBy = table.Column<int>(type: "int", nullable: true),
                    ApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RejectedBy = table.Column<int>(type: "int", nullable: true),
                    RejectedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RejectReason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ViewCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SavedCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    BrandId = table.Column<int>(type: "int", nullable: true),
                    CategoryCateId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => x.PostId);
                    table.ForeignKey(
                        name: "FK_Posts_Brands_BrandId",
                        column: x => x.BrandId,
                        principalTable: "Brands",
                        principalColumn: "BrandId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Posts_Categories_CategoryCateId",
                        column: x => x.CategoryCateId,
                        principalTable: "Categories",
                        principalColumn: "CateId");
                    table.ForeignKey(
                        name: "FK_Posts_PostStatuses_PostStatusId",
                        column: x => x.PostStatusId,
                        principalTable: "PostStatuses",
                        principalColumn: "PostStatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Posts_Users_ApprovedBy",
                        column: x => x.ApprovedBy,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Posts_Users_RejectedBy",
                        column: x => x.RejectedBy,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Posts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Ratings",
                columns: table => new
                {
                    RatingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FromUserId = table.Column<int>(type: "int", nullable: false),
                    ToUserId = table.Column<int>(type: "int", nullable: false),
                    Star = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    RatingImage = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ratings", x => x.RatingId);
                    table.ForeignKey(
                        name: "FK_Ratings_Users_FromUserId",
                        column: x => x.FromUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Ratings_Users_ToUserId",
                        column: x => x.ToUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionOrders",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    SubPlanId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OrdStatusId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PaidAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExpiredAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscriptionOrders", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK_SubscriptionOrders_EscrowTransStatuses_OrdStatusId",
                        column: x => x.OrdStatusId,
                        principalTable: "EscrowTransStatuses",
                        principalColumn: "EscTransStatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SubscriptionOrders_SubscriptionPlans_SubPlanId",
                        column: x => x.SubPlanId,
                        principalTable: "SubscriptionPlans",
                        principalColumn: "SubPlanId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SubscriptionOrders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserSubscriptions",
                columns: table => new
                {
                    UserSubId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    SubPlanId = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSubscriptions", x => x.UserSubId);
                    table.ForeignKey(
                        name: "FK_UserSubscriptions_SubscriptionPlans_SubPlanId",
                        column: x => x.SubPlanId,
                        principalTable: "SubscriptionPlans",
                        principalColumn: "SubPlanId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserSubscriptions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserSubUsages",
                columns: table => new
                {
                    UsuId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RemainingSubFPF = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RemainingSubPost = table.Column<int>(type: "int", nullable: false),
                    RemainingFreePost = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSubUsages", x => x.UsuId);
                    table.ForeignKey(
                        name: "FK_UserSubUsages_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    CmtId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PostId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.CmtId);
                    table.ForeignKey(
                        name: "FK_Comments_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "PostId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EscrowTransations",
                columns: table => new
                {
                    EscrowTransId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BuyerUserId = table.Column<int>(type: "int", nullable: false),
                    SellerUserId = table.Column<int>(type: "int", nullable: false),
                    PostId = table.Column<int>(type: "int", nullable: false),
                    EscrowTransStatusId = table.Column<int>(type: "int", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PostPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PlatformFee = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    ExpiredAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BuyerConfirmed = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    SellerConfirmed = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    TransactionOrderCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsRated = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EscrowTransations", x => x.EscrowTransId);
                    table.ForeignKey(
                        name: "FK_EscrowTransations_EscrowTransStatuses_EscrowTransStatusId",
                        column: x => x.EscrowTransStatusId,
                        principalTable: "EscrowTransStatuses",
                        principalColumn: "EscTransStatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EscrowTransations_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "PostId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EscrowTransations_Users_BuyerUserId",
                        column: x => x.BuyerUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EscrowTransations_Users_SellerUserId",
                        column: x => x.SellerUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PostCates",
                columns: table => new
                {
                    PostId = table.Column<int>(type: "int", nullable: false),
                    CateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostCates", x => new { x.PostId, x.CateId });
                    table.ForeignKey(
                        name: "FK_PostCates_Categories_CateId",
                        column: x => x.CateId,
                        principalTable: "Categories",
                        principalColumn: "CateId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostCates_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "PostId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostImages",
                columns: table => new
                {
                    PostImgId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PostId = table.Column<int>(type: "int", nullable: false),
                    PostImage1 = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostImages", x => x.PostImgId);
                    table.ForeignKey(
                        name: "FK_PostImages_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "PostId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostReports",
                columns: table => new
                {
                    ReportId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportedFromUserId = table.Column<int>(type: "int", nullable: false),
                    ReportedPostId = table.Column<int>(type: "int", nullable: true),
                    Reason = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    ReportImage = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PostRepStatusId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostReports", x => x.ReportId);
                    table.ForeignKey(
                        name: "FK_PostReports_PostRepStatuses_PostRepStatusId",
                        column: x => x.PostRepStatusId,
                        principalTable: "PostRepStatuses",
                        principalColumn: "PostRepStatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PostReports_Posts_ReportedPostId",
                        column: x => x.ReportedPostId,
                        principalTable: "Posts",
                        principalColumn: "PostId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostReports_Users_ReportedFromUserId",
                        column: x => x.ReportedFromUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PostSpecifications",
                columns: table => new
                {
                    PostSpecId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PostId = table.Column<int>(type: "int", nullable: false),
                    SpecId = table.Column<int>(type: "int", nullable: false),
                    SpecValue = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostSpecifications", x => x.PostSpecId);
                    table.ForeignKey(
                        name: "FK_PostSpecifications_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "PostId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostSpecifications_Specifications_SpecId",
                        column: x => x.SpecId,
                        principalTable: "Specifications",
                        principalColumn: "SpecId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SavedPosts",
                columns: table => new
                {
                    SavedPostId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PostId = table.Column<int>(type: "int", nullable: false),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedPosts", x => x.SavedPostId);
                    table.ForeignKey(
                        name: "FK_SavedPosts_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "PostId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedPosts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChatRooms",
                columns: table => new
                {
                    ChatRoomId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BuyerId = table.Column<int>(type: "int", nullable: false),
                    SellerId = table.Column<int>(type: "int", nullable: false),
                    PostId = table.Column<int>(type: "int", nullable: false),
                    CurrentEscrowTransId = table.Column<int>(type: "int", nullable: true),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastMessageAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastMessageContent = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatRooms", x => x.ChatRoomId);
                    table.ForeignKey(
                        name: "FK_ChatRooms_EscrowTransations_CurrentEscrowTransId",
                        column: x => x.CurrentEscrowTransId,
                        principalTable: "EscrowTransations",
                        principalColumn: "EscrowTransId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ChatRooms_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "PostId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ChatRooms_Users_BuyerId",
                        column: x => x.BuyerId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ChatRooms_Users_SellerId",
                        column: x => x.SellerId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Disputes",
                columns: table => new
                {
                    DisputeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EscrowTransId = table.Column<int>(type: "int", nullable: false),
                    OpenedByUserId = table.Column<int>(type: "int", nullable: false),
                    DisputeReason = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    AssignedByAdminUserId = table.Column<int>(type: "int", nullable: true),
                    Decision = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DecisionNote = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Disputes", x => x.DisputeId);
                    table.ForeignKey(
                        name: "FK_Disputes_DisputeStatuses_StatusId",
                        column: x => x.StatusId,
                        principalTable: "DisputeStatuses",
                        principalColumn: "DisStatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Disputes_EscrowTransations_EscrowTransId",
                        column: x => x.EscrowTransId,
                        principalTable: "EscrowTransations",
                        principalColumn: "EscrowTransId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Disputes_Users_AssignedByAdminUserId",
                        column: x => x.AssignedByAdminUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Disputes_Users_OpenedByUserId",
                        column: x => x.OpenedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    ChatMessId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChatRoomId = table.Column<int>(type: "int", nullable: false),
                    FromUserId = table.Column<int>(type: "int", nullable: false),
                    ChatContent = table.Column<string>(type: "nvarchar(max)", maxLength: 5000, nullable: false),
                    MessageType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    TransationId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.ChatMessId);
                    table.ForeignKey(
                        name: "FK_ChatMessages_ChatRooms_ChatRoomId",
                        column: x => x.ChatRoomId,
                        principalTable: "ChatRooms",
                        principalColumn: "ChatRoomId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatMessages_EscrowTransations_TransationId",
                        column: x => x.TransationId,
                        principalTable: "EscrowTransations",
                        principalColumn: "EscrowTransId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ChatMessages_Users_FromUserId",
                        column: x => x.FromUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    ReviewId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReviewType = table.Column<int>(type: "int", nullable: false),
                    ReviewerId = table.Column<int>(type: "int", nullable: false),
                    SellerId = table.Column<int>(type: "int", nullable: false),
                    ChatRoomId = table.Column<int>(type: "int", nullable: false),
                    PostId = table.Column<int>(type: "int", nullable: true),
                    OrderId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.ReviewId);
                    table.ForeignKey(
                        name: "FK_Reviews_ChatRooms_ChatRoomId",
                        column: x => x.ChatRoomId,
                        principalTable: "ChatRooms",
                        principalColumn: "ChatRoomId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reviews_EscrowTransations_OrderId",
                        column: x => x.OrderId,
                        principalTable: "EscrowTransations",
                        principalColumn: "EscrowTransId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Reviews_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "PostId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Reviews_Users_ReviewerId",
                        column: x => x.ReviewerId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reviews_Users_SellerId",
                        column: x => x.SellerId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DisputeEvidences",
                columns: table => new
                {
                    DisEvidenceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DisputeId = table.Column<int>(type: "int", nullable: false),
                    SubmitByUserId = table.Column<int>(type: "int", nullable: false),
                    FileLink = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DisputeEvidences", x => x.DisEvidenceId);
                    table.ForeignKey(
                        name: "FK_DisputeEvidences_Disputes_DisputeId",
                        column: x => x.DisputeId,
                        principalTable: "Disputes",
                        principalColumn: "DisputeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DisputeEvidences_Users_SubmitByUserId",
                        column: x => x.SubmitByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MessageImages",
                columns: table => new
                {
                    MessageImgId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImageUrl = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ChatMessId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MessageImages", x => x.MessageImgId);
                    table.ForeignKey(
                        name: "FK_MessageImages_ChatMessages_ChatMessId",
                        column: x => x.ChatMessId,
                        principalTable: "ChatMessages",
                        principalColumn: "ChatMessId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReportReviews",
                columns: table => new
                {
                    ReportReviewId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReviewId = table.Column<int>(type: "int", nullable: false),
                    ReporterId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportReviews", x => x.ReportReviewId);
                    table.ForeignKey(
                        name: "FK_ReportReviews_Reviews_ReviewId",
                        column: x => x.ReviewId,
                        principalTable: "Reviews",
                        principalColumn: "ReviewId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReportReviews_Users_ReporterId",
                        column: x => x.ReporterId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReviewImages",
                columns: table => new
                {
                    ReviewImageId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileUrl = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReviewId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewImages", x => x.ReviewImageId);
                    table.ForeignKey(
                        name: "FK_ReviewImages_Reviews_ReviewId",
                        column: x => x.ReviewId,
                        principalTable: "Reviews",
                        principalColumn: "ReviewId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReviewTags",
                columns: table => new
                {
                    ReviewTagId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReviewId = table.Column<int>(type: "int", nullable: false),
                    Tag = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewTags", x => x.ReviewTagId);
                    table.ForeignKey(
                        name: "FK_ReviewTags_Reviews_ReviewId",
                        column: x => x.ReviewId,
                        principalTable: "Reviews",
                        principalColumn: "ReviewId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Brands",
                columns: new[] { "BrandId", "BrandLogo", "BrandName", "Description", "ParentBrandId" },
                values: new object[,]
                {
                    { 1, "apple-logo.jpg", "Apple", "", null },
                    { 2, "samsung-logo.jpg", "Samsung", "", null }
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "CateId", "CateName", "Description", "ParentCateId" },
                values: new object[,]
                {
                    { 1, "Điện thoại", "", null },
                    { 2, "Laptop", "", null },
                    { 3, "Tai nghe", "", null }
                });

            migrationBuilder.InsertData(
                table: "DisputeStatuses",
                columns: new[] { "DisStatusId", "Description", "DisStatusName" },
                values: new object[,]
                {
                    { 1, "Chờ người bán phản hồi", "Pending" },
                    { 2, "Người bán từ chối", "SellerRejected" },
                    { 3, "Đang xem xét", "UnderReview" },
                    { 4, "Đã hoàn tiền cho người mua", "ResolvedRefund" },
                    { 5, "Đã bị từ chối hoàn tiền", "ResolvedReject" }
                });

            migrationBuilder.InsertData(
                table: "EscrowTransStatuses",
                columns: new[] { "EscTransStatusId", "Description", "StatusName" },
                values: new object[,]
                {
                    { 1, "Chờ xác nhận", "Confirming" },
                    { 2, "Chờ thanh toán", "PendingPayment" },
                    { 3, "Đã thanh toán", "Paid" },
                    { 4, "Đã huỷ", "Cancelled" },
                    { 5, "Quá hạn", "Expired" },
                    { 6, "Giao dịch hoàn tất", "Completed" },
                    { 7, "Tranh chấp", "Disputing" },
                    { 8, "Yêu cầu hoàn tiền", "RefundRequested" },
                    { 9, "Từ chối hoàn tiền", "RefundRejected" },
                    { 10, "Đã hoàn tiền", "Refunded" }
                });

            migrationBuilder.InsertData(
                table: "PostRepStatuses",
                columns: new[] { "PostRepStatusId", "Description", "PostRepStatusName" },
                values: new object[,]
                {
                    { 1, "Trạng thái là đang xử lý", "Pending" },
                    { 2, "Trạng thái là đã xử lý", "Processed" },
                    { 3, "Trạng thái là bị từ chối", "Refused" }
                });

            migrationBuilder.InsertData(
                table: "PostStatuses",
                columns: new[] { "PostStatusId", "Description", "PostStatusName" },
                values: new object[,]
                {
                    { 1, "Tin đăng đang chờ phê duyệt!", "Pending" },
                    { 2, "Tin đăng đã được phê duyệt!", "Approved" },
                    { 3, "Tin đăng đã bị từ chối!", "Reject" },
                    { 4, "Tin đang được rao bán", "Selling" },
                    { 5, "Tin đã bán xong", "Sold" },
                    { 6, "Tin đã ẩn", "Hidden" }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "RoleName" },
                values: new object[,]
                {
                    { 1, "Admin" },
                    { 2, "Censor" },
                    { 3, "User" }
                });

            migrationBuilder.InsertData(
                table: "SubscriptionPlans",
                columns: new[] { "SubPlanId", "DurationDays", "IsActive", "MaxFreePlatformFeePerSub", "MaxFreePost", "MaxPostPerSub", "SubPlanName", "SubPlanPrice", "SubPlanPromo", "SubPlanTitle" },
                values: new object[,]
                {
                    { 1, 30, true, 0m, 2m, 5, "ChoRe Free", 0m, "Tiết kiệm 16% so với giá mua lẻ (*)", "Gói mặc định cho người mới đăng ký" },
                    { 2, 30, true, 4m, 5m, 10, "ChoRe Vip", 150000m, "Tiết kiệm 16% so với giá mua lẻ (*)", "Gói VIP cho người dành cho người bán chuyên nghiệp" },
                    { 3, 30, true, 12m, 10m, 30, "ChoRe Premium", 350000m, "Tiết kiệm 16% so với giá mua lẻ (*)", "Gói Premium cho người bán có quy mô lớn" },
                    { 4, 40, true, 30m, 18m, 100, "ChoRe Bussiness", 1000000m, "Tiết kiệm 16% so với giá mua lẻ (*)", "Gói Bussiness cho người bán là doanh nghiệp" }
                });

            migrationBuilder.InsertData(
                table: "Brands",
                columns: new[] { "BrandId", "BrandLogo", "BrandName", "Description", "ParentBrandId" },
                values: new object[,]
                {
                    { 3, "apple-logo.jpg", "Iphone", "", 1 },
                    { 4, "apple-logo.jpg", "Macbook", "", 1 },
                    { 5, "apple-logo.jpg", "AirPod", "", 1 },
                    { 6, "samsung-logo.jpg", "Galaxy", "", 2 }
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "CateId", "CateName", "Description", "ParentCateId" },
                values: new object[,]
                {
                    { 4, "Điện thoại thường", "", 1 },
                    { 5, "Điện thoại gập", "", 1 },
                    { 6, "Laptop mỏng nhẹ", "", 2 },
                    { 7, "Laptop gaming", "", 2 },
                    { 8, "Tai nghe không dây", "", 3 },
                    { 9, "Tai nghe có dây", "", 3 }
                });

            migrationBuilder.InsertData(
                table: "Specifications",
                columns: new[] { "SpecId", "CateId", "Description", "SpecName" },
                values: new object[,]
                {
                    { 1, 1, "Bộ vi xử lý", "CPU" },
                    { 2, 1, "Bộ nhớ tạm thời", "RAM" },
                    { 3, 1, "Ổ cứng lưu dữ liệu của máy", "Dung lượng" },
                    { 4, 2, "Bộ vi xử lý", "CPU" },
                    { 5, 2, "Chip xử lý đồ họa", "GPU" },
                    { 6, 2, "Bộ nhớ tạm thời", "RAM" },
                    { 7, 2, "Ổ cứng lưu dữ liệu của máy", "Dung lượng" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Address", "Avatar", "CreateAt", "Email", "FullName", "IsLocked", "LockReason", "PasswordHash", "PhoneNumber", "RoleId", "UserName" },
                values: new object[,]
                {
                    { 1, "Thành phố Hồ Chí Minh", "avt-adminKhoi.jpg", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@gmail.com", "Nguyễn Admin", false, "", "AQAAAAIAAYagAAAAEB2mXId9Va/60Jh7iS8QwZK1iRarnCpm6fx6NfKXcoel4pB4hVPl5PnQOTconzLlxA==", "0123123123", 1, "adminKhoi" },
                    { 2, "Đồng Nai", "avt-censorKhoi.jpg", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "user@gmail.com", "Nguyễn Censor", false, "", "AQAAAAIAAYagAAAAEB2mXId9Va/60Jh7iS8QwZK1iRarnCpm6fx6NfKXcoel4pB4hVPl5PnQOTconzLlxA==", "0123123123", 2, "CensorKhoi" },
                    { 3, "Biên Hòa", "avt-userKhoi.jpg", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "user1@gmail.com", "Nguyễn User", false, "", "AQAAAAIAAYagAAAAEB2mXId9Va/60Jh7iS8QwZK1iRarnCpm6fx6NfKXcoel4pB4hVPl5PnQOTconzLlxA==", "0123123123", 3, "userKhoi" }
                });

            migrationBuilder.InsertData(
                table: "BrandCates",
                columns: new[] { "BrandId", "CateId" },
                values: new object[,]
                {
                    { 3, 1 },
                    { 3, 4 },
                    { 3, 5 },
                    { 4, 2 },
                    { 4, 6 },
                    { 4, 7 },
                    { 5, 3 },
                    { 5, 8 },
                    { 5, 9 },
                    { 6, 1 },
                    { 6, 4 },
                    { 6, 5 }
                });

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "PostId", "Address", "ApprovedAt", "ApprovedBy", "BrandId", "CategoryCateId", "CreatedAt", "Description", "MaxPrice", "MinPrice", "PostStatusId", "Price", "PriceType", "RejectReason", "RejectedAt", "RejectedBy", "SavedCount", "Status", "Title", "UserId", "ViewCount" },
                values: new object[,]
                {
                    { 1, "Hà Nội", new DateTime(2025, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 1, null, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Máy zin, pin 85%", null, null, 2, 2000000m, "FIXED", "", null, null, 5, "Đã Active", "Bán lại IPhone 13 cũ", 3, 20 },
                    { 2, "Hà Nội", new DateTime(2025, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 1, null, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "16GB/512GB PCIE/VGA 4GB RTX3050", 17990000m, 17000000m, 2, null, "RANGE", "", null, null, 5, "Đã Active", "Bán lại Laptop ASUS TUF Gaming A15 FA506NCG-HN184W", 3, 20 },
                    { 3, "Hà Nội", new DateTime(2025, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 1, null, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chính hãng Apple Việt Nam", null, null, 2, null, "NEGOTIABLE", "", null, null, 5, "Đã Active", "Bán lại Apple MacBook Air M2 2024", 3, 20 },
                    { 4, "Hà Nội", new DateTime(2025, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 1, null, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "12GB 256GB", null, null, 2, 21990000m, "FIXED", "", null, null, 5, "Đã Active", "Bán lại Samsung Galaxy Z Flip7", 3, 20 },
                    { 5, "Hà Nội", new DateTime(2025, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 1, null, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chính hãng Apple Việt Nam", null, null, 2, 21990000m, "FIXED", "", null, null, 5, "Đã Active", "Bán lại tai nghe Bluetooth Apple AirPods Pro 2 2023", 3, 20 }
                });

            migrationBuilder.InsertData(
                table: "Ratings",
                columns: new[] { "RatingId", "Comment", "CreatedAt", "FromUserId", "RatingImage", "Star", "ToUserId" },
                values: new object[] { 1, "Uy tín", new DateTime(2025, 1, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "dang-gia-test.jpg", 5, 3 });

            migrationBuilder.InsertData(
                table: "UserSubUsages",
                columns: new[] { "UsuId", "RemainingFreePost", "RemainingSubFPF", "RemainingSubPost", "UserId" },
                values: new object[,]
                {
                    { 1, 18, 30m, 100, 3 },
                    { 2, 18, 30m, 100, 1 }
                });

            migrationBuilder.InsertData(
                table: "UserSubscriptions",
                columns: new[] { "UserSubId", "EndDate", "IsActive", "StartDate", "SubPlanId", "UserId" },
                values: new object[,]
                {
                    { 1, new DateTime(2027, 1, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, 3 },
                    { 2, new DateTime(2027, 1, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, 1 }
                });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "CmtId", "Content", "CreateAt", "PostId", "UserId" },
                values: new object[] { 1, "Tôi muốn mua", new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, 1 });

            migrationBuilder.InsertData(
                table: "EscrowTransations",
                columns: new[] { "EscrowTransId", "BuyerConfirmed", "BuyerUserId", "CreateAt", "EscrowTransStatusId", "ExpiredAt", "IsRated", "PlatformFee", "PostId", "PostPrice", "SellerConfirmed", "SellerUserId", "TotalAmount", "TransactionOrderCode" },
                values: new object[] { 1, true, 2, new DateTime(2025, 1, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, new DateTime(2025, 1, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), false, 3m, 1, 10000000m, true, 3, 10300000m, null });

            migrationBuilder.InsertData(
                table: "PostCates",
                columns: new[] { "CateId", "PostId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 3, 1 }
                });

            migrationBuilder.InsertData(
                table: "PostImages",
                columns: new[] { "PostImgId", "PostId", "PostImage1" },
                values: new object[,]
                {
                    { 1, 1, "iphone_13_pdp_position-1b_color_midnight__vn.webp" },
                    { 2, 1, "iphone_13_pdp_position-2_size_comparison__vn.webp" },
                    { 3, 1, "iphone_13_pdp_position-3_camera__vn.webp" },
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

            migrationBuilder.InsertData(
                table: "PostReports",
                columns: new[] { "ReportId", "CreatedAt", "PostRepStatusId", "Reason", "ReportImage", "ReportedFromUserId", "ReportedPostId" },
                values: new object[] { 1, new DateTime(2025, 1, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "Thích nên report", "Report(1).jpg", 2, 1 });

            migrationBuilder.InsertData(
                table: "PostSpecifications",
                columns: new[] { "PostSpecId", "PostId", "SpecId", "SpecValue" },
                values: new object[,]
                {
                    { 1, 1, 1, "Apple A15" },
                    { 2, 1, 2, "4 GB" },
                    { 3, 1, 3, "128 GB" }
                });

            migrationBuilder.InsertData(
                table: "SavedPosts",
                columns: new[] { "SavedPostId", "CreateAt", "PostId", "UserId" },
                values: new object[] { 1, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, 1 });

            migrationBuilder.InsertData(
                table: "Disputes",
                columns: new[] { "DisputeId", "AssignedByAdminUserId", "CreateAt", "Decision", "DecisionNote", "DisputeReason", "EscrowTransId", "OpenedByUserId", "StatusId" },
                values: new object[] { 1, null, new DateTime(2025, 1, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "", "Hàng không đúng mô tả", 1, 2, 1 });

            migrationBuilder.InsertData(
                table: "DisputeEvidences",
                columns: new[] { "DisEvidenceId", "CreateAt", "Description", "DisputeId", "FileLink", "SubmitByUserId" },
                values: new object[] { 1, new DateTime(2025, 1, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 1, "google.com", 2 });

            migrationBuilder.CreateIndex(
                name: "IX_BrandCates_CateId",
                table: "BrandCates",
                column: "CateId");

            migrationBuilder.CreateIndex(
                name: "IX_Brands_ParentBrandId",
                table: "Brands",
                column: "ParentBrandId");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_ParentCateId",
                table: "Categories",
                column: "ParentCateId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_ChatRoomId",
                table: "ChatMessages",
                column: "ChatRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_CreatedAt",
                table: "ChatMessages",
                column: "CreateAt");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_FromUserId",
                table: "ChatMessages",
                column: "FromUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_TransationId",
                table: "ChatMessages",
                column: "TransationId",
                unique: true,
                filter: "[TransationId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ChatRooms_BuyerId",
                table: "ChatRooms",
                column: "BuyerId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatRooms_CurrentEscrowTransId",
                table: "ChatRooms",
                column: "CurrentEscrowTransId",
                unique: true,
                filter: "[CurrentEscrowTransId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ChatRooms_PostId",
                table: "ChatRooms",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatRooms_SellerId",
                table: "ChatRooms",
                column: "SellerId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatRooms_Users",
                table: "ChatRooms",
                columns: new[] { "BuyerId", "SellerId", "PostId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Comments_PostId",
                table: "Comments",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_UserId",
                table: "Comments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DisputeEvidences_DisputeId",
                table: "DisputeEvidences",
                column: "DisputeId");

            migrationBuilder.CreateIndex(
                name: "IX_DisputeEvidences_SubmitByUserId",
                table: "DisputeEvidences",
                column: "SubmitByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Disputes_AssignedByAdminUserId",
                table: "Disputes",
                column: "AssignedByAdminUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Disputes_EscrowTransId",
                table: "Disputes",
                column: "EscrowTransId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Disputes_OpenedByUserId",
                table: "Disputes",
                column: "OpenedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Disputes_StatusId",
                table: "Disputes",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_EscrowTransations_BuyerUserId",
                table: "EscrowTransations",
                column: "BuyerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_EscrowTransations_EscrowTransStatusId",
                table: "EscrowTransations",
                column: "EscrowTransStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_EscrowTransations_PostId",
                table: "EscrowTransations",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_EscrowTransations_SellerUserId",
                table: "EscrowTransations",
                column: "SellerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MessageImages_ChatMessId",
                table: "MessageImages",
                column: "ChatMessId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PostCates_CateId",
                table: "PostCates",
                column: "CateId");

            migrationBuilder.CreateIndex(
                name: "IX_PostImages_PostId",
                table: "PostImages",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_PostReports_PostRepStatusId",
                table: "PostReports",
                column: "PostRepStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_PostReports_ReportedFromUserId",
                table: "PostReports",
                column: "ReportedFromUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PostReports_ReportedPostId",
                table: "PostReports",
                column: "ReportedPostId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_ApprovedBy",
                table: "Posts",
                column: "ApprovedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_BrandId",
                table: "Posts",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_CategoryCateId",
                table: "Posts",
                column: "CategoryCateId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_CreatedAt",
                table: "Posts",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_PostStatusId",
                table: "Posts",
                column: "PostStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_Price",
                table: "Posts",
                column: "Price");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_RejectedBy",
                table: "Posts",
                column: "RejectedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_Status_Created",
                table: "Posts",
                columns: new[] { "PostStatusId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Posts_UserId",
                table: "Posts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PostSpecifications_PostId",
                table: "PostSpecifications",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_PostSpecifications_SpecId",
                table: "PostSpecifications",
                column: "SpecId");

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_FromUserId",
                table: "Ratings",
                column: "FromUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_ToUserId",
                table: "Ratings",
                column: "ToUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportReviews_ReporterId",
                table: "ReportReviews",
                column: "ReporterId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportReviews_ReviewId_ReporterId",
                table: "ReportReviews",
                columns: new[] { "ReviewId", "ReporterId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ReviewImages_ReviewId",
                table: "ReviewImages",
                column: "ReviewId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ChatRoomId",
                table: "Reviews",
                column: "ChatRoomId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_OrderId",
                table: "Reviews",
                column: "OrderId",
                unique: true,
                filter: "[OrderId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_PostId",
                table: "Reviews",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ReviewerId",
                table: "Reviews",
                column: "ReviewerId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_SellerId",
                table: "Reviews",
                column: "SellerId");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewTags_ReviewId",
                table: "ReviewTags",
                column: "ReviewId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedPosts_PostId",
                table: "SavedPosts",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedPosts_UserId",
                table: "SavedPosts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_CateId",
                table: "Specifications",
                column: "CateId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionOrders_OrdStatusId",
                table: "SubscriptionOrders",
                column: "OrdStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionOrders_SubPlanId",
                table: "SubscriptionOrders",
                column: "SubPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionOrders_UserId",
                table: "SubscriptionOrders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserName",
                table: "Users",
                column: "UserName");

            migrationBuilder.CreateIndex(
                name: "IX_UserSubscriptions_IsActive",
                table: "UserSubscriptions",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_UserSubscriptions_SubPlanId",
                table: "UserSubscriptions",
                column: "SubPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSubscriptions_UserId",
                table: "UserSubscriptions",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserSubUsages_UserId",
                table: "UserSubUsages",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BrandCates");

            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "DisputeEvidences");

            migrationBuilder.DropTable(
                name: "EmailOtps");

            migrationBuilder.DropTable(
                name: "MessageImages");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "PostCates");

            migrationBuilder.DropTable(
                name: "PostImages");

            migrationBuilder.DropTable(
                name: "PostReports");

            migrationBuilder.DropTable(
                name: "PostSpecifications");

            migrationBuilder.DropTable(
                name: "Ratings");

            migrationBuilder.DropTable(
                name: "ReportReviews");

            migrationBuilder.DropTable(
                name: "ReviewImages");

            migrationBuilder.DropTable(
                name: "ReviewTags");

            migrationBuilder.DropTable(
                name: "SavedPosts");

            migrationBuilder.DropTable(
                name: "SubscriptionOrders");

            migrationBuilder.DropTable(
                name: "UserSubscriptions");

            migrationBuilder.DropTable(
                name: "UserSubUsages");

            migrationBuilder.DropTable(
                name: "Disputes");

            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "PostRepStatuses");

            migrationBuilder.DropTable(
                name: "Specifications");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "SubscriptionPlans");

            migrationBuilder.DropTable(
                name: "DisputeStatuses");

            migrationBuilder.DropTable(
                name: "ChatRooms");

            migrationBuilder.DropTable(
                name: "EscrowTransations");

            migrationBuilder.DropTable(
                name: "EscrowTransStatuses");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "Brands");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "PostStatuses");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
