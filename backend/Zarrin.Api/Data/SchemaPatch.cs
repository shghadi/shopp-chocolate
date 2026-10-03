using System.Data;

namespace Zarrin.Api.Data;

public static class SchemaPatch
{
    public static void EnsureOrderStatus(AppDbContext db)
    {
        var connection = db.Database.GetDbConnection();
        var openedHere = connection.State != ConnectionState.Open;
        if (openedHere) connection.Open();

        try
        {
            using var table = connection.CreateCommand();
            table.CommandText = "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'Orders'";
            if (table.ExecuteScalar() is null) return;

            using var columns = connection.CreateCommand();
            columns.CommandText = "SELECT COUNT(*) FROM pragma_table_info('Orders') WHERE name = 'Status'";
            var count = Convert.ToInt64(columns.ExecuteScalar());
            if (count > 0) return;

            using var alter = connection.CreateCommand();
            alter.CommandText = "ALTER TABLE Orders ADD COLUMN Status TEXT NOT NULL DEFAULT 'new'";
            alter.ExecuteNonQuery();
        }
        finally
        {
            if (openedHere) connection.Close();
        }
    }
}
