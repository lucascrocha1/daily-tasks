namespace DailyTasks.Server.Infrastructure
{
    public static class Helpers
    {
        public static string Pluralize(this string word)
        {
            if (word.ToLower().EndsWith('s'))
                return word;

            return $"{word}s";
        }
    }
}