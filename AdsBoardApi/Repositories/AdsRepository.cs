using System.Text.Json;
using AdsBoardApi.Models;

namespace AdsBoardApi.Repositories;

public class AdsRepository
{
    private readonly string _filePath = Path.Combine("Data", "ads.json");

    public RepoResult<List<Ad>> GetAll()
    {
        try
        {
            if (!File.Exists(_filePath))
                return RepoResult<List<Ad>>.Fail("קובץ לא נמצא");

            var json = File.ReadAllText(_filePath);
            var ads = JsonSerializer.Deserialize<List<Ad>>(json);

            return ads is null
                ? RepoResult<List<Ad>>.Fail("נכשלה הקריאה מהקובץ")
                : RepoResult<List<Ad>>.Ok(ads);
        }
        catch (Exception ex)
        {
            return RepoResult<List<Ad>>.Fail("שגיאה בקריאת הקובץ: " + ex.Message);
        }
    }

    public RepoResult<bool> SaveAll(List<Ad> ads)
    {
        try
        {
            var dir = Path.GetDirectoryName(_filePath);
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir!);
            }

            var json = JsonSerializer.Serialize(ads, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, json);

            return RepoResult<bool>.Ok(true);
        }
        catch (Exception ex)
        {
            return RepoResult<bool>.Fail("נכשלה השמירה: " + ex.Message);
        }
    }
}
