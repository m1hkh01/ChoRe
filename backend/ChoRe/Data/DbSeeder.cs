using ChoRe.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;

namespace ChoReDB.Data
{
    public static class DbSeeder
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
            var hasher = new PasswordHasher<User>();
            // ================= ROLE =================
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "Admin" },
                new Role { RoleId = 2, RoleName = "Censor" },
                new Role { RoleId = 3, RoleName = "User" }
            );

            // ================= USER =================
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserId = 1,
                    UserName = "adminKhoi",
                    FullName = "Nguyễn Admin",
                    PhoneNumber = "0123123123",
                    Email = "admin@gmail.com",
                    Address = "Thành phố Hồ Chí Minh",
                    Avatar = "avt-adminKhoi.jpg",
                    //CitizenIdNumber = "123123123123",
                    //CitizenIdFrontImage = "cccd-front.jpg",
                    //CitizenIdBackImage = "cccd-back.jpg",
                    PasswordHash = "AQAAAAIAAYagAAAAEB2mXId9Va/60Jh7iS8QwZK1iRarnCpm6fx6NfKXcoel4pB4hVPl5PnQOTconzLlxA==",
                    RoleId = 1,
                    IsLocked = false,
                    LockReason = "",
                    CreateAt = new DateTime(2025, 1, 1)
                },
                new User
                {
                    UserId = 2,
                    UserName = "CensorKhoi",
                    FullName = "Nguyễn Censor",
                    PhoneNumber = "0123123123",
                    Email = "user@gmail.com",
                    Address = "Đồng Nai",
                    Avatar = "avt-censorKhoi.jpg",
                    //CitizenIdNumber = "123123123123",
                    //CitizenIdFrontImage = "cccd-front.jpg",
                    //CitizenIdBackImage = "cccd-back.jpg",
                    PasswordHash = "AQAAAAIAAYagAAAAEB2mXId9Va/60Jh7iS8QwZK1iRarnCpm6fx6NfKXcoel4pB4hVPl5PnQOTconzLlxA==",
                    RoleId = 2,
                    IsLocked = false,
                    LockReason = "",
                    CreateAt = new DateTime(2025, 1, 1)
                },
                new User
                {
                    UserId = 3,
                    UserName = "userKhoi",
                    FullName = "Nguyễn User",
                    PhoneNumber = "0123123123",
                    Email = "user1@gmail.com",
                    Address = "Biên Hòa",
                    Avatar = "avt-userKhoi.jpg",
                    //CitizenIdNumber = "123123123123",
                    //CitizenIdFrontImage = "cccd-front.jpg",
                    //CitizenIdBackImage = "cccd-back.jpg",
                    PasswordHash = "AQAAAAIAAYagAAAAEB2mXId9Va/60Jh7iS8QwZK1iRarnCpm6fx6NfKXcoel4pB4hVPl5PnQOTconzLlxA==",
                    RoleId = 3,
                    IsLocked = false,
                    LockReason = "",
                    CreateAt = new DateTime(2025, 1, 1)
                }
            );

            // ================= CATEGORY =================
            modelBuilder.Entity<Category>().HasData(
                new Category { CateId = 1, CateName = "Điện thoại", Description = "", ParentCateId = null },
                new Category { CateId = 4, CateName = "Điện thoại thường", Description = "", ParentCateId = 1 },
                new Category { CateId = 5, CateName = "Điện thoại gập", Description = "", ParentCateId = 1 },
                new Category { CateId = 2, CateName = "Laptop", Description = "", ParentCateId = null },
                new Category { CateId = 6, CateName = "Laptop mỏng nhẹ", Description = "", ParentCateId = 2 },
                new Category { CateId = 7, CateName = "Laptop gaming", Description = "", ParentCateId = 2 },
                new Category { CateId = 3, CateName = "Tai nghe", Description = "", ParentCateId = null },
                new Category { CateId = 8, CateName = "Tai nghe không dây", Description = "", ParentCateId = 3 },
                new Category { CateId = 9, CateName = "Tai nghe có dây", Description = "", ParentCateId = 3 }
            );

            // ================= BRAND =================
            modelBuilder.Entity<Brand>().HasData(
                new Brand { BrandId = 1, BrandName = "Apple", Description = "", BrandLogo = "apple-logo.jpg", ParentBrandId = null },
                new Brand { BrandId = 3, BrandName = "Iphone", Description = "", BrandLogo = "apple-logo.jpg", ParentBrandId = 1 },
                new Brand { BrandId = 4, BrandName = "Macbook", Description = "", BrandLogo = "apple-logo.jpg", ParentBrandId = 1 },
                new Brand { BrandId = 5, BrandName = "AirPod", Description = "", BrandLogo = "apple-logo.jpg", ParentBrandId = 1 },
                new Brand { BrandId = 2, BrandName = "Samsung", Description = "", BrandLogo = "samsung-logo.jpg", ParentBrandId = null },
                new Brand { BrandId = 6, BrandName = "Galaxy", Description = "", BrandLogo = "samsung-logo.jpg", ParentBrandId = 2 }
            );

            modelBuilder.Entity<BrandCate>().HasData(
                // ===== APPLE =====
                new BrandCate { BrandId = 3, CateId = 1 }, // Iphone → Điện thoại
                new BrandCate { BrandId = 3, CateId = 4 }, // Iphone → Điện thoại thường
                new BrandCate { BrandId = 3, CateId = 5 }, // Iphone → Điện thoại gập

                new BrandCate { BrandId = 4, CateId = 2 }, // Macbook → Laptop
                new BrandCate { BrandId = 4, CateId = 6 }, // Macbook → Laptop mỏng nhẹ
                new BrandCate { BrandId = 4, CateId = 7 }, // Macbook → Laptop gaming

                new BrandCate { BrandId = 5, CateId = 3 }, // AirPod → Tai nghe
                new BrandCate { BrandId = 5, CateId = 8 }, // AirPod → Tai nghe không dây
                new BrandCate { BrandId = 5, CateId = 9 }, // AirPod → Tai nghe có dây

                // ===== SAMSUNG =====
                new BrandCate { BrandId = 6, CateId = 1 }, // Galaxy → Điện thoại
                new BrandCate { BrandId = 6, CateId = 4 }, // Galaxy → Điện thoại thường
                new BrandCate { BrandId = 6, CateId = 5 }  // Galaxy → Điện thoại gập
            );

            // ================= POST STATUS =================
            modelBuilder.Entity<PostStatus>().HasData(
                new PostStatus { PostStatusId = 1, PostStatusName = "Pending", Description = "Tin đăng đang chờ phê duyệt!" },
                new PostStatus { PostStatusId = 2, PostStatusName = "Approved", Description = "Tin đăng đã được phê duyệt!" },
                new PostStatus { PostStatusId = 3, PostStatusName = "Reject", Description = "Tin đăng đã bị từ chối!" }
            );

            // ================= POST =================
            modelBuilder.Entity<Post>().HasData(
                new Post
                {
                    PostId = 1,
                    UserId = 3,
                    Title = "IPhone 13 cũ",
                    Description = "Máy zin, pin 85%",
                    Status = "Đã Active",
                    Price = 10000000,
                    Address = "Hà Nội",
                    BrandId = 1,
                    PostStatusId = 2,
                    ApprovedBy = 2,
                    ApprovedAt = new DateTime(2025, 2, 2),
                    RejectReason = "",
                    ViewCount = 20,
                    SavedCount = 5,
                    CreatedAt = new DateTime(2025, 1, 2)
                }
            );
            modelBuilder.Entity<Specification>().HasData(
                new Specification
                {
                    SpecId = 1,
                    SpecName = "CPU",
                    Description = "Bộ vi xử lý",
                    CateId = 1
                },
                new Specification
                {
                    SpecId = 2,
                    SpecName = "RAM",
                    Description = "Bộ nhớ tạm thời",
                    CateId = 1
                },
                new Specification
                {
                    SpecId = 3,
                    SpecName = "Dung lượng",
                    Description = "Ổ cứng lưu dữ liệu của máy",
                    CateId = 1
                },
                new Specification
                {
                    SpecId = 4,
                    SpecName = "CPU",
                    Description = "Bộ vi xử lý",
                    CateId = 2
                },
                new Specification
                {
                    SpecId = 5,
                    SpecName = "GPU",
                    Description = "Chip xử lý đồ họa",
                    CateId = 2
                },
                new Specification
                {
                    SpecId = 6,
                    SpecName = "RAM",
                    Description = "Bộ nhớ tạm thời",
                    CateId = 2
                },
                new Specification
                {
                    SpecId = 7,
                    SpecName = "Dung lượng",
                    Description = "Ổ cứng lưu dữ liệu của máy",
                    CateId = 2
                }

            );
            modelBuilder.Entity<PostSpecification>().HasData(
                new PostSpecification
                {
                    PostSpecId = 1,
                    PostId = 1,
                    SpecId = 1,
                    SpecValue = "Apple A15"
                },
                new PostSpecification
                {
                    PostSpecId = 2,
                    PostId = 1,
                    SpecId = 2,
                    SpecValue = "4 GB"
                },
                new PostSpecification
                {
                    PostSpecId = 3,
                    PostId = 1,
                    SpecId = 3,
                    SpecValue = "128 GB"
                }
            );
            modelBuilder.Entity<PostCate>().HasData(
                new PostCate
                {
                    PostId = 1,
                    CateId = 1,
                },
                new PostCate
                {
                    PostId = 1,
                    CateId = 3,
                }
            );
            modelBuilder.Entity<PostImage>().HasData(
                new PostImage
                {
                    PostImgId = 1,
                    PostId = 1,
                    PostImage1 = "iphone13(1).jpg"
                },
                new PostImage
                {
                    PostImgId = 2,
                    PostId = 1,
                    PostImage1 = "iphone13(2).jpg"
                },
                new PostImage
                {
                    PostImgId = 3,
                    PostId = 1,
                    PostImage1 = "iphone13(3).jpg"
                }
            );

            // ================= COMMENT / SAVE / RATING =================
            modelBuilder.Entity<Comment>().HasData(
                new Comment
                {
                    CmtId = 1,
                    PostId = 1,
                    UserId = 1,
                    Content = "Tôi muốn mua",
                    CreateAt = new DateTime(2025, 1, 2)
                }
            );

            modelBuilder.Entity<SavedPost>().HasData(
                new SavedPost
                {
                    SavedPostId = 1,
                    UserId = 1,
                    PostId = 1,
                    CreateAt = new DateTime(2025, 1, 2)
                }
            );

            modelBuilder.Entity<Rating>().HasData(
                new Rating
                {
                    RatingId = 1,
                    FromUserId = 2,
                    ToUserId = 3,
                    Star = 5,
                    Comment = "Uy tín",
                    RatingImage = "dang-gia-test.jpg",
                    CreatedAt = new DateTime(2025, 1, 3)
                }
            );
            modelBuilder.Entity<PostReport>().HasData(
                new PostReport
                {
                    ReportId = 1,
                    ReportedFromUserId = 2,
                    ReportedPostId = 1,
                    Reason = "Thích nên report",
                    ReportImage = "Report(1).jpg",
                    PostRepStatusId = 1,
                    CreatedAt = new DateTime(2025, 1, 3)
                }
            );
            modelBuilder.Entity<PostRepStatus>().HasData(
                new PostRepStatus
                {
                    PostRepStatusId = 1,
                    PostRepStatusName = "Pending",
                    Description = "Trạng thái là đang xử lý",
                },
                new PostRepStatus
                {
                    PostRepStatusId = 2,
                    PostRepStatusName = "Processed",
                    Description = "Trạng thái là đã xử lý",
                },
                new PostRepStatus
                {
                    PostRepStatusId = 3,
                    PostRepStatusName = "Refused",
                    Description = "Trạng thái là bị từ chối",
                }
            );

            // ================= ESCROW TRANSACTION (was Order) =================
            modelBuilder.Entity<EscrowTransStatus>().HasData(
                new EscrowTransStatus { EscTransStatusId = 1, StatusName = "Confirming", Description = "Chờ 2 bên xác nhận" },
                new EscrowTransStatus { EscTransStatusId = 2, StatusName = "Pending", Description = "Chờ thanh toán" },
                new EscrowTransStatus { EscTransStatusId = 3, StatusName = "Paid", Description = "Đã thanh toán" },
                new EscrowTransStatus { EscTransStatusId = 4, StatusName = "Cancelled", Description = "Đã huỷ" },
                new EscrowTransStatus { EscTransStatusId = 5, StatusName = "Expired", Description = "Quá hạn" },
                new EscrowTransStatus { EscTransStatusId = 6, StatusName = "Completed", Description = "Giao dịch hoàn tất" },
                new EscrowTransStatus { EscTransStatusId = 7, StatusName = "Disputing", Description = "Tranh chấp" },
                new EscrowTransStatus { EscTransStatusId = 8, StatusName = "Refunded", Description = "Đã hoàn tiền cho người mua" }

            // new EscrowTransStatus { EscTransStatusId = 5, StatusName = "Failed", Description = "Thanh toán thất bại" }
            );

            modelBuilder.Entity<EscrowTransation>().HasData(
                new EscrowTransation
                {
                    EscrowTransId = 1,
                    BuyerUserId = 2,
                    SellerUserId = 3,
                    PostId = 1,
                    EscrowTransStatusId = 2,
                    BuyerConfirmed = true,
                    SellerConfirmed = true,
                    CreateAt = new DateTime(2025, 1, 3),
                    ExpiredAt = new DateTime(2025, 1, 4),
                    TotalAmount = 10300000,
                    PostPrice = 10000000,
                    PlatformFee = 3
                }
            );

            // ================= DISPUTE =================
            modelBuilder.Entity<DisputeStatus>().HasData(
                new DisputeStatus { DisStatusId = 1, DisStatusName = "Open", Description = "Đang mở" },
                new DisputeStatus { DisStatusId = 2, DisStatusName = "Resolved", Description = "Đã giải quyết" }
            );

            modelBuilder.Entity<Dispute>().HasData(
                new Dispute
                {
                    DisputeId = 1,
                    EscrowTransId = 1,
                    OpenedByUserId = 2,
                    DisputeReason = "Hàng không đúng mô tả",
                    StatusId = 1,
                    AssignedByAdmin = null,
                    Decision = "",
                    DecisionNote = "",
                    CreateAt = new DateTime(2025, 1, 4)
                }
            );

            modelBuilder.Entity<DisputeEvidence>().HasData(
                new DisputeEvidence
                {
                    DisEvidenceId = 1,
                    DisputeId = 1,
                    SubmitByUserId = 2,
                    FileLink = "google.com",
                    Description = "",
                    CreateAt = new DateTime(2025, 1, 4)
                }
            );

            // ================= SUBSCRIPTION =================
            modelBuilder.Entity<SubscriptionPlan>().HasData(
                new SubscriptionPlan
                {
                    SubPlanId = 1,
                    SubPlanName = "ChoRe Free",
                    SubPlanTitle = "Gói mặc định cho người mới đăng ký",
                    SubPlanPromo = "Tiết kiệm 16% so với giá mua lẻ (*)",
                    SubPlanPrice = 0,
                    DurationDays = 30,
                    MaxPostPerSub = 5,
                    MaxFreePlatformFeePerSub = 0,
                    MaxFreePost = 2
                },
                new SubscriptionPlan
                {
                    SubPlanId = 2,
                    SubPlanName = "ChoRe Vip",
                    SubPlanTitle = "Gói VIP cho người dành cho người bán chuyên nghiệp",
                    SubPlanPromo = "Tiết kiệm 16% so với giá mua lẻ (*)",
                    SubPlanPrice = 150000,
                    DurationDays = 30,
                    MaxPostPerSub = 10,
                    MaxFreePlatformFeePerSub = 4,
                    MaxFreePost = 5
                },
                new SubscriptionPlan
                {
                    SubPlanId = 3,
                    SubPlanName = "ChoRe Premium",
                    SubPlanTitle = "Gói Premium cho người bán có quy mô lớn",
                    SubPlanPromo = "Tiết kiệm 16% so với giá mua lẻ (*)",
                    SubPlanPrice = 350000,
                    DurationDays = 30,
                    MaxPostPerSub = 30,
                    MaxFreePlatformFeePerSub = 12,
                    MaxFreePost = 10
                },
                new SubscriptionPlan
                {
                    SubPlanId = 4,
                    SubPlanName = "ChoRe Bussiness",
                    SubPlanTitle = "Gói Bussiness cho người bán là doanh nghiệp",
                    SubPlanPromo = "Tiết kiệm 16% so với giá mua lẻ (*)",
                    SubPlanPrice = 1000000,
                    DurationDays = 40,
                    MaxPostPerSub = 100,
                    MaxFreePlatformFeePerSub = 30,
                    MaxFreePost = 18
                }
            );

            modelBuilder.Entity<UserSubscription>().HasData(
                new UserSubscription
                {
                    UserSubId = 1,
                    UserId = 3,
                    SubPlanId = 1,
                    StartDate = new DateTime(2025, 1, 1),
                    EndDate = new DateTime(2025, 1, 31),
                    IsActive = true
                }
            );

            modelBuilder.Entity<UserSubUsage>().HasData(
                new UserSubUsage
                {
                    UsuId = 1,
                    UserId = 3,
                    RemainingSubFPF = 0,
                    RemainingSubPost = 4,
                    RemainingFreePost = 2,
                }
            );
        }
    }
}
