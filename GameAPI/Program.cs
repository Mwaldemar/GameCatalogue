using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using GameAPI.Data;
using GameAPI.Services;
using System.IdentityModel.Tokens.Jwt;


var builder = WebApplication.CreateBuilder(args);
JwtSecurityTokenHandler.DefaultMapInboundClaims = false;
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddDbContext<GameDbContext>(options =>
    options.UseSqlite("Data Source=games.db"));

builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<ITagService, TagService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();


builder.Services.AddControllers()
    .AddNewtonsoftJson();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})



.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero,
        NameClaimType = "name",
        RoleClaimType = "role"
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseRouting();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();

app.UseAuthorization();

//app.UseHttpsRedirection();

app.MapControllers();

app.Run();
