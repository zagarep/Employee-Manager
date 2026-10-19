using Microsoft.EntityFrameworkCore;
using System;
using EmployeeManagement.Data;
using EmployeeManagement.Services;
using EmployeeManagement.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. SERVICES CONFIGURATION ZONE
// ==========================================

// Configure Database Connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure CORS Policy for Angular Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Register Custom Application Services
builder.Services.AddScoped<IAuthService, AuthService>();

// Configure Controllers & API Explorer
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token."
    });

    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] = []
        });
});
// Note: If you want .NET native OpenAPI instead of Swagger UI, 
// replace .AddSwaggerGen() with .AddOpenApi() here.

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSettings["Key"];

if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT Key is missing from configuration (appsettings.json).");
}

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

// ==========================================
// 2. HTTP REQUEST PIPELINE (MIDDLEWARE)
// ==========================================
var app = builder.Build();

// Development-only tools (Swagger / OpenAPI UI)
if (app.Environment.IsDevelopment())
{
    // If you use Microsoft.AspNetCore.OpenApi, keep app.MapOpenApi();
    // If you stick to Swashbuckle, app.UseSwagger() is what maps the JSON.
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 1. Force HTTPS redirection early
app.UseHttpsRedirection();

// 2. Route the request
app.UseRouting();

// 3. Apply CORS policy BEFORE Auth checks so pre-flight OPTIONS requests pass
app.UseCors("AllowAngular");

// 4. Identify WHO the user is
app.UseAuthentication();

// 5. Identify WHAT the user is allowed to do
app.UseAuthorization();

// 6. Map the controllers to execution endpoints
app.MapControllers();

app.Run();
