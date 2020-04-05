using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DailyTasks.Server.Migrations
{
    public partial class AddAttachmentModels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChangedBy",
                table: "DailyTaskChecklist",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "DailyTaskChecklist",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DailyTaskAttachment",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Link = table.Column<string>(nullable: true),
                    FileName = table.Column<string>(nullable: true),
                    FilePath = table.Column<string>(nullable: true),
                    CreatedBy = table.Column<string>(nullable: true),
                    ChangedBy = table.Column<string>(nullable: true),
                    DailyTaskId = table.Column<int>(nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyTaskAttachment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyTaskAttachment_DailyTask_DailyTaskId",
                        column: x => x.DailyTaskId,
                        principalTable: "DailyTask",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DailyTaskCommentAttachment",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileName = table.Column<string>(nullable: true),
                    FilePath = table.Column<string>(nullable: true),
                    DailyTaskCommentId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyTaskCommentAttachment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyTaskCommentAttachment_DailyTaskComment_DailyTaskCommentId",
                        column: x => x.DailyTaskCommentId,
                        principalTable: "DailyTaskComment",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DailyTaskAttachment_DailyTaskId",
                table: "DailyTaskAttachment",
                column: "DailyTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_DailyTaskCommentAttachment_DailyTaskCommentId",
                table: "DailyTaskCommentAttachment",
                column: "DailyTaskCommentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyTaskAttachment");

            migrationBuilder.DropTable(
                name: "DailyTaskCommentAttachment");

            migrationBuilder.DropColumn(
                name: "ChangedBy",
                table: "DailyTaskChecklist");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "DailyTaskChecklist");
        }
    }
}
