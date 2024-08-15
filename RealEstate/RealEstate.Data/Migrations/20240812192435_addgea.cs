using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealEstate.Data.Migrations
{
    /// <inheritdoc />
    public partial class addgea : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "GeoX",
                table: "Estates",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "GeoY",
                table: "Estates",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GeoX",
                table: "Estates");

            migrationBuilder.DropColumn(
                name: "GeoY",
                table: "Estates");
        }
    }
}
