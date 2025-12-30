using ChoRe.Models;
using ChoReDB.Data;
using Microsoft.EntityFrameworkCore;

namespace ChoRe.Data
{
    /// <summary>
    /// Database Context cho ứng dụng ChoRe Marketplace
    /// Quản lý toàn bộ các entities và relationships trong hệ thống
    /// </summary>
    public class AppDbContext : DbContext
    {
        #region Constructor
        /// <summary>
        /// Khởi tạo DbContext với options từ Dependency Injection
        /// </summary>
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        #endregion

        #region DbSets - Định nghĩa các bảng trong database

        // ==================== USER & AUTHENTICATION ====================
        /// <summary>Bảng Users - Lưu thông tin người dùng</summary>
        public DbSet<User> Users { get; set; }

        /// <summary>Bảng Roles - Các vai trò: Admin, Censor, User</summary>
        public DbSet<Role> Roles { get; set; }

        // ==================== RATINGS & REPORTS ====================
        /// <summary>Bảng Ratings - Đánh giá giữa các user</summary>
        public DbSet<Rating> Ratings { get; set; }

        /// <summary>Bảng PostReports - Báo cáo vi phạm bài đăng</summary>
        public DbSet<PostReport> PostReports { get; set; }

        /// <summary>Bảng PostRepStatuses - Trạng thái báo cáo (Pending/Processed/Refused)</summary>
        public DbSet<PostRepStatus> PostRepStatuses { get; set; }

        // ==================== POSTS ====================
        /// <summary>Bảng Posts - Bài đăng bán hàng</summary>
        public DbSet<Post> Posts { get; set; }

        /// <summary>Bảng PostImages - Hình ảnh của bài đăng</summary>
        public DbSet<PostImage> PostImages { get; set; }

        /// <summary>Bảng PostStatuses - Trạng thái bài đăng (Pending/Approved)</summary>
        public DbSet<PostStatus> PostStatuses { get; set; }

        /// <summary>Bảng SavedPosts - Bài đăng được lưu (bookmark)</summary>
        public DbSet<SavedPost> SavedPosts { get; set; }

        /// <summary>Bảng Comments - Bình luận trên bài đăng</summary>
        public DbSet<Comment> Comments { get; set; }

        // ==================== CATEGORY & BRAND ====================
        /// <summary>Bảng Categories - Danh mục sản phẩm (Điện thoại, Laptop...)</summary>
        public DbSet<Category> Categories { get; set; }

        /// <summary>Bảng Brands - Thương hiệu (Apple, Samsung...)</summary>
        public DbSet<Brand> Brands { get; set; }

        /// <summary>Bảng BrandCates - Quan hệ nhiều-nhiều giữa Brand và Category</summary>
        public DbSet<BrandCate> BrandCates { get; set; }

        /// <summary>Bảng PostCates - Quan hệ nhiều-nhiều giữa Post và Category</summary>
        public DbSet<PostCate> PostCates { get; set; }

        // ==================== SPECIFICATIONS ====================
        /// <summary>Bảng Specifications - Định nghĩa thông số kỹ thuật (CPU, RAM, GPU...)</summary>
        public DbSet<Specification> Specifications { get; set; }

        /// <summary>Bảng PostSpecifications - Giá trị thông số cụ thể của từng bài đăng</summary>
        public DbSet<PostSpecification> PostSpecifications { get; set; }

        // ==================== CHAT SYSTEM ====================
        /// <summary>Bảng ChatRooms - Phòng chat giữa 2 users</summary>
        public DbSet<ChatRoom> ChatRooms { get; set; }

        /// <summary>Bảng ChatMessages - Tin nhắn trong phòng chat</summary>
        public DbSet<ChatMessage> ChatMessages { get; set; }

        /// <summary>Bảng MessageImages - Hình ảnh đính kèm trong tin nhắn</summary>
        public DbSet<MessageImage> MessageImages { get; set; }

        // ==================== ORDER & ESCROW ====================
        /// <summary>Bảng Orders - Đơn hàng giữa người mua và người bán</summary>
        public DbSet<Order> Orders { get; set; }

        /// <summary>Bảng OrderStatuses - Trạng thái đơn hàng (Pending/Completed)</summary>
        public DbSet<OrderStatus> OrderStatuses { get; set; }

        /// <summary>Bảng Escrows - Tiền ký quỹ để bảo vệ giao dịch</summary>
        public DbSet<Escrow> Escrows { get; set; }

        /// <summary>Bảng EscrowStatuses - Trạng thái ký quỹ (Holding/Released)</summary>
        public DbSet<EscrowStatus> EscrowStatuses { get; set; }

        // ==================== DISPUTE MANAGEMENT ====================
        /// <summary>Bảng Disputes - Tranh chấp giữa người mua và người bán</summary>
        public DbSet<Dispute> Disputes { get; set; }

        /// <summary>Bảng DisputeStatuses - Trạng thái tranh chấp (Open/Resolved)</summary>
        public DbSet<DisputeStatus> DisputeStatuses { get; set; }

        /// <summary>Bảng DisputeEvidences - Bằng chứng tranh chấp</summary>
        public DbSet<DisputeEvidence> DisputeEvidences { get; set; }

        // ==================== SUBSCRIPTION PLANS ====================
        /// <summary>Bảng SubscriptionPlans - Các gói đăng ký (Free/VIP/Premium/Business)</summary>
        public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }

        /// <summary>Bảng UserSubscriptions - Gói đăng ký hiện tại của user</summary>
        public DbSet<UserSubscription> UserSubscriptions { get; set; }

        /// <summary>Bảng UserSubUsages - Theo dõi usage còn lại của gói đăng ký</summary>
        public DbSet<UserSubUsage> UserSubUsages { get; set; }

        #endregion

        #region OnModelCreating - Cấu hình Database Schema

        /// <summary>
        /// Cấu hình chi tiết cho database schema:
        /// - Relationships (quan hệ giữa các bảng)
        /// - Indexes (chỉ mục để tăng tốc query)
        /// - Constraints (ràng buộc dữ liệu)
        /// - Default values (giá trị mặc định)
        /// - Data seeding (dữ liệu mẫu ban đầu)
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ========== LOAD DỮ LIỆU MẪU BAN ĐẦU ==========
            DbSeeder.Seed(modelBuilder);

            // ========== CÁC PHƯƠNG THỨC CÁU HÌNH ==========
            ConfigureIndexes(modelBuilder);
            ConfigureCompositeKeys(modelBuilder);
            ConfigureUserRelationships(modelBuilder);
            ConfigurePostRelationships(modelBuilder);
            ConfigureOrderRelationships(modelBuilder);
            ConfigureChatRelationships(modelBuilder);
            ConfigureDisputeRelationships(modelBuilder);
            ConfigureEscrowRelationships(modelBuilder);
            ConfigureDecimalPrecision(modelBuilder);
            ConfigureDefaultValues(modelBuilder);
            ConfigureRequiredFields(modelBuilder);
            ConfigureCascadeDeletes(modelBuilder);
        }

        #endregion

        #region Private Configuration Methods

        /// <summary>
        /// CẤU HÌNH INDEXES - Tăng tốc độ truy vấn database
        /// Index giúp database tìm kiếm nhanh hơn, giống như mục lục trong sách
        /// </summary>
        private void ConfigureIndexes(ModelBuilder modelBuilder)
        {
            // --- USER INDEXES ---
            // Email phải unique và có index để đăng nhập nhanh
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique()
                .HasDatabaseName("IX_Users_Email");

            // UserName cũng cần index để tìm kiếm user
            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserName)
                .HasDatabaseName("IX_Users_UserName");

            // RoleId để filter user theo role
            modelBuilder.Entity<User>()
                .HasIndex(u => u.RoleId)
                .HasDatabaseName("IX_Users_RoleId");

            // --- POST INDEXES ---
            // Tìm tất cả bài đăng của 1 user
            modelBuilder.Entity<Post>()
                .HasIndex(p => p.UserId)
                .HasDatabaseName("IX_Posts_UserId");

            // Lọc bài đăng theo trạng thái (Pending/Approved)
            modelBuilder.Entity<Post>()
                .HasIndex(p => p.PostStatusId)
                .HasDatabaseName("IX_Posts_PostStatusId");

            // Sắp xếp bài đăng theo thời gian (mới nhất)
            modelBuilder.Entity<Post>()
                .HasIndex(p => p.CreatedAt)
                .HasDatabaseName("IX_Posts_CreatedAt");

            // Lọc bài đăng theo khoảng giá
            modelBuilder.Entity<Post>()
                .HasIndex(p => p.Price)
                .HasDatabaseName("IX_Posts_Price");

            // Lọc theo thương hiệu
            modelBuilder.Entity<Post>()
                .HasIndex(p => p.BrandId)
                .HasDatabaseName("IX_Posts_BrandId");

            // Composite index cho query phức tạp: Status + CreatedAt
            // VD: Lấy tất cả bài Approved, sắp xếp theo ngày mới nhất
            modelBuilder.Entity<Post>()
                .HasIndex(p => new { p.PostStatusId, p.CreatedAt })
                .HasDatabaseName("IX_Posts_Status_Created");

            // --- ORDER INDEXES ---
            // Tìm tất cả đơn hàng user đã mua
            modelBuilder.Entity<Order>()
                .HasIndex(o => o.BuyerUserId)
                .HasDatabaseName("IX_Orders_BuyerUserId");

            // Tìm tất cả đơn hàng user đã bán
            modelBuilder.Entity<Order>()
                .HasIndex(o => o.SellerUserId)
                .HasDatabaseName("IX_Orders_SellerUserId");

            // Lọc đơn hàng theo trạng thái
            modelBuilder.Entity<Order>()
                .HasIndex(o => o.OrdStatusId)
                .HasDatabaseName("IX_Orders_OrdStatusId");

            // Tìm order của 1 post cụ thể
            modelBuilder.Entity<Order>()
                .HasIndex(o => o.PostId)
                .HasDatabaseName("IX_Orders_PostId");

            // --- RATING INDEXES ---
            // Tìm tất cả rating user đã cho
            modelBuilder.Entity<Rating>()
                .HasIndex(r => r.FromUserId)
                .HasDatabaseName("IX_Ratings_FromUserId");

            // Tìm tất cả rating user đã nhận (để tính điểm trung bình)
            modelBuilder.Entity<Rating>()
                .HasIndex(r => r.ToUserId)
                .HasDatabaseName("IX_Ratings_ToUserId");

            // --- CHAT INDEXES ---
            // Tìm tất cả phòng chat của user
            modelBuilder.Entity<ChatRoom>()
                .HasIndex(c => c.User1Id)
                .HasDatabaseName("IX_ChatRooms_User1Id");

            modelBuilder.Entity<ChatRoom>()
                .HasIndex(c => c.User2Id)
                .HasDatabaseName("IX_ChatRooms_User2Id");

            // Composite index: tìm phòng chat giữa 2 user cụ thể
            modelBuilder.Entity<ChatRoom>()
                .HasIndex(c => new { c.User1Id, c.User2Id })
                .IsUnique()
                .HasDatabaseName("IX_ChatRooms_Users");

            // Lấy tin nhắn của 1 phòng chat
            modelBuilder.Entity<ChatMessage>()
                .HasIndex(m => m.ChatRoomId)
                .HasDatabaseName("IX_ChatMessages_ChatRoomId");

            // Sắp xếp tin nhắn theo thời gian
            modelBuilder.Entity<ChatMessage>()
                .HasIndex(m => m.CreateAt)
                .HasDatabaseName("IX_ChatMessages_CreatedAt");

            // --- SUBSCRIPTION INDEXES ---
            // Tìm gói đăng ký của user
            modelBuilder.Entity<UserSubscription>()
                .HasIndex(us => us.UserId)
                .HasDatabaseName("IX_UserSubscriptions_UserId");

            // Lọc gói đang active
            modelBuilder.Entity<UserSubscription>()
                .HasIndex(us => us.IsActive)
                .HasDatabaseName("IX_UserSubscriptions_IsActive");
        }

        /// <summary>
        /// CẤU HÌNH COMPOSITE KEYS - Khóa chính gộp
        /// Dùng cho các bảng quan hệ nhiều-nhiều (many-to-many)
        /// </summary>
        private void ConfigureCompositeKeys(ModelBuilder modelBuilder)
        {
            // BrandCate: 1 Brand có nhiều Category, 1 Category có nhiều Brand
            // Khóa chính gồm: BrandId + CateId
            modelBuilder.Entity<BrandCate>()
                .HasKey(bc => new { bc.BrandId, bc.CateId });

            // PostCate: 1 Post thuộc nhiều Category, 1 Category có nhiều Post
            // Khóa chính gồm: PostId + CateId
            modelBuilder.Entity<PostCate>()
                .HasKey(pc => new { pc.PostId, pc.CateId });
        }

        /// <summary>
        /// CẤU HÌNH RELATIONSHIPS CHO USER
        /// Xử lý các quan hệ phức tạp liên quan đến User
        /// </summary>
        private void ConfigureUserRelationships(ModelBuilder modelBuilder)
        {
            // --- USER -> ROLE ---
            // Nhiều User có 1 Role
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict); // Không xóa Role nếu còn User

            // --- RATING RELATIONSHIPS ---
            // Rating có 2 user: FromUser (người đánh giá) và ToUser (người được đánh giá)
            // VD: User A đánh giá User B => FromUser = A, ToUser = B

            // FromUser -> Rating (User đã cho những rating nào)
            modelBuilder.Entity<Rating>()
                .HasOne(r => r.FromUser)
                .WithMany(u => u.RatingsGiven)
                .HasForeignKey(r => r.FromUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ToUser -> Rating (User đã nhận những rating nào)
            modelBuilder.Entity<Rating>()
                .HasOne(r => r.ToUser)
                .WithMany(u => u.RatingsReceived)
                .HasForeignKey(r => r.ToUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- USER SUBSCRIPTION ---
            // User -> UserSubscription
            modelBuilder.Entity<UserSubscription>()
                .HasOne(us => us.User)
                .WithMany(u => u.UserSubscriptions)
                .HasForeignKey(us => us.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Xóa User -> xóa subscription

            // SubscriptionPlan -> UserSubscription
            modelBuilder.Entity<UserSubscription>()
                .HasOne(us => us.SubscriptionPlan)
                .WithMany(sp => sp.UserSubscriptions)
                .HasForeignKey(us => us.SubPlanId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- USER SUB USAGE ---
            // User -> UserSubUsage
            modelBuilder.Entity<UserSubUsage>()
                .HasOne(usu => usu.User)
                .WithMany(u => u.UserSubUsages)
                .HasForeignKey(usu => usu.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        /// <summary>
        /// CẤU HÌNH RELATIONSHIPS CHO POST
        /// Xử lý quan hệ giữa Post và các entities khác
        /// </summary>
        private void ConfigurePostRelationships(ModelBuilder modelBuilder)
        {
            // --- POST -> USER ---
            // Post được tạo bởi User
            modelBuilder.Entity<Post>()
                .HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Không xóa User nếu còn Post

            // --- POST -> BRAND ---
            modelBuilder.Entity<Post>()
                .HasOne(p => p.Brand)
                .WithMany(b => b.Posts)
                .HasForeignKey(p => p.BrandId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- POST -> POST STATUS ---
            modelBuilder.Entity<Post>()
                .HasOne(p => p.PostStatusNavigation)
                .WithMany(ps => ps.Posts)
                .HasForeignKey(p => p.PostStatusId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- POST -> APPROVED BY USER (CENSOR) ---
            // Post được approve bởi Censor
            modelBuilder.Entity<Post>()
                .HasOne(p => p.ApprovedByUser)
                .WithMany()
                .HasForeignKey(p => p.ApprovedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // --- POST -> POST IMAGES ---
            // CASCADE: Xóa Post -> tự động xóa tất cả hình ảnh
            modelBuilder.Entity<PostImage>()
                .HasOne(pi => pi.Post)
                .WithMany(p => p.PostImages)
                .HasForeignKey(pi => pi.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // --- POST -> POST SPECIFICATIONS ---
            // CASCADE: Xóa Post -> tự động xóa tất cả thông số kỹ thuật
            modelBuilder.Entity<PostSpecification>()
                .HasOne(ps => ps.Post)
                .WithMany(p => p.PostSpecifications)
                .HasForeignKey(ps => ps.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // --- SPECIFICATION -> POST SPECIFICATIONS ---
            modelBuilder.Entity<PostSpecification>()
                .HasOne(ps => ps.Specification)
                .WithMany(s => s.PostSpecifications)
                .HasForeignKey(ps => ps.SpecId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- POST -> COMMENTS ---
            // CASCADE: Xóa Post -> tự động xóa tất cả comments
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // USER -> COMMENTS
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- POST -> SAVED POSTS ---
            // CASCADE: Xóa Post -> tự động xóa khỏi saved list
            modelBuilder.Entity<SavedPost>()
                .HasOne(sp => sp.Post)
                .WithMany(p => p.SavedPosts)
                .HasForeignKey(sp => sp.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // USER -> SAVED POSTS
            modelBuilder.Entity<SavedPost>()
                .HasOne(sp => sp.User)
                .WithMany(u => u.SavedPosts)
                .HasForeignKey(sp => sp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // --- POST -> POST CATEGORIES (MANY-TO-MANY) ---
            modelBuilder.Entity<PostCate>()
                .HasKey(pc => new { pc.PostId, pc.CateId });

            modelBuilder.Entity<PostCate>()
                .HasOne(pc => pc.Post)
                .WithMany(p => p.PostCates)
                .HasForeignKey(pc => pc.PostId);

            modelBuilder.Entity<PostCate>()
                .HasOne(pc => pc.Category)
                .WithMany(c => c.PostCates)
                .HasForeignKey(pc => pc.CateId);

            //modelBuilder.Entity<PostCate>()
            //    .HasOne(pc => pc.Post)
            //    .WithMany(p => p.PostCates)
            //    .HasForeignKey(pc => pc.PostId)
            //    .OnDelete(DeleteBehavior.Cascade);

            //modelBuilder.Entity<PostCate>()
            //    .HasOne(pc => pc.Category)
            //    .WithMany(c => c.PostCates)
            //    .HasForeignKey(pc => pc.CateId)
            //    .OnDelete(DeleteBehavior.Cascade);

            // --- POST REPORTS ---
            modelBuilder.Entity<PostReport>()
                .HasOne(pr => pr.ReportedPost)
                .WithMany(p => p.Reports)
                .HasForeignKey(pr => pr.ReportedPostId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PostReport>()
                .HasOne(pr => pr.ReportedUser)
                .WithMany(u => u.ReportedPost)
                .HasForeignKey(pr => pr.ReportedFromUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PostReport>()
                .HasOne(pr => pr.PostRepStatus)
                .WithMany(prs => prs.PostReport)
                .HasForeignKey(pr => pr.PostRepStatusId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        /// <summary>
        /// CẤU HÌNH RELATIONSHIPS CHO ORDER
        /// Order có 2 user: BuyerUser và SellerUser
        /// </summary>
        private void ConfigureOrderRelationships(ModelBuilder modelBuilder)
        {
            // --- ORDER -> BUYER USER ---
            // User với vai trò người mua
            modelBuilder.Entity<Order>()
                .HasOne(o => o.BuyerUser)
                .WithMany(u => u.OrdersAsBuyer)
                .HasForeignKey(o => o.BuyerUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- ORDER -> SELLER USER ---
            // User với vai trò người bán
            modelBuilder.Entity<Order>()
                .HasOne(o => o.SellerUser)
                .WithMany(u => u.OrdersAsSeller)
                .HasForeignKey(o => o.SellerUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- ORDER -> POST ---
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Post)
                .WithMany(p => p.Orders)
                .HasForeignKey(o => o.PostId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- ORDER -> ORDER STATUS ---
            modelBuilder.Entity<Order>()
                .HasOne(o => o.OrderStatus)
                .WithMany(os => os.Orders)
                .HasForeignKey(o => o.OrdStatusId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        /// <summary>
        /// CẤU HÌNH RELATIONSHIPS CHO CHAT
        /// ChatRoom giữa 2 users: User1 và User2
        /// </summary>
        private void ConfigureChatRelationships(ModelBuilder modelBuilder)
        {
            // --- CHATROOM -> USER1 ---
            modelBuilder.Entity<ChatRoom>()
                .HasOne(c => c.User1)
                .WithMany(u => u.ChatRoomsUser1)
                .HasForeignKey(c => c.User1Id)
                .OnDelete(DeleteBehavior.Restrict);

            // --- CHATROOM -> USER2 ---
            modelBuilder.Entity<ChatRoom>()
                .HasOne(c => c.User2)
                .WithMany(u => u.ChatRoomsUser2)
                .HasForeignKey(c => c.User2Id)
                .OnDelete(DeleteBehavior.Restrict);

            // --- CHATMESSAGE -> CHATROOM ---
            // CASCADE: Xóa ChatRoom -> xóa tất cả messages
            modelBuilder.Entity<ChatMessage>()
                .HasOne(cm => cm.ChatRoom)
                .WithMany(cr => cr.ChatMessages)
                .HasForeignKey(cm => cm.ChatRoomId)
                .OnDelete(DeleteBehavior.Cascade);

            // --- CHATMESSAGE -> USER ---
            modelBuilder.Entity<ChatMessage>()
                .HasOne(cm => cm.FromUser)
                .WithMany(u => u.ChatMessages)
                .HasForeignKey(cm => cm.FromUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- MESSAGE IMAGE -> CHAT MESSAGE ---
            // CASCADE: Xóa Message -> xóa tất cả images
            modelBuilder.Entity<MessageImage>()
                .HasOne(mi => mi.ChatMessage)
                .WithMany(cm => cm.MessageImages)
                .HasForeignKey(mi => mi.MessageImgId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        /// <summary>
        /// CẤU HÌNH RELATIONSHIPS CHO DISPUTE
        /// Dispute được mở bởi 1 user và được gán cho admin
        /// </summary>
        private void ConfigureDisputeRelationships(ModelBuilder modelBuilder)
        {
            // --- DISPUTE -> ORDER ---
            modelBuilder.Entity<Dispute>()
                .HasOne(d => d.Order)
                .WithMany(o => o.Disputes)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- DISPUTE -> OPENED BY USER ---
            // User mở tranh chấp
            modelBuilder.Entity<Dispute>()
                .HasOne(d => d.OpenedByUser)
                .WithMany(u => u.DisputesOpened)
                .HasForeignKey(d => d.OpenedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- DISPUTE -> ASSIGNED ADMIN ---
            // Admin được giao xử lý tranh chấp
            modelBuilder.Entity<Dispute>()
                .HasOne(d => d.AssignedByAdmin)
                .WithMany()
                .HasForeignKey(d => d.AssignedByAdminUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- DISPUTE -> DISPUTE STATUS ---
            modelBuilder.Entity<Dispute>()
                .HasOne(d => d.DisputeStatus)
                .WithMany(ds => ds.Disputes)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- DISPUTE EVIDENCE -> DISPUTE ---
            // CASCADE: Xóa Dispute -> xóa tất cả evidences
            modelBuilder.Entity<DisputeEvidence>()
                .HasOne(de => de.Dispute)
                .WithMany(d => d.DisputeEvidences)
                .HasForeignKey(de => de.DisputeId)
                .OnDelete(DeleteBehavior.Cascade);

            // --- DISPUTE EVIDENCE -> USER ---
            modelBuilder.Entity<DisputeEvidence>()
                .HasOne(de => de.SubmitByUser)
                .WithMany(u => u.DisputeEvidences)
                .HasForeignKey(de => de.SubmitByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        /// <summary>
        /// CẤU HÌNH RELATIONSHIPS CHO ESCROW
        /// Quan hệ 1-1 giữa Order và Escrow
        /// </summary>
        private void ConfigureEscrowRelationships(ModelBuilder modelBuilder)
        {
            // --- ESCROW <-> ORDER (1-1) ---
            // Mỗi Order có đúng 1 Escrow và ngược lại
            modelBuilder.Entity<Escrow>()
                .HasOne(e => e.Order)
                .WithOne(o => o.Escrow)
                .HasForeignKey<Escrow>(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade); // Xóa Order -> xóa Escrow

            // --- ESCROW -> ESCROW STATUS ---
            modelBuilder.Entity<Escrow>()
                .HasOne(e => e.EscrowStatus)
                .WithMany(es => es.Escrows)
                .HasForeignKey(e => e.EscStatusId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        /// <summary>
        /// CẤU HÌNH DECIMAL PRECISION
        /// Thiết lập độ chính xác cho các trường tiền tệ
        /// decimal(18,2) = 18 chữ số tổng, 2 số thập phân
        /// </summary>
        private void ConfigureDecimalPrecision(ModelBuilder modelBuilder)
        {
            // --- POST PRICE ---
            modelBuilder.Entity<Post>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)")
                .HasPrecision(18, 2);

            // --- ESCROW AMOUNTS ---
            modelBuilder.Entity<Escrow>()
                .Property(e => e.TotalAmount)
                .HasColumnType("decimal(18,2)")
                .HasPrecision(18, 2);

            modelBuilder.Entity<Escrow>()
                .Property(e => e.PostPrice)
                .HasColumnType("decimal(18,2)")
                .HasPrecision(18, 2);

            // --- SUBSCRIPTION PLAN PRICE ---
            modelBuilder.Entity<SubscriptionPlan>()
                .Property(s => s.SubPlanPrice)
                .HasColumnType("decimal(18,2)")
                .HasPrecision(18, 2);

            // --- PLATFORM FEE ---
            modelBuilder.Entity<Escrow>()
                .Property(e => e.PlatformFee)
                .HasColumnType("decimal(5,2)")
                .HasPrecision(5, 2);
        }

        /// <summary>
        /// CẤU HÌNH DEFAULT VALUES
        /// Thiết lập giá trị mặc định khi insert record mới
        /// </summary>
        private void ConfigureDefaultValues(ModelBuilder modelBuilder)
        {
            // --- POST DEFAULT VALUES ---
            modelBuilder.Entity<Post>()
                .Property(p => p.ViewCount)
                .HasDefaultValue(0);

            modelBuilder.Entity<Post>()
                .Property(p => p.SavedCount)
                .HasDefaultValue(0);

            modelBuilder.Entity<Post>()
                .Property(p => p.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            // --- USER DEFAULT VALUES ---
            modelBuilder.Entity<User>()
                .Property(u => u.CreateAt)
                .HasDefaultValueSql("GETDATE()");

            // --- COMMENT DEFAULT VALUES ---
            modelBuilder.Entity<Comment>()
                .Property(c => c.CreateAt)
                .HasDefaultValueSql("GETDATE()");

            // --- SAVED POST DEFAULT VALUES ---
            modelBuilder.Entity<SavedPost>()
                .Property(sp => sp.CreateAt)
                .HasDefaultValueSql("GETDATE()");

            // --- ORDER DEFAULT VALUES ---
            modelBuilder.Entity<Order>()
                .Property(o => o.CreateAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<Order>()
                .Property(o => o.IsShippedBySeller)
                .HasDefaultValue(false);

            modelBuilder.Entity<Order>()
                .Property(o => o.IsReceivedByBuyer)
                .HasDefaultValue(false);

            // --- CHAT MESSAGE DEFAULT VALUES ---
            modelBuilder.Entity<ChatMessage>()
                .Property(cm => cm.CreateAt)
                .HasDefaultValueSql("GETDATE()");

            // --- RATING DEFAULT VALUES ---
            modelBuilder.Entity<Rating>()
                .Property(r => r.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            // --- DISPUTE DEFAULT VALUES ---
            modelBuilder.Entity<Dispute>()
                .Property(d => d.CreateAt)
                .HasDefaultValueSql("GETDATE()");

            // --- POST REPORT DEFAULT VALUES ---
            modelBuilder.Entity<PostReport>()
                .Property(pr => pr.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            // --- USER SUBSCRIPTION DEFAULT VALUES ---
            modelBuilder.Entity<UserSubscription>()
                .Property(us => us.IsActive)
                .HasDefaultValue(true);
        }

        /// <summary>
        /// CẤU HÌNH REQUIRED FIELDS VÀ MAX LENGTH
        /// Validation ở database level để đảm bảo data integrity
        /// </summary>
        private void ConfigureRequiredFields(ModelBuilder modelBuilder)
        {
            // --- USER REQUIRED FIELDS ---
            modelBuilder.Entity<User>()
                .Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(255);

            modelBuilder.Entity<User>()
                .Property(u => u.UserName)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<User>()
                .Property(u => u.FullName)
                .IsRequired()
                .HasMaxLength(200);

            modelBuilder.Entity<User>()
                .Property(u => u.PasswordHash)
                .IsRequired()
                .HasMaxLength(500);

            // --- POST REQUIRED FIELDS ---
            modelBuilder.Entity<Post>()
                .Property(p => p.Title)
                .IsRequired()
                .HasMaxLength(500);

            modelBuilder.Entity<Post>()
                .Property(p => p.Description)
                .IsRequired()
                .HasMaxLength(5000);

            modelBuilder.Entity<Post>()
                .Property(p => p.Address)
                .IsRequired()
                .HasMaxLength(500);

            modelBuilder.Entity<Post>()
                .Property(p => p.Status)
                .IsRequired()
                .HasMaxLength(100);

            // --- CATEGORY REQUIRED FIELDS ---
            modelBuilder.Entity<Category>()
                .Property(c => c.CateName)
                .IsRequired()
                .HasMaxLength(200);

            // --- BRAND REQUIRED FIELDS ---
            modelBuilder.Entity<Brand>()
                .Property(b => b.BrandName)
                .IsRequired()
                .HasMaxLength(200);

            // --- SPECIFICATION REQUIRED FIELDS ---
            modelBuilder.Entity<Specification>()
                .Property(s => s.SpecName)
                .IsRequired()
                .HasMaxLength(200);

            modelBuilder.Entity<Specification>()
                .Property(s => s.Description)
                .HasMaxLength(1000);

            // --- POST SPECIFICATION VALUE ---
            modelBuilder.Entity<PostSpecification>()
                .Property(ps => ps.SpecValue)
                .IsRequired()
                .HasMaxLength(500);

            // --- COMMENT REQUIRED FIELDS ---
            modelBuilder.Entity<Comment>()
                .Property(c => c.Content)
                .IsRequired()
                .HasMaxLength(2000);

            // --- RATING REQUIRED FIELDS ---
            modelBuilder.Entity<Rating>()
                .Property(r => r.Star)
                .IsRequired();

            modelBuilder.Entity<Rating>()
                .Property(r => r.Comment)
                .HasMaxLength(1000);

            // --- CHAT MESSAGE REQUIRED FIELDS ---
            modelBuilder.Entity<ChatMessage>()
                .Property(cm => cm.ChatContent)
                .HasMaxLength(5000);

            // --- DISPUTE REQUIRED FIELDS ---
            modelBuilder.Entity<Dispute>()
                .Property(d => d.DisputeReason)
                .IsRequired()
                .HasMaxLength(2000);

            // --- POST REPORT REQUIRED FIELDS ---
            modelBuilder.Entity<PostReport>()
                .Property(pr => pr.Reason)
                .IsRequired()
                .HasMaxLength(2000);

            // --- ROLE NAME ---
            modelBuilder.Entity<Role>()
                .Property(r => r.RoleName)
                .IsRequired()
                .HasMaxLength(100);

            // --- STATUS NAMES ---
            modelBuilder.Entity<PostStatus>()
                .Property(ps => ps.PostStatusName)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<OrderStatus>()
                .Property(os => os.OrdStatusName)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<EscrowStatus>()
                .Property(es => es.EscStatusName)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<DisputeStatus>()
                .Property(ds => ds.DisStatusName)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<PostRepStatus>()
                .Property(prs => prs.PostRepStatusName)
                .IsRequired()
                .HasMaxLength(100);

            // --- SUBSCRIPTION PLAN ---
            modelBuilder.Entity<SubscriptionPlan>()
                .Property(sp => sp.SubPlanName)
                .IsRequired()
                .HasMaxLength(200);
        }

        /// <summary>
        /// CẤU HÌNH CASCADE DELETES
        /// Xác định hành vi khi xóa parent record
        /// CASCADE = Tự động xóa children
        /// RESTRICT = Không cho xóa nếu còn children
        /// </summary>
        private void ConfigureCascadeDeletes(ModelBuilder modelBuilder)
        {
            // Các relationship đã được cấu hình trong các method trên:

            // CASCADE DELETE:
            // - Xóa Post -> xóa PostImages, PostSpecifications, Comments, SavedPosts
            // - Xóa User -> xóa UserSubscriptions, UserSubUsages, SavedPosts
            // - Xóa ChatRoom -> xóa ChatMessages
            // - Xóa ChatMessage -> xóa MessageImages
            // - Xóa Dispute -> xóa DisputeEvidences
            // - Xóa Order -> xóa Escrow
            // - Xóa Post -> xóa PostReports

            // RESTRICT (Không cho xóa):
            // - User nếu còn: Posts, Orders (buyer/seller), Ratings, Comments
            // - Post nếu còn: Orders
            // - Role nếu còn: Users
            // - Brand nếu còn: Posts
            // - Category nếu còn: Specifications
            // - Order nếu còn: Disputes
        }

        #endregion
    }
}