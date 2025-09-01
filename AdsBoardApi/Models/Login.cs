using System.Text.Json.Serialization;
using Microsoft.Extensions.Primitives;

namespace AdsBoardApi.Models
{
    public class Login
    {
        [JsonPropertyName("userId")]
        public string UserId { get; set; } = "";
        [JsonPropertyName("email")]
        public string Email { get; set; } = "";
        [JsonPropertyName("token")]
        public String Token { get; set; } = "";
    }
}
