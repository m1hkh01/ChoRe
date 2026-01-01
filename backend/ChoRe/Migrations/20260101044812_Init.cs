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
                    BrandLogo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brands", x => x.BrandId);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CateId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CateName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CateId);
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
                name: "EscrowStatuses",
                columns: table => new
                {
                    EscStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EscStatusName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EscrowStatuses", x => x.EscStatusId);
                });

            migrationBuilder.CreateTable(
                name: "OrderStatuses",
                columns: table => new
                {
                    OrdStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrdStatusName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderStatuses", x => x.OrdStatusId);
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
                    SubPlanName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SubPlanPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    DurationDays = table.Column<int>(type: "int", nullable: false),
                    MaxPostPerSub = table.Column<int>(type: "int", nullable: false),
                    MaxFreePlatformFeePerSub = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
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
                    PhoneNumber = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    CitizenIdNumber = table.Column<string>(type: "nvarchar(12)", maxLength: 12, nullable: true),
                    CitizenIdFrontImage = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CitizenIdBackImage = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
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
                name: "ChatRooms",
                columns: table => new
                {
                    ChatRoomId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User1Id = table.Column<int>(type: "int", nullable: false),
                    User2Id = table.Column<int>(type: "int", nullable: false),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatRooms", x => x.ChatRoomId);
                    table.ForeignKey(
                        name: "FK_ChatRooms_Users_User1Id",
                        column: x => x.User1Id,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ChatRooms_Users_User2Id",
                        column: x => x.User2Id,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
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
                    Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    PostStatusId = table.Column<int>(type: "int", nullable: false),
                    ApprovedBy = table.Column<int>(type: "int", nullable: true),
                    ApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
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
                    RemainingSubPost = table.Column<int>(type: "int", nullable: false)
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
                name: "ChatMessages",
                columns: table => new
                {
                    ChatMessId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChatRoomId = table.Column<int>(type: "int", nullable: false),
                    FromUserId = table.Column<int>(type: "int", nullable: false),
                    ChatContent = table.Column<string>(type: "nvarchar(max)", maxLength: 5000, nullable: false),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
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
                        name: "FK_ChatMessages_Users_FromUserId",
                        column: x => x.FromUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
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
                name: "Orders",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BuyerUserId = table.Column<int>(type: "int", nullable: false),
                    SellerUserId = table.Column<int>(type: "int", nullable: false),
                    PostId = table.Column<int>(type: "int", nullable: false),
                    OrdStatusId = table.Column<int>(type: "int", nullable: false),
                    IsShippedBySeller = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsReceivedByBuyer = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK_Orders_OrderStatuses_OrdStatusId",
                        column: x => x.OrdStatusId,
                        principalTable: "OrderStatuses",
                        principalColumn: "OrdStatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Orders_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "PostId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Orders_Users_BuyerUserId",
                        column: x => x.BuyerUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Orders_Users_SellerUserId",
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
                name: "MessageImages",
                columns: table => new
                {
                    MessageImgId = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ChatMessId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MessageImages", x => x.MessageImgId);
                    table.ForeignKey(
                        name: "FK_MessageImages_ChatMessages_MessageImgId",
                        column: x => x.MessageImgId,
                        principalTable: "ChatMessages",
                        principalColumn: "ChatMessId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Disputes",
                columns: table => new
                {
                    DisputeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
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
                        name: "FK_Disputes_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId",
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
                name: "Escrows",
                columns: table => new
                {
                    EscrowId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PostPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PlatformFee = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    EscStatusId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Escrows", x => x.EscrowId);
                    table.ForeignKey(
                        name: "FK_Escrows_EscrowStatuses_EscStatusId",
                        column: x => x.EscStatusId,
                        principalTable: "EscrowStatuses",
                        principalColumn: "EscStatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Escrows_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
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

            migrationBuilder.InsertData(
                table: "Brands",
                columns: new[] { "BrandId", "BrandLogo", "BrandName", "Description" },
                values: new object[,]
                {
                    { 1, "apple-logo.jpg", "Apple", "" },
                    { 2, "samsung-logo.jpg", "Samsung", "" }
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "CateId", "CateName", "Description" },
                values: new object[,]
                {
                    { 1, "Điện thoại", "" },
                    { 2, "Laptop", "" },
                    { 3, "IPhone", "" }
                });

            migrationBuilder.InsertData(
                table: "DisputeStatuses",
                columns: new[] { "DisStatusId", "Description", "DisStatusName" },
                values: new object[,]
                {
                    { 1, "Đang mở", "Open" },
                    { 2, "Đã giải quyết", "Resolved" }
                });

            migrationBuilder.InsertData(
                table: "EscrowStatuses",
                columns: new[] { "EscStatusId", "Description", "EscStatusName" },
                values: new object[,]
                {
                    { 1, "", "Holding" },
                    { 2, "", "Released" }
                });

            migrationBuilder.InsertData(
                table: "OrderStatuses",
                columns: new[] { "OrdStatusId", "Description", "OrdStatusName" },
                values: new object[,]
                {
                    { 1, "", "Pending" },
                    { 2, "", "Completed" }
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
                    { 3, "Tin đăng đã bị từ chối!", "Reject" }
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
                columns: new[] { "SubPlanId", "DurationDays", "MaxFreePlatformFeePerSub", "MaxPostPerSub", "SubPlanName", "SubPlanPrice" },
                values: new object[,]
                {
                    { 1, 30, 0m, 5, "ChoRe Free", 0m },
                    { 2, 30, 4m, 10, "ChoRe Vip", 150000m },
                    { 3, 30, 12m, 30, "ChoRe Premium", 350000m },
                    { 4, 40, 30m, 100, "ChoRe Bussiness", 1000000m }
                });

            migrationBuilder.InsertData(
                table: "BrandCates",
                columns: new[] { "BrandId", "CateId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 1, 2 },
                    { 1, 3 },
                    { 2, 1 },
                    { 2, 2 }
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
                columns: new[] { "UserId", "Address", "Avatar", "CitizenIdBackImage", "CitizenIdFrontImage", "CitizenIdNumber", "CreateAt", "Email", "FullName", "IsLocked", "LockReason", "PasswordHash", "PhoneNumber", "RoleId", "UserName" },
                values: new object[,]
                {
                    { 1, "Thành phố Hồ Chí Minh", "avt-adminKhoi.jpg", "cccd-back.jpg", "cccd-front.jpg", "123123123123", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@gmail.com", "Nguyễn Admin", false, "", "AQAAAAIAAYagAAAAEB2mXId9Va/60Jh7iS8QwZK1iRarnCpm6fx6NfKXcoel4pB4hVPl5PnQOTconzLlxA==", "0123123123", 1, "adminKhoi" },
                    { 2, "Đồng Nai", "avt-censorKhoi.jpg", "cccd-back.jpg", "cccd-front.jpg", "123123123123", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "user@gmail.com", "Nguyễn Censor", false, "", "AQAAAAIAAYagAAAAEB2mXId9Va/60Jh7iS8QwZK1iRarnCpm6fx6NfKXcoel4pB4hVPl5PnQOTconzLlxA==", "0123123123", 2, "CensorKhoi" },
                    { 3, "Biên Hòa", "avt-userKhoi.jpg", "cccd-back.jpg", "cccd-front.jpg", "123123123123", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "user1@gmail.com", "Nguyễn User", false, "", "AQAAAAIAAYagAAAAEB2mXId9Va/60Jh7iS8QwZK1iRarnCpm6fx6NfKXcoel4pB4hVPl5PnQOTconzLlxA==", "0123123123", 3, "userKhoi" }
                });

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "PostId", "Address", "ApprovedAt", "ApprovedBy", "BrandId", "CategoryCateId", "CreatedAt", "Description", "PostStatusId", "Price", "RejectReason", "SavedCount", "Status", "Title", "UserId", "ViewCount" },
                values: new object[] { 1, "Hà Nội", new DateTime(2025, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 1, null, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Máy zin, pin 85%", 2, 10000000m, "", 5, "Đã Active", "IPhone 13 cũ", 3, 20 });

            migrationBuilder.InsertData(
                table: "Ratings",
                columns: new[] { "RatingId", "Comment", "CreatedAt", "FromUserId", "RatingImage", "Star", "ToUserId" },
                values: new object[] { 1, "Uy tín", new DateTime(2025, 1, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "dang-gia-test.jpg", 5, 3 });

            migrationBuilder.InsertData(
                table: "UserSubUsages",
                columns: new[] { "UsuId", "RemainingSubFPF", "RemainingSubPost", "UserId" },
                values: new object[] { 1, 0m, 4, 3 });

            migrationBuilder.InsertData(
                table: "UserSubscriptions",
                columns: new[] { "UserSubId", "EndDate", "IsActive", "StartDate", "SubPlanId", "UserId" },
                values: new object[] { 1, new DateTime(2025, 1, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, 3 });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "CmtId", "Content", "CreateAt", "PostId", "UserId" },
                values: new object[] { 1, "Tôi muốn mua", new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, 1 });

            migrationBuilder.InsertData(
                table: "Orders",
                columns: new[] { "OrderId", "BuyerUserId", "CreateAt", "IsReceivedByBuyer", "IsShippedBySeller", "OrdStatusId", "PostId", "SellerUserId" },
                values: new object[] { 1, 2, new DateTime(2025, 1, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), true, true, 2, 1, 3 });

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
                    { 1, 1, "iphone13(1).jpg" },
                    { 2, 1, "iphone13(2).jpg" },
                    { 3, 1, "iphone13(3).jpg" }
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
                columns: new[] { "DisputeId", "AssignedByAdminUserId", "CreateAt", "Decision", "DecisionNote", "DisputeReason", "OpenedByUserId", "OrderId", "StatusId" },
                values: new object[] { 1, null, new DateTime(2025, 1, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "", "Hàng không đúng mô tả", 2, 1, 1 });

            migrationBuilder.InsertData(
                table: "Escrows",
                columns: new[] { "EscrowId", "EscStatusId", "OrderId", "PlatformFee", "PostPrice", "TotalAmount" },
                values: new object[] { 1, 1, 1, 3m, 10000000m, 10300000m });

            migrationBuilder.InsertData(
                table: "DisputeEvidences",
                columns: new[] { "DisEvidenceId", "CreateAt", "Description", "DisputeId", "FileLink", "SubmitByUserId" },
                values: new object[] { 1, new DateTime(2025, 1, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 1, "google.com", 2 });

            migrationBuilder.CreateIndex(
                name: "IX_BrandCates_CateId",
                table: "BrandCates",
                column: "CateId");

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
                name: "IX_ChatRooms_User1Id",
                table: "ChatRooms",
                column: "User1Id");

            migrationBuilder.CreateIndex(
                name: "IX_ChatRooms_User2Id",
                table: "ChatRooms",
                column: "User2Id");

            migrationBuilder.CreateIndex(
                name: "IX_ChatRooms_Users",
                table: "ChatRooms",
                columns: new[] { "User1Id", "User2Id" },
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
                name: "IX_Disputes_OpenedByUserId",
                table: "Disputes",
                column: "OpenedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Disputes_OrderId",
                table: "Disputes",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Disputes_StatusId",
                table: "Disputes",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Escrows_EscStatusId",
                table: "Escrows",
                column: "EscStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Escrows_OrderId",
                table: "Escrows",
                column: "OrderId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_BuyerUserId",
                table: "Orders",
                column: "BuyerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrdStatusId",
                table: "Orders",
                column: "OrdStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_PostId",
                table: "Orders",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_SellerUserId",
                table: "Orders",
                column: "SellerUserId");

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
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSubUsages_UserId",
                table: "UserSubUsages",
                column: "UserId");
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
                name: "Escrows");

            migrationBuilder.DropTable(
                name: "MessageImages");

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
                name: "SavedPosts");

            migrationBuilder.DropTable(
                name: "UserSubscriptions");

            migrationBuilder.DropTable(
                name: "UserSubUsages");

            migrationBuilder.DropTable(
                name: "Disputes");

            migrationBuilder.DropTable(
                name: "EscrowStatuses");

            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "PostRepStatuses");

            migrationBuilder.DropTable(
                name: "Specifications");

            migrationBuilder.DropTable(
                name: "SubscriptionPlans");

            migrationBuilder.DropTable(
                name: "DisputeStatuses");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "ChatRooms");

            migrationBuilder.DropTable(
                name: "OrderStatuses");

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
