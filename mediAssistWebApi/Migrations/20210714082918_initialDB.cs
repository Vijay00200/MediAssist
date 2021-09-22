using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace mediAssistWebApi.Migrations
{
    public partial class initialDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Medicine",
                columns: table => new
                {
                    MedicineId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicineName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medicine", x => x.MedicineId);
                });

            migrationBuilder.CreateTable(
                name: "Symptom",
                columns: table => new
                {
                    SymptomId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SymptomName = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Symptom", x => x.SymptomId);
                });

            migrationBuilder.CreateTable(
                name: "Remedies",
                columns: table => new
                {
                    RemedyId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicineId = table.Column<int>(type: "int", nullable: false),
                    SymptomId = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Remedies", x => x.RemedyId);
                    table.ForeignKey(
                        name: "FK_Remedies_Medicine_MedicineId",
                        column: x => x.MedicineId,
                        principalTable: "Medicine",
                        principalColumn: "MedicineId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Remedies_Symptom_SymptomId",
                        column: x => x.SymptomId,
                        principalTable: "Symptom",
                        principalColumn: "SymptomId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Dosages",
                columns: table => new
                {
                    DosageId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DosageDays = table.Column<int>(type: "int", nullable: false),
                    DosageTimes = table.Column<int>(type: "int", nullable: false),
                    DosagePower = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RemedyId = table.Column<int>(type: "int", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dosages", x => x.DosageId);
                    table.ForeignKey(
                        name: "FK_Dosages_Remedies_RemedyId",
                        column: x => x.RemedyId,
                        principalTable: "Remedies",
                        principalColumn: "RemedyId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dosages_RemedyId",
                table: "Dosages",
                column: "RemedyId");

            migrationBuilder.CreateIndex(
                name: "IX_Remedies_MedicineId",
                table: "Remedies",
                column: "MedicineId");

            migrationBuilder.CreateIndex(
                name: "IX_Remedies_SymptomId",
                table: "Remedies",
                column: "SymptomId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Dosages");

            migrationBuilder.DropTable(
                name: "Remedies");

            migrationBuilder.DropTable(
                name: "Medicine");

            migrationBuilder.DropTable(
                name: "Symptom");
        }
    }
}
