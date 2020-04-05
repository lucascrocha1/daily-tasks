namespace DailyTasks.Server.Infrastructure.Services.File
{
    using Microsoft.AspNetCore.Http;
	using Microsoft.Extensions.Configuration;
	using System;
    using System.IO;
    using System.Threading.Tasks;

    public class FileService : IFileService
    {
        private readonly IConfiguration _configuration;

        public FileService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<string> CreateAndSaveFile(string fileName, string base64)
        {
            if (string.IsNullOrEmpty(base64) || string.IsNullOrEmpty(fileName))
                return null;

            var bytes = Convert.FromBase64String(base64);

            var folderPath = GetFilePathRoot();

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var filePath = GetFileName(fileName);

            var pathToFile = Path.Combine(folderPath, filePath);

            await File.WriteAllBytesAsync(pathToFile, bytes);

            return filePath;
        }

        public Task<Stream> GetFile(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
                return null;

            var folderPath = GetFilePathRoot();

            var pathFile = Path.Combine(folderPath, filePath);

            if (!File.Exists(pathFile))
                return null;

            return Task.FromResult<Stream>(File.OpenRead(pathFile));
        }

        public Task RemoveFile(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
                return null;

            var folderPath = GetFilePathRoot();

            var pathFile = Path.Combine(folderPath, filePath);

            if (File.Exists(pathFile))
                File.Delete(pathFile);

            return Task.CompletedTask;
        }

        public async Task<string> SaveFile(IFormFile file)
        {
            if (file == null)
                return null;

            var folderPath = GetFilePathRoot();

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var filePath = GetFileName(file.Name);

            var pathToFile = Path.Combine(folderPath, filePath);

            using var stream = new FileStream(pathToFile, FileMode.Create);

            await file.CopyToAsync(stream);

            return filePath;
        }

        private string GetFileName(string fileName)
        {
            return $@"{Guid.NewGuid()}-{fileName}";
        }

        private string GetFilePathRoot()
        {
            return _configuration["FilePathRoot"];
        }
    }
}