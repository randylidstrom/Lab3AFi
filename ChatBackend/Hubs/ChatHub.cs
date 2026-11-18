using Microsoft.AspNetCore.SignalR;

namespace ChatBackend.Hubs;

public class ChatHub : Hub
{
    // Task 2: Public channel for students and teachers
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    // Task 5: Announcement channel for teachers only
    public async Task SendAnnouncement(string user, string message, string role)
    {
        // Security check on the server side:
        if (role == "Teacher")
        {
            await Clients.All.SendAsync("ReceiveAnnouncement", user, message);
        }
    }
}