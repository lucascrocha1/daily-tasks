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

        public static DateTime StartOfTheDay(this DateTime source)
        {
            return new DateTime(source.Year, source.Month, source.Day, 0, 0, 0, 0, DateTimeKind.Utc);
        }

        public static DateTime EndOfTheDay(this DateTime source)
        {
            return new DateTime(source.Year, source.Month, source.Day, 23, 59, 59, 999, DateTimeKind.Utc);
        }
    }
}