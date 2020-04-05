namespace DailyTasks.Server.Infrastructure.Services.File
{
    using Microsoft.AspNetCore.Http;
    using System.IO;
    using System.Threading.Tasks;

    public interface IFileService
    {
        Task<string> CreateAndSaveFile(string fileName, string base64);

        Task<string> SaveFile(IFormFile file);

        Task RemoveFile(string filePath);

        Task<Stream> GetFile(string filePath);
    }
}