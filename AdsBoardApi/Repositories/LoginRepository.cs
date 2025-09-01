using AdsBoardApi.Models;
using System.Text.Json;

namespace AdsBoardApi.Repositories
{
    public class LoginRepository
    {
        private readonly string _filePath = Path.Combine("Data", "users.json");
        public RepoResult<List<Login>> GetAll()
        {
            if (!File.Exists(_filePath))
                return RepoResult<List<Login>>.Fail("הקובץ לא נמצא");

            try
            {
                var json = File.ReadAllText(_filePath);
                var users = JsonSerializer.Deserialize<List<Login>>(json) ?? new List<Login>();
                return RepoResult<List<Login>>.Ok(users);
            }
            catch (Exception ex)
            {
                return RepoResult<List<Login>>.Fail("נכשלה הקריאה מהקובץ: " + ex.Message);
            }
        }

        public RepoResult<Login> SaveAll(List<Login> logins)
        {
            try
            {
                if (!File.Exists(_filePath))
                    return RepoResult<Login>.Fail("הקובץ לא נמצא");

                var json = JsonSerializer.Serialize(logins, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_filePath, json);

                return RepoResult<Login>.Ok(logins.First());
            }
            catch (Exception ex)
            {
                return RepoResult<Login>.Fail("השמירה נכשלה: " + ex.Message);
            }
        }

        public RepoResult<Login> Save(List<Login> logins, Login login)
        {
            try
            {
                if (!File.Exists(_filePath))
                    return RepoResult<Login>.Fail("הקובץ לא נמצא");

                var json = JsonSerializer.Serialize(logins, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_filePath, json);

                return RepoResult<Login>.Ok(login);
            }
            catch (Exception ex)
            {
                return RepoResult<Login>.Fail("השמירה נכשלה: " + ex.Message);
            }
        }
        public Login CreateUser(Login login )
        {

            return login;
        }
    }
}
