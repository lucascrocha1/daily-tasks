namespace DailyTasks.Server.Infrastructure
{
    using System;

    public static class Helpers
    {
        public static string Pluralize(this string word)
        {
            if (word.ToLower().EndsWith('s'))
                return word;

            return $"{word}s";
        }

        public static DateTimeOffset StartOfTheDay(this DateTimeOffset source)
        {
            return new DateTimeOffset(source.Year, source.Month, source.Day, 0, 0, 0, 0, source.Offset);
        }
    }
}