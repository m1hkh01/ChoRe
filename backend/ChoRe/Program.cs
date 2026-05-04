using System.Text;
using ChoRe.Data;
using ChoRe.Models;
using Ganss.Xss;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSignalR();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true; //Lưu Token vào HttpContext để dùng 
    // VD: var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,// kiểm tra ai phát hành token
        ValidateAudience = true,// kiểm tra token này dùng cho ai
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured")))
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrEmpty(accessToken) &&
                path.StartsWithSegments("/chatHub"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});
builder.Services.AddAuthorization();
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.SerializerOptions.WriteIndented = true;
});
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
});
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<AccountService>();
builder.Services.AddScoped<IPostService, PostService>(); // Post Service
builder.Services.AddScoped<IPackageService, PackageService>(); // Package Service
builder.Services.AddScoped<ISubscriptionPlanService, SubscriptionPlanService>(); // Subscription Plan Service
builder.Services.AddScoped<IEscrowTransactionService, EscrowTransactionService>(); // Escrow Transaction Service
builder.Services.AddScoped<IUserSubscriptionService, UserSubscriptionService>(); // User Subscription Service
builder.Services.AddScoped<IConvertationService, ConvertationService>(); // Conversation Service
builder.Services.AddScoped<IReviewService, ReviewService>(); // Review Service
builder.Services.AddScoped<INotificationService, NotificationService>(); // Notification Service
builder.Services.AddScoped<HtmlSanitizer>();
builder.Services.AddScoped<MailSettings>();
builder.Services.AddScoped<ISendMailService, SendMailService>();
builder.Services.AddSingleton<IUserIdProvider, JwtUserIdProvider>();


builder.Services.AddScoped<IReminderStrategy, TransactionExpireStrategy>();
builder.Services.AddScoped<IReminderStrategy, TransactionNotificationStrategy>();
builder.Services.AddScoped<IReminderStrategy, TransactionAutoCompleteStrategy>();
builder.Services.AddScoped<IReminderStrategy, SubscriptionExpireStrategy>();
builder.Services.AddScoped<IReminderStrategy, SubscriptionNotificationStrategy>();
builder.Services.AddScoped<IReminderStrategy, DisputeNotificationStrategy>();
builder.Services.AddScoped<IReminderStrategy, PostNotificationStrategy>();
builder.Services.AddScoped<IReminderStrategy, ReviewReminderStrategy>();

builder.Services.AddHostedService<ReminderEngineService>();

builder.Services.AddCors(options =>
                        options.AddPolicy("AllowFrontend",
                            p => p.WithOrigins("https://chore123.cloud", "http://localhost:5173")
                                  .AllowAnyMethod()
                                  .AllowAnyHeader()
                                  .AllowCredentials()));

// swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ChoRe API",
        Version = "v1",
        Description = "API cho hệ thống Chợ Rẻ"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập token theo dạng: Bearer {your_token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ChoRe API v1");
        c.RoutePrefix = "swagger";
    });
}
// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseStaticFiles();


if (!app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
// app.MapControllerRoute(
//     name: "default",
//     pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapHub<ChatHub>("/chatHub");

app.MapControllers();
app.Run();


