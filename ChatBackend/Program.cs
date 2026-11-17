using ChatBackend.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Initialize SignalR
builder.Services.AddSignalR();

// CORS configuration to allow requests from the React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Krävs specifikt för SignalR
    });
});

var app = builder.Build();

app.UseCors("AllowReactApp");

app.MapHub<ChatHub>("/chathub");

app.Run();