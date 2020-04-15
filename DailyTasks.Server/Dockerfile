FROM mcr.microsoft.com/dotnet/core/runtime:3.1 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src
CMD ./run-client-build.bat && cmd
COPY ["DailyTasks.Server.csproj", "./"]
RUN dotnet restore "./DailyTasks.Server.csproj"
COPY . .
RUN dotnet build "DailyTasks.Server.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "DailyTasks.Server.csproj" -c Release -o /app

FROM base AS FINAL
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "DailyTasks.Server.csproj"]